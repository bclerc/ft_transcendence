import { ConsoleLogger, Inject } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { WebSocketServer, SubscribeMessage, WebSocketGateway, ConnectedSocket, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from "@nestjs/websockets";
import { Game, GameState } from "@prisma/client";
import { identity } from "rxjs";
import { Server, Socket } from "socket.io";
import { GameService } from "src/game/game.service";
import { OnlineUserService } from "src/onlineusers/onlineuser.service";
import { BasicUserI } from "src/user/interface/basicUser.interface";
import { GameI, InviteGameI, responseInvite } from "./interfaces/game.interface";
import { dataPlayerI } from "./interfaces/player.interface";
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
      private eventEmitter: EventEmitter2,                        // a delete
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
    

    for (let game of this.gamesMap.values())
    {
      if (game.player1.user && game.player1.user.id === user.id || game.player2.user && game.player2.user.id === user.id)
      {
        this.pongService.keydown(game, user, keydown);
        return ;
      }
    }
	}


	@SubscribeMessage('keyup')
	keyup(client: Socket, keyup: string) {
    const user = this.onlineUserService.getUser(client.id);
    if (!user)
      return ;


     for (let [key, game] of this.gamesMap.entries())
     {
       if (game.player1.user && game.player1.user.id === user.id || game.player2.user && game.player2.user.id === user.id)
       {
         this.pongService.keyup(game, user, keyup);
         return ;
       }
     }
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

  @SubscribeMessage('inviteUser')
  inviteUser(client: Socket, id: number) {
    this.invitePlayUser(client, id, this.gamesMap);
  }


  @SubscribeMessage('responseInvite')
  async responseInvite(client: Socket, response: responseInvite){
    const user = this.onlineUserService.getUser(client.id);
    this.sendToPlayers(user, 'notification', "vous avez accepté l'invitation");
    let game = this.gamesMap.get(response.gameId);
    if (game) {
      this.eventEmitter.emit('game.init', game);
    }

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


	public async creatNewGameMap(client: Socket, mapId: number): Promise<GameI> {
    const user: dataPlayerI = this.onlineUserService.getDataPlayer(client.id);
    console.log(user);
    if (!user)
      return ;

		var game: GameI = this.pongService.initState();
    var dbGame: Game = await this.gameService.createGame(user.id);

    if (game && dbGame)
    {
      console.log("creating new game with id:", dbGame.id);
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
  
  console.log("Size of gamesMap before: ", this.gamesMap.size);
  this.gamesMap.set(game.id, game);
  console.log("Size of gamesMap after: ", this.gamesMap.values(), this.gamesMap.get(game.id));

  return this.gamesMap.get(game.id);
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
        const newSpec = this.onlineUserService.getUser(spectator.id);
				game.spectators.push(newSpec);
				return ;
			}
		}
	}

  @OnEvent('game.init')
  async gameInit(game: GameI) {
    if (game && game.dbGame) {
       console.log("drawInit");
      console.log(game);
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
        await this.gameService.startGame(game.dbGame.id);
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

  @OnEvent('game.invite')
  async inviteGameEvent(data: InviteGameI) {
    if (data.user && data.target) {
      this.sendToPlayers(data.user, 'notification', "Vous avez invité " + data.target.displayname + " à jouer");
      this.sendToPlayers(data.target, 'invited', {
        gameId: data.gameId,
        inviter_name: data.user.displayname,
      })
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




  async invitePlayUser(client: Socket, id: number, games: Map<number, GameI>): Promise<void> {

      const inviter = this.onlineUserService.getUser(client.id);
      const target = this.onlineUserService.getUser(null, id);
      let game: GameI;
  
      // check if user && inviter is not in game 
      if (this.pongService.userIsInGame(inviter, games) || this.pongService.userIsInGame(target, games)) {
        console.log("Invitation fail");
      }
      // create game in waiting with two players
        game = await this.creatNewGameMap(client, 0);
        console.log(game);
        return ;
        let targetSocket = this.connectedUsers.get(target.id);
        await this.pongService.forceJoinGame(targetSocket, game);
      console.log("USSERE 2 JOINEED ================================", game);
      // send invite to target
  
      if (inviter && target && inviter.id !== target.id && game) {
        
        this.eventEmitter.emit('game.invite', {
          gameId: game.id,
          user: inviter,
          target: target,
        })
      
      }
    }









  sendToGame(game: GameI, event: string, data: any) {
    for (const user of [game.player1.user, game.player2.user]) {
      if (user) {
        this.sendToPlayers(user, event, data);
      }
    }
  }

  sendToPlayers(user: dataPlayerI, event: string, data: any) {
    const userSocket = this.connectedUsers.get(user.id);
    if (event && userSocket)
        this.server.to(userSocket).emit(event, data);
      //spectators
  }
}