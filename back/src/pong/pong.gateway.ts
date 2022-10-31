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

const PLAYER_HEIGHT = 65;
const PLAYER_WIDTH = 8;

const HEIGHTCANVAS = 400;
const WIDTHCANVAS = 600;

const NORMALGAME = 0;
const MAX_MAPID = 1;

const SPEED_PLAYER = 10

const RIGHTSIDE = 0;
const LEFTSIDE = 1;

// const MAX_SPEED = 12;


// const RANDOM = 2;
// const LEFT = 1;
// const RIGHT = 0;

// var idInterval :NodeJS.Timer;

@WebSocketGateway(8181, {
	cors: {
		origin: "*"
	}
})
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	@WebSocketServer()
	server: Server;
	
	// private logger: Logger = new Logger('PongGateway');
	state: GameI;
	allGames: GameI[];
	allRandomGames: GameI[];
	connectedUsers: UserI[];

	constructor(
		private pongService: PongService,
    @Inject(OnlineUserService) private onlineUserService: OnlineUserService,
	){
		this.connectedUsers = [];
		this.state = {};
		this.allGames = [];
		this.allRandomGames = [];
	};

	//////
	//Socket Handlers
	//////

	afterInit(server: Server) {
		// console.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.connectedUsers = this.connectedUsers.filter((user) => user.id != client.id);
		var g = this.allGames.find(game => (game.player1.socket === client));
		this.deleteGame(g);
	}
	  
	handleConnection(client: Socket, ...args: any[]) {
		// this.init(client); //draw le pong une premiere fois

    this.onlineUserService.newConnect(client);
		this.addNewUser(client); //ajoute le nouveau socket utilisateur au tableau des utilisateurs

	}


	//////
	//SOCKET.ON MESSAGES
	//////

	@SubscribeMessage('init')
	init(client: Socket){
		// afficher le pong au chargement de la page
		client.emit('drawInit');
		// client.emit('score', {
		// 	score1: 0,
		// 	score2: 0
		// });
		client.emit('enableButtonS');
	}

	@SubscribeMessage('keydownZ')
	keydownZ(client: Socket ){
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
			{
				if (game.player1.paddle.dy != - SPEED_PLAYER)
					game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
			}
			else
			{
				if (game.player2.paddle.dy != - SPEED_PLAYER)
					game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
			}
		}
		else
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game)
			{
				if (game.player1.socket === client)
				{
					if (game.player1.paddle.dy != - SPEED_PLAYER)
						game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
				}
				else
				{
					if (game.player2.paddle.dy != - SPEED_PLAYER)
						game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
				}
			}
		}
	}

	@SubscribeMessage('keydownW')
	keydownW(client: Socket){
		// console.log("keydownZ");
		// this.allGames.
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
			{
				if (game.player1.paddle.dy != -SPEED_PLAYER)
					game.player1.paddle.dy = game.player1.paddle.dy -SPEED_PLAYER;
			}
			else
			{
				if (game.player2.paddle.dy != -SPEED_PLAYER)
					game.player2.paddle.dy = game.player2.paddle.dy -SPEED_PLAYER;
			}
		}
		else
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game)
			{
				if (game.player1.socket === client)
				{
					if (game.player1.paddle.dy != - SPEED_PLAYER)
						game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
				}
				else
				{
					if (game.player2.paddle.dy != - SPEED_PLAYER)
						game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
				}
			}
		}

	}

	@SubscribeMessage('keydownS')
	keydownS(client: Socket){
		// console.log("keydownS");
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
			{
				if (game.player1.paddle.dy != SPEED_PLAYER)
					game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
			}
			else
			{
				if (game.player2.paddle.dy != SPEED_PLAYER)
					game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
			}
		}
		else
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game)
			{
				if (game.player1.socket === client)
				{
					if (game.player1.paddle.dy != SPEED_PLAYER)
						game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
				}
				else
				{
					if (game.player2.paddle.dy != SPEED_PLAYER)
						game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
				}
			}
		}
	}
	
	@SubscribeMessage('keyupZ')
	keyupZ(client: Socket){
		// console.log("key up!");
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
				game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
			else
				game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
		}
		else 
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game)
			{
				if (game.player1.socket === client)
					game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
				else
					game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
			}
		}
	}

	@SubscribeMessage('keyupW')
	keyupW(client: Socket){
		// console.log("key up!");
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
				game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
			else
				game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
		}
		else
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game)
			{
				if (game.player1.socket === client)
					game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
				else
					game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
			}	
		}
	}

	@SubscribeMessage('keyupS')
	keyupS(client: Socket){
		// console.log("key up!");
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
				game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
			else
				game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
		}
		else
		{
			var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
			if (game)
			{
				if (game.player1.socket === client)
					game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
				else
					game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
			}
		}
	}

	@SubscribeMessage('newGame')
	async newGame(client: Socket) {
		var game: GameI = this.searchGameAwaiting();
		// console.log(game);
		if (game)
		{
			//add user to game
			this.joinGame(client, game);
			client.emit('drawName', 0);
			await this.delay(1500);
			if (game.player1.socket)
				game.player1.socket.emit('stopSearchLoop', game.id_searchinterval1);
			if (game.player2.socket)
				game.player2.socket.emit('stopSearchLoop', game.id_searchinterval2);
			game.id_searchinterval1 = 0;
			game.id_searchinterval2 = 0;
			game.player1.socket.emit('drawInit');
			game.player2.socket.emit('drawInit');
			game.player1.socket.emit('drawText', "3");
			game.player2.socket.emit('drawText', "3");
			await this.delay(1000);
			game.player1.socket.emit('drawInit');
			game.player2.socket.emit('drawInit');
			game.player1.socket.emit('drawText', "2");
			game.player2.socket.emit('drawText', "2");
			await this.delay(1000);
			game.player1.socket.emit('drawInit');
			game.player2.socket.emit('drawInit');
			game.player1.socket.emit('drawText', "1");
			game.player2.socket.emit('drawText', "1");
			await this.delay(1000);
			game.player1.socket.emit('drawInit');
			game.player2.socket.emit('drawInit');
			game.player1.socket.emit('drawText', "Start !");
			game.player2.socket.emit('drawText', "Start !");
      console.log("User " + game.player1.user.intra_name + " and " + game.player2.user.intra_name + " are playing");
			await this.delay(200);
      this.server.emit('user1', game.player1.user);
      this.server.emit('user2', game.player2.user);

			this.startGame(game, NORMALGAME);
			// console.log(game);
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
		// console.log(game);
		if (game)
		{
			//add user to game
			this.joinGame(client, game);
			client.emit('drawName', RIGHTSIDE);

			/////
			// choose random map id
			/////
			var x = Math.floor(Math.random() * (MAX_MAPID - 1 + 1) + 1);
			// console.log("x = ", x);

			await this.delay(1500);
			if (game.player1.socket)
				game.player1.socket.emit('stopSearchLoop', game.id_searchinterval1);
			if (game.player2.socket)
				game.player2.socket.emit('stopSearchLoop', game.id_searchinterval2);
			game.id_searchinterval1 = 0;
			game.id_searchinterval2 = 0;
			game.player1.socket.emit('drawInit');
			game.player2.socket.emit('drawInit');
			game.player1.socket.emit('drawText', "3");
			game.player2.socket.emit('drawText', "3");
			await this.delay(1000);
			game.player1.socket.emit('drawInit');
			game.player2.socket.emit('drawInit');
			game.player1.socket.emit('drawText', "2");
			game.player2.socket.emit('drawText', "2");
			await this.delay(1000);
			game.player1.socket.emit('drawInit');
			game.player2.socket.emit('drawInit');
			game.player1.socket.emit('drawText', "1");
			game.player2.socket.emit('drawText', "1");
			await this.delay(1000);
			game.player1.socket.emit('drawInit');
			game.player2.socket.emit('drawInit');
			game.player1.socket.emit('drawText', "Start !");
			game.player2.socket.emit('drawText', "Start !");
      console.log("User " + game.player1.user.intra_name + " and " + game.player2.user.intra_name + " are playing");

			await this.delay(200);
			// console.log("x = ", x);
			this.startGame(game, x);
		}
		else
		{
			game = this.creatNewGameRandom(client);
			client.emit('drawName', LEFTSIDE);
		}
	}
	
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
		// console.log(game.id_searchinterval1);
		// console.log(game.id_searchinterval2);
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
		// console.log(game.id_searchinterval1);
		// console.log(game.id_searchinterval2);
	}
	
	@SubscribeMessage("stopGame")
	stopgame(client: Socket)
	{
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		// console.log(game);
		if (game){
			clearInterval(game.id_interval);
			if (game.player1)
				this.init(game.player1.socket);
			if (game.player2)
			this.init(game.player2.socket);
			this.deleteGame(game);
		}
	}

	// @SubscribeMessage("getStateNormal")
	// getState(client: Socket)
	// {
	// 	var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
	// 	if (game)
	// 		client.emit('gameState', game);
	// }

	// @SubscribeMessage("getStateRandom")
	// getStateRandom(client: Socket)
	// {
	// 	var game: GameI = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
	// 	if (game)
	// 		client.emit('gameState', game);
	// }

	
	
	
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
			game.id_interval = setInterval(() => {
				this.pongService.loopGameMap1(game);
			}, 1000/60);
		}
	}

	// async startGameTest(game: GameI){
	// 		this.pongService.loopGameNormal(game);
	// }

	// startGameAnimationFrame(game: GameI){
	// async startGame(game: GameI, mapid: number){
	// 	this.pongService.loopGameNormal(game);
	// }


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
			// acceleration: game.acceleration,
			// direction: game.direction,
			ball: game.ball
		}
		this.allGames.push(game);
		// console.log(this.allGames);
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
			// acceleration: game.acceleration,
			// direction: game.direction,
			ball: game.ball
		}
		// console.log("ici !!!!!!!!!!!!!!!!!!!!");
		this.allRandomGames.push(game);
		// console.log(this.allGames);
		return game;
	}


	joinGame(client: Socket, game: GameI){
		game.player2 = {
      user: this.onlineUserService.getUser(client.id),
			socket: client,
			paddle: {
				x: WIDTHCANVAS - PLAYER_WIDTH,
				y: HEIGHTCANVAS / 2 - PLAYER_HEIGHT / 2,
				dx: 0,
				dy: 0,
				width: PLAYER_WIDTH,
				height: PLAYER_HEIGHT
			},
    		points: 0,
		}
	}

	deleteGame(g: GameI){
		var newAllGames: GameI[] = this.allGames.filter(game => game != g);
		// console.log(newAllGames);
		// console.log("newAllGames");
		this.allGames = newAllGames;
	}

	delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	}
}