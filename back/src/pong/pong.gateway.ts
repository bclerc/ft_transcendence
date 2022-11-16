import { Inject } from "@nestjs/common";
import { WebSocketServer, SubscribeMessage, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from "@nestjs/websockets";
import { Game } from "@prisma/client";
import { identity } from "rxjs";
import { Server, Socket } from "socket.io";
import { GameService } from "src/game/game.service";
import { OnlineUserService } from "src/onlineusers/onlineuser.service";
import { GameI } from "./interfaces/game.interface";
import { UserI } from "./interfaces/user.interface";
import { PongService } from "./services/pong.service";

const NORMALGAME = 0;
const MAX_MAP = 3;

@WebSocketGateway(8181, {
	cors: {
		origin: "*"
	}
})
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	@WebSocketServer()
	server: Server;
	state: GameI;
	gamesMap: Map<string, GameI>;
	connectedUsers: UserI[];


	constructor(
		private pongService: PongService,
	    @Inject(OnlineUserService) private onlineUserService: OnlineUserService,
      @Inject(GameService) private gameService: GameService,
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
		// this.allGames = [];
		// this.allRandomGames = [];
		this.gamesMap = new Map<string, GameI>;
	};

	//////
	//Socket Handlers
	//////

	afterInit(server: Server) {
	}

	handleDisconnect(client: Socket) {
		// this.connectedUsers = this.connectedUsers.filter((user) => user.id != client.id);

		// var g = this.allGames.find(game => (game.player1.socket === client));
		// if (g)
		// 	this.pongService.deleteGame(g, this.allGames);
		// else
		// {
		// 	var g = this.allRandomGames.find(game => (game.player1.socket === client));
		// 	if (g)
		// 		this.pongService.deleteGame(g, this.allRandomGames);
		// }
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
		// client.emit('drawInit');
		client.emit('enableButtonS');
	}

	////////
	///KEYS HANDLER
	///////


	@SubscribeMessage('keydown')
	keydown(client: Socket, keydown: string){
		// console.log("ici", id);
		// let game = this.gamesMap.get(id);
		// this.pongService.keydown(game, client, keydown);
		for (let game of this.gamesMap.values())
		{
			if (game.player1 && client === game.player1.socket || game.player2 && client === game.player2.socket)
				this.pongService.keydown(game, client, keydown);
		}
	}


	@SubscribeMessage('keyup')
	keyup(client: Socket, keyup: string)
	{
		for (let game of this.gamesMap.values())
		{
			if (game.player1 && client === game.player1.socket || game.player2 && client === game.player2.socket)
				this.pongService.keyup(game, client, keyup);
		}
	}

	////////
	//GAME HANDLER
	///////

	@SubscribeMessage('newGame')
	async newGame(client: Socket, normalOrNot: boolean)
	{
		// var game: GameI = this.searchGameAwaiting();
    let dbGame: Game;
		let game: GameI = this.searchGameMapAwaiting(normalOrNot);
		if (game)
		{
			console.log(game);
			this.pongService.joinGame(client, game);
			// client.emit('drawName', 0);
      game.dbGame = await this.gameService.createGame([game.player1.user, game.player2.user]);
			await this.pongService.delay(1500);
			if (game.player1.socket)
				game.player1.socket.emit('stopSearchLoop', game.id_searchinterval1);
			if (game.player2.socket)
				game.player2.socket.emit('stopSearchLoop', game.id_searchinterval2);
			// console.log(game.id_searchinterval1, game.id_searchinterval2);
			game.id_searchinterval1 = 0;
			game.id_searchinterval2 = 0;
			await this.pongService.drawInit(game);
			console.log("game started");
			game.player1.socket.emit('user1',game.player1.user);
			game.player1.socket.emit('user2',game.player2.user);
			game.player2.socket.emit('user1',game.player1.user);
			game.player2.socket.emit('user2',game.player2.user);

			//le front ne sauvegarde pas l'id de la map bordel de mierde de la madre de dia
			//obliger de boucler a chaque keyboardEvent
			// game.player1.socket.emit('getId', game.id); 
			// game.player2.socket.emit('getId', game.id);

			await this.pongService.startGame(game, game.mapId);
			// console.log("bordel de merde");
			// this.gamesMap.delete(game.id);
		}
		else
		{
			if (normalOrNot == true)
				this.creatNewGameMap(client, NORMALGAME);
			else
			{
				// var x = 3; 		// choose random map id
				var x = Math.floor(Math.random() * (MAX_MAP - 1 + 1) + 1); 		// choose random map id
				this.creatNewGameMap(client, x);
			}
		}
	}
	
	// @SubscribeMessage('getId')
	// getId(client: Socket){
	// 	for (let value of this.gamesMap.values())
	// 	{
	// 		if (value.player1.socket === client || (value.player2 && value.player2.socket === client))
	// 		{
	// 			client.emit('state', value.id);
	// 			console.log("getidbackfrero");
	// 			return ;
	// 		}	
	// 	}
	// }

	////////
	///LOOP HANDLER SEARCHING OPPONENT
	///////

	@SubscribeMessage('id_intervalmap')
	varSearchLoopMap(client: Socket, id: number){
		for (let value of this.gamesMap.values()) {
			if (value.player1.socket === client)
				value.id_searchinterval1 = id;
			else if (value.player2 && value.player2.socket === client)
				value.id_searchinterval2 = id;
		}
		return undefined;
	}

	///////
	//OTHER
	//////

	private searchGameMapAwaiting(normalOrNot: boolean): GameI {
		if (normalOrNot)
		{
			for (let value of this.gamesMap.values()) {
				if (value.mapId === NORMALGAME && value.player2 === undefined)
					return value;
			}
		}
		else
		{
			for (let value of this.gamesMap.values()) {
				if (value.mapId !== NORMALGAME && value.player2 === undefined)
					return value;
			}
		}
		return undefined;
	}

	private addNewUser(client: Socket)
	{
		var user: UserI = {
			id: client.id
		}
		this.connectedUsers.push(user);
	}

	private creatNewGameMap(client: Socket, mapId: number) {
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
			mapId: mapId,
			ball: game.ball,
			obstacle: game.obstacle
		}

		//Random uniqId:


		this.gamesMap.set(game.id, game);
		console.log(game);
		// client.emit("getId", game.id);
		// this.allGames.push(game);
	}

	@SubscribeMessage('spectacle')
	addSpectatorByIntraName(spectator: Socket, toWatch: string, /* idGame: string ??? pour eviter de chercher dans la map*/)
	{
		for (let game of this.gamesMap.values())
		{
			if (game.player1 && game.player1.user.intra_name === toWatch || game.player2 && game.player2.user.intra_name === toWatch)
			{
				game.spectators.push(spectator);
				return ;
			}
		}
	}
}