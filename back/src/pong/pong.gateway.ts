import { Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { WebSocketServer, SubscribeMessage, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from "@nestjs/websockets";
import { Game } from "@prisma/client";
import { identity } from "rxjs";
import { Server, Socket } from "socket.io";
import { GameService } from "src/game/game.service";
import { OnlineUserService } from "src/onlineusers/onlineuser.service";
import { BasicUserI } from "src/user/interface/basicUser.interface";
import { GameI } from "./interfaces/game.interface";
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
	gamesMap: Map<number, GameI>;
	connectedUsers: Map<number, string> = new Map<number, string>();

	constructor(
		private pongService: PongService,
	    @Inject(OnlineUserService) private onlineUserService: OnlineUserService,
      @Inject(GameService) private gameService: GameService,
	){
		
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
		this.gamesMap = new Map<number, GameI>;
	};

	//////
	//Socket Handlers
	//////

	afterInit(server: Server) {
	}

	handleDisconnect(client: Socket) {

    const user = this.onlineUserService.getUser(client.id);
    if (user && user.id)
      this.connectedUsers.delete(user.id);

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
	  
	async handleConnection(client: Socket) {
	  const user: BasicUserI = await this.onlineUserService.newConnect(client);
    
    if (user && user.id)
    {
      this.connectedUsers.set(user.id, client.id);
      client.emit('enableButtonS');
    }
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
	keydown(client: Socket, keydown: string) {
    const user = this.onlineUserService.getUser(client.id);

    this.gamesMap.forEach((game, id) => {
      if (game.player1.user.id === user.id || game.player2.user.id === user.id)
      {
        this.pongService.keydown(game, user, keydown);
        return ;
      }
		});
	}


	@SubscribeMessage('keyup')
	keyup(client: Socket, keyup: string) {
    const user = this.onlineUserService.getUser(client.id);
    if (!user)
      return ;
    this.gamesMap.forEach((game, id) => {
      if ((game.player1 && !game.player1.user) || (game.player2 && !game.player2.user))
        return ; 
      if (game.player1.user.id === user.id || game.player2.user.id === user.id)
      {
        this.pongService.keyup(game, user, keyup);
        return ;
      }
		});
	}

	////////
	//GAME HANDLER
	///////

	@SubscribeMessage('newGame')
	async newGame(client: Socket, normalOrNot: boolean)
	{
    let user = this.onlineUserService.getUser(client.id);
    if (user)
    {
      if (this.pongService.userIsInGame(user, this.gamesMap))
      {
        client.emit('notification', "Vous êtes déjà dans une partie");
         return ;
      }
    }

		// var game: GameI = this.searchGameAwaiting();
		let game: GameI = this.searchGameMapAwaiting(normalOrNot);
		if (game)
		{

			console.log("Match found " + client.id + " joined game " + game.id);

			this.pongService.joinGame(client, game);
			// client.emit('drawName', 0);

			await this.pongService.delay(1500);

      this.sendToPlayers(game.player1.user, 'stopSearchLoop', game.id_searchinterval1);
      this.sendToPlayers(game.player2.user, 'stopSearchLoop', game.id_searchinterval2);

			game.id_searchinterval1 = 0;
			game.id_searchinterval2 = 0;

			await this.pongService.drawInit(game);

			//le front ne sauvegarde pas l'id de la map bordel de mierde de la madre de dia
			//obliger de boucler a chaque keyboardEvent
			// game.player1.socket.emit('getId', game.id); 
			// game.player2.socket.emit('getId', game.id);


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
	// 			return ;
	// 		}	
	// 	}
	// }

	////////
	///LOOP HANDLER SEARCHING OPPONENT
	///////

	@SubscribeMessage('id_intervalmap')
	varSearchLoopMap(client: Socket, id: number){
    const user = this.onlineUserService.getUser(client.id);
    if (user) {
      for (let value of this.gamesMap.values()) {
        if (value.player1.user.id === user.id)
				value.id_searchinterval1 = id;
        else if (value.player2 && value.player2.user.id === user.id)
				value.id_searchinterval2 = id;
      }
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


	private async creatNewGameMap(client: Socket, mapId: number) {
    const user = this.onlineUserService.getUser(client.id);
		var game: GameI = this.pongService.initState();
    var dbGame: Game = await this.gameService.createGame(user);

    if (game && dbGame)
    {
      console.log("No match found, creating new game with id:", dbGame.id);

      game = {
			id: dbGame.id,
			player1: {
        user: user,
				paddle: game.player1.paddle,
				points: game.player1.points,
			},
			player2: undefined,
			mapId: mapId,
			ball: game.ball,
			spectators: [],
			obstacle: game.obstacle,
	      	dbGame: dbGame
		}
  }
    
		//Random uniqId:

    
		this.gamesMap.set(game.id, game);
		// client.emit("getId", game.id);
		// this.allGames.push(game);
	}

	@SubscribeMessage('spectate')
	addSpectator(spectator: Socket, idGame: number)
	{
		for (let game of this.gamesMap.values())
		{
			if (game.id === idGame)
			{
				const newSpec = this.onlineUserService.getUser(spectator.id);
				game.spectators.push(newSpec);
				return ;
			}
		}
	}

	@SubscribeMessage('deleteSpectate')
	dellSpectator(spectator: Socket, idGame: number)
	{
		for (let game of this.gamesMap.values())
		{
			if (game.id === idGame)
			{
				const newSpec = this.onlineUserService.getUser(spectator.id);
				game.spectators.splice(game.spectators.indexOf(newSpec), 1);
				return ;
			}
		}
	}

  @OnEvent('game.init')
  async gameInit(game: GameI) {
    if (game && game.dbGame) {
    //   console.log("drawInit");
      this.sendToGame(game, 'redirectGame', game.id);
      this.sendToGame(game, 'drawInit', null);
      this.sendToGame(game, 'drawText', "3");
      await this.pongService.delay(1000);
      this.sendToGame(game, 'drawInit', null);
      this.sendToGame(game, 'drawText', "2");
      await this.pongService.delay(1000);
      this.sendToGame(game, 'drawInit', null);
      this.sendToGame(game, 'drawText', "1");
      await this.pongService.delay(1000);
      this.sendToGame(game, 'drawInit', null);
      this.sendToGame(game, 'drawText', "Start");
      await this.pongService.delay(200);
      if (game.dbGame)
      {
        this.gameService.startGame(game.dbGame.id);
        await this.pongService.startGame(game, game.mapId);
      }
    }
  }

  @OnEvent('game.users.matched')
  async matchedUsersEvent(data: any){

    this.sendToPlayers(data.player1.user, 'notification', "Vous avez matché avec " + data.player2.user.displayname);
    this.sendToPlayers(data.player2.user, 'notification', "Vous avez matché avec " + data.player1.user.displayname);

  }

  @OnEvent('game.draw')
  async updateGameEvent(map: string, game: GameI) {
    if (game && game.dbGame) {
        const score = {
          score1: game.player1.points,
          score2: game.player2.points
      }
      for (const user of [game.player1.user, game.player2.user, ...game.spectators]) {
         const userSocket = this.connectedUsers.get(user.id);
        if (user && user && user.id) {
          this.server.to(userSocket).emit(map, game);
          this.server.to(userSocket).emit('score', score);
        }
      }
    }
  }

  @OnEvent('game.end')
  async endGameEvent(game: GameI, winnerId: number, loserId: number) {
    const winnerSocket = this.connectedUsers.get(winnerId);
    const loserSocket = this.connectedUsers.get(loserId);
    if (game && game.dbGame) {
      this.server.to(winnerSocket).emit('win');
      this.server.to(loserSocket).emit('lose');

    }
  }

	@OnEvent('deleteGame')
	deleteGame(game: GameI) {
		console.log("deleteGame");
		this.gamesMap.delete(game.id);
	}

  sendToGame(game: GameI, event: string, data: any) {
    for (const user of [game.player1.user, game.player2.user]) {
      if (user) {
        this.sendToPlayers(user, event, data);
      }
    }
  }

  sendToPlayers(user: BasicUserI, event: string, data: any) {
    const userSocket = this.connectedUsers.get(user.id);
    if (event && userSocket)
        this.server.to(userSocket).emit(event, data);
      //spectators
  }
}