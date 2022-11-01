// import { Logger } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { WebSocketServer, SubscribeMessage, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OnlineUserService } from "src/onlineusers/onlineuser.service";
import { GameI } from "./interfaces/game.interface";
// import { PlayerI } from "./interfaces/player.interface";
import { UserI } from "./interfaces/user.interface";
import { PongService } from "./services/pong.service";
// import { PointI } from "./interfaces/point.interface";

// const PLAYER_HEIGHT = 65;
// const PLAYER_WIDTH = 8;

// const HEIGHTCANVAS = 400;
// const WIDTHCANVAS = 600;

const NORMALGAME = 0;
const MAX_MAPID = 1;

// const SPEED_PLAYER = 10

const RIGHTSIDE = 0;
const LEFTSIDE = 1;

@WebSocketGateway(8181, {
	cors: {
		origin: "*"
	}
})
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	@WebSocketServer()
	server: Server;

	state: GameI;
	allGames: GameI[];
	allRandomGames: GameI[];
	connectedUsers: UserI[];

	constructor(
		private pongService: PongService,
	    @Inject(OnlineUserService) private onlineUserService: OnlineUserService,
	){
		this.connectedUsers = [];
		this.state = {
			obstacle: {
				x:0,
				y:0,
				dx:0,
				dy:0,
				height:0,
				width:0
			}
		};
		this.allGames = [];
		this.allRandomGames = [];
	};

	//////
	//Socket Handlers
	//////

	afterInit(server: Server) {
	}

	handleDisconnect(client: Socket) {
		this.connectedUsers = this.connectedUsers.filter((user) => user.id != client.id);
		var g = this.allGames.find(game => (game.player1.socket === client));
		if (g)
			this.pongService.deleteGame(g, this.allGames);
		else
		{
			var g = this.allRandomGames.find(game => (game.player1.socket === client));
			if (g)
				this.pongService.deleteGame(g, this.allRandomGames);
		}
	}
	  
	handleConnection(client: Socket, ...args: any[]) {
	    this.onlineUserService.newConnect(client);
		this.addNewUser(client); //ajoute le nouveau socket utilisateur au tableau des utilisateurs
	}


	//////
	//SOCKET.ON MESSAGES
	//////

	@SubscribeMessage('init')
	init(client: Socket){
		client.emit('drawInit');
		client.emit('enableButtonS');
	}

	////////
	///KEYS HANDLER
	///////

	@SubscribeMessage('keydownZ')
	keydownZ(client: Socket ){
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
			this.pongService.keydownZ(game, client);
		else
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game)
				this.pongService.keydownZ(game, client);
		}
	}

	@SubscribeMessage('keydownS')
	keydownS(client: Socket){
		// console.log("keydownS");
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
			this.pongService.keydownS(game, client);
		else
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game)
				this.pongService.keydownS(game, client);
		}
	}
	
	@SubscribeMessage('keyupZ')
	keyupZ(client: Socket){
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
			this.pongService.keyupZ(game, client);
		else 
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game)
				this.pongService.keyupZ(game, client);
		}
	}

	@SubscribeMessage('keyupS')
	keyupS(client: Socket){
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
			this.pongService.keyupS(game, client);
		else
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game)
				this.pongService.keyupS(game, client);
		}
	}

	////////
	//GAME HANDLER
	///////

	@SubscribeMessage('newGame')
	async newGame(client: Socket) {
		var game: GameI = this.searchGameAwaiting();
		if (game)
		{
			this.pongService.joinGame(client, game);
			client.emit('drawName', 0);
			await this.pongService.delay(1500);
			if (game.player1.socket)
				game.player1.socket.emit('stopSearchLoop', game.id_searchinterval1);
			if (game.player2.socket)
				game.player2.socket.emit('stopSearchLoop', game.id_searchinterval2);
			game.id_searchinterval1 = 0;
			game.id_searchinterval2 = 0;
			await this.pongService.drawInit(game);
	      	this.server.emit('user1', game.player1.user);
      		this.server.emit('user2', game.player2.user);
			this.startGame(game, NORMALGAME);
		}
		else
		{
			game = this.creatNewGame(client);
			client.emit('drawName', 1);
		}
	}


	@SubscribeMessage('newGameRandom')
	async newGameRandom(client: Socket) {
		var game: GameI = this.searchGameAwaitingRandom();
		if (game)
		{
			this.pongService.joinGame(client, game);
			client.emit('drawName', RIGHTSIDE);
			/////
			// choose random map id
			/////
			// var x = Math.floor(Math.random() * (MAX_MAPID - 1 + 1) + 1);
			var x = 2;
			
			await this.pongService.delay(1500);
			if (game.player1.socket)
			game.player1.socket.emit('stopSearchLoop', game.id_searchinterval1);
			if (game.player2.socket)
			game.player2.socket.emit('stopSearchLoop', game.id_searchinterval2);
			game.id_searchinterval1 = 0;
			game.id_searchinterval2 = 0;
			await this.pongService.drawInit(game);
			this.startGame(game, x);
		}
		else
		{
			game = this.creatNewGameRandom(client);
			client.emit('drawName', LEFTSIDE);
		}
	}

	@SubscribeMessage("stopGame")
	stopgame(client: Socket)
	{
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game){
			clearInterval(game.id_interval);
			if (game.player1)
				this.init(game.player1.socket);
			if (game.player2)
				this.init(game.player2.socket);
			this.pongService.deleteGame(game, this.allGames);
		}
		else
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game){
				clearInterval(game.id_interval);
				if (game.player1)
					this.init(game.player1.socket);
				if (game.player2)
					this.init(game.player2.socket);
				this.pongService.deleteGame(game, this.allRandomGames);
			}	
		}
	}
	
	////////
	///LOOP HANDLER
	///////

	@SubscribeMessage('id_interval')
	varSearchLoop(client: Socket, id: number){
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
				game.id_searchinterval1 = id;
			else
				game.id_searchinterval2 = id;
		}
	}

	@SubscribeMessage('id_intervalRandom')
	varSearchLoopRandom(client: Socket, id: number){
		var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
				game.id_searchinterval1 = id;
			else
				game.id_searchinterval2 = id;
		}
	}
	
	
///////
//A TRIER
//////

	private addNewUser(client: Socket)
	{
		var user: UserI = {
			id: client.id
		}
		this.connectedUsers.push(user);
	}
	

	async startGame(game: GameI, mapid: number){
			if (mapid === 0)
		{
			game.id_interval = setInterval(() => {
				this.pongService.loopGameNormal(game);
			}, 1000/60);
		}
		else if (mapid === 1)
		{
			console.log("ici back 01")
			game.id_interval = setInterval(() => {
				this.pongService.loopGameMap1(game);
			}, 1000/60);
		}
		else if (mapid === 2)
		{
			console.log("ici back 02")
			game.id_interval = setInterval(() => {
				this.pongService.loopGameMap2(game);
			}, 1000/60);
		}
	}

	searchGameAwaiting(): GameI {
		return this.allGames.find(game => (game.player1 != undefined && game.player2 != undefined) ? false : true);
	}

	searchGameAwaitingRandom(): GameI {
		return this.allRandomGames.find(game => (game == undefined || (game.player1 != undefined && game.player2 != undefined)) ? false : true);
	}
	
	creatNewGame(client: Socket): GameI {
		var game: GameI = this.pongService.initState();
		game = {
			id: client.id,
			player1: {
        user: this.onlineUserService.getUser(client.id),
				socket: client,
				paddle: game.player1.paddle,
				points: game.player1.points,
			},
			player2: undefined,
			ball: game.ball,
			obstacle: game.obstacle
		}
		this.allGames.push(game);
		return game;
	}

	creatNewGameRandom(client: Socket): GameI {
		var game: GameI = this.pongService.initState();
		game = {
			id: client.id,
			player1: {
        user: this.onlineUserService.getUser(client.id),
				socket: client,
				paddle: game.player1.paddle,
				points: game.player1.points,
			},
			player2: undefined,
			ball: game.ball,
			obstacle: game.obstacle
		}
		this.allRandomGames.push(game);
		return game;
	}


	// joinGame(client: Socket, game: GameI){
	// 	game.player2 = {
    //   user: this.onlineUserService.getUser(client.id),
	// 		socket: client,
	// 		paddle: {
	// 			x: WIDTHCANVAS - PLAYER_WIDTH,
	// 			y: HEIGHTCANVAS / 2 - PLAYER_HEIGHT / 2,
	// 			dx: 0,
	// 			dy: 0,
	// 			width: PLAYER_WIDTH,
	// 			height: PLAYER_HEIGHT
	// 		},
    // 		points: 0,
	// 	}
	// }

	// deleteGame(g: GameI){
	// 	var newAllGames: GameI[] = this.allGames.filter(game => game != g);
	// 	this.allGames = newAllGames;
	// }

}