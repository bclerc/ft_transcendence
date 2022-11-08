import { Inject } from "@nestjs/common";
import { WebSocketServer, SubscribeMessage, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OnlineUserService } from "src/onlineusers/onlineuser.service";
import { GameI } from "./interfaces/game.interface";
import { UserI } from "./interfaces/user.interface";
import { PongService } from "./services/pong.service";
import { VariablePong } from "./variables.pong";

const NORMALGAME = 0;
const MAX_MAP = 3;
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
		console.log("constructor gate");
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
			console.log(game.id_searchinterval1,  game.id_searchinterval2);
			game.id_searchinterval1 = 0;
			game.id_searchinterval2 = 0;
			await this.pongService.drawInit(game);
	      	this.server.emit('user1', game.player1.user);
      		this.server.emit('user2', game.player2.user);
			await this.pongService.startGame(game, NORMALGAME);
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
			// var x = Math.floor(Math.random() * (MAX_MAP - 1 + 1) + 1); 		// choose random map id
			var x = 3; //pour les tests je prends celle que je souhaite tester
		
			await this.pongService.delay(1500);
			if (game.player1.socket)
			game.player1.socket.emit('stopSearchLoop', game.id_searchinterval1);
			if (game.player2.socket)
			game.player2.socket.emit('stopSearchLoop', game.id_searchinterval2);
			console.log(game.id_searchinterval1,  game.id_searchinterval2);
			game.id_searchinterval1 = 0;
			game.id_searchinterval2 = 0;
			await this.pongService.drawInit(game);
			this.server.emit('user1', game.player1.user);
			this.server.emit('user2', game.player2.user);
			await this.pongService.startGame(game, x);
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
		if (game)
		{
			clearInterval(game.id_interval);
			if (game.player1)
				this.init(game.player1.socket);
			if (game.player2)
				this.init(game.player2.socket);
			this.pongService.deleteGame(game, this.allGames);
			console.log("stop1")
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
				console.log("stop2")
			}	
		}
	}
	
	////////
	///LOOP HANDLER SEARCHING OPPONENT
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
	//OTHER
	//////

	private searchGameAwaiting(): GameI {
		return this.allGames.find(game => (game.player1 != undefined && game.player2 != undefined) ? false : true);
	}

	private searchGameAwaitingRandom(): GameI {
		return this.allRandomGames.find(game => (game == undefined || (game.player1 != undefined && game.player2 != undefined)) ? false : true);
	}

	private addNewUser(client: Socket)
	{
		var user: UserI = {
			id: client.id
		}
		this.connectedUsers.push(user);
	}
	
	private creatNewGame(client: Socket): GameI {
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

	private creatNewGameRandom(client: Socket): GameI {
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

}