// import { Logger } from "@nestjs/common";
import { WebSocketServer, SubscribeMessage, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameI } from "./interfaces/game.interface";
// import { PlayerI } from "./interfaces/player.interface";
import { UserI } from "./interfaces/user.interface";
import { PongService } from "./services/pong.service";
// import { PointI } from "./interfaces/point.interface";

const PLAYER_HEIGHT = 65;
const PLAYER_WIDTH = 8;

const HEIGHTCANVAS = 400;
const WIDTHCANVAS = 500;

// const MAX_SPEED = 12;


// const RANDOM = 2;
// const LEFT = 1;
// const RIGHT = 0;

// var idInterval :NodeJS.Timer;

@WebSocketGateway(81, {
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
	connectedUsers: UserI[];

	constructor(
		private pongService: PongService,
	){
		this.connectedUsers = [];
		this.state = {};
		this.allGames = [];
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
		this.init(client); //draw le pong une premiere fois
		this.addNewUser(client); //ajoute le nouveau socket utilisateur au tableau des utilisateurs
	}


	//////
	//SOCKET.ON MESSAGES
	//////

	// @SubscribeMessage('init')
	private init(client: Socket){
		// afficher le pong au chargement de la page
		client.emit('drawInit');
		// client.emit('score', {
		// 	score1: 0,
		// 	score2: 0
		// });
		client.emit('enableButtonS');
	}

	@SubscribeMessage('keydownZ')
	keydownZ(client: Socket){
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
			{
				if (game.player1.paddle.dy != -3)
					game.player1.paddle.dy = game.player1.paddle.dy -3;
			}
			else
			{
				if (game.player2.paddle.dy != -3)
					game.player2.paddle.dy = game.player2.paddle.dy -3;
			}
		}
	}

	@SubscribeMessage('keydownW')
	keydownW(client: Socket){
		// console.log("keydownZ");
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
			{
				if (game.player1.paddle.dy != -3)
					game.player1.paddle.dy = game.player1.paddle.dy -3;
			}
			else
			{
				if (game.player2.paddle.dy != -3)
					game.player2.paddle.dy = game.player2.paddle.dy -3;
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
				if (game.player1.paddle.dy != 3)
					game.player1.paddle.dy = game.player1.paddle.dy + 3;
			}
			else
			{
				if (game.player2.paddle.dy != 3)
					game.player2.paddle.dy = game.player2.paddle.dy + 3;
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
				game.player1.paddle.dy = game.player1.paddle.dy + 3;
			else
				game.player2.paddle.dy = game.player2.paddle.dy + 3;
		}
	}

	@SubscribeMessage('keyupW')
	keyupW(client: Socket){
		// console.log("key up!");
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
				game.player1.paddle.dy = game.player1.paddle.dy + 3;
			else
				game.player2.paddle.dy = game.player2.paddle.dy + 3;
		}
	}

	@SubscribeMessage('keyupS')
	keyupS(client: Socket){
		// console.log("key up!");
		var game: GameI = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
		if (game)
		{
			if (game.player1.socket === client)
				game.player1.paddle.dy = game.player1.paddle.dy - 3;
			else
				game.player2.paddle.dy = game.player2.paddle.dy - 3;
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
			await this.delay(200);
			this.startGame(game);
			// console.log(game);
		}
		else
		{
			game = this.creatNewGame(client);
			client.emit('drawName', 1);
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
	
	private addNewUser(client: Socket)
	{
		var user: UserI = {
			id: client.id
		}
		this.connectedUsers.push(user);
	}


	async startGame(game: GameI){
		game.id_interval = setInterval(() => {
			// console.log(game);
			this.pongService.loopGame(game);
			// if (game.id_searchinterval1 && game.id_searchinterval1 != 0)
			// {
			// 	game.player1.socket.emit('stopSearchLoop', game.id_searchinterval1);
			// 	game.id_searchinterval1 = 0;
			// }
			// if (game.id_searchinterval2 && game.id_searchinterval2 != 0)
			// {
			// 	game.player2.socket.emit('stopSearchLoop', game.id_searchinterval2);
			// 	game.id_searchinterval2 = 0;
			// }
			// console.log(game);
			// game.player1.socket.emit('draw', game);
			// game.player2.socket.emit('draw', game);
		}, 1000/60);
	}

	startGameAnimationFrame(game: GameI){
		this.pongService.loopGame(game);
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

	searchGameAwaiting(): GameI {
		return this.allGames.find(game => (game.player1 != undefined && game.player2 != undefined) ? false : true);
	}

	creatNewGame(client: Socket): GameI {
		var game: GameI = this.pongService.initState();
		game = {
			id: client.id,
			player1: {
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

	joinGame(client: Socket, game: GameI){
		game.player2 = {
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