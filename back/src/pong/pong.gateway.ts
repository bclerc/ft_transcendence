import { Inject } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { WebSocketServer, SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect } from "@nestjs/websockets";
import { Game } from "@prisma/client";
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

export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {

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
  ) {
    this.state = {
      obstacle: {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        height: 0,
        width: 0
      }
    };
    this.gamesMap = new Map<number, GameI>;
  };

  //////
  //Socket Handlers
  //////

  handleDisconnect(client: Socket) {
    const user = this.onlineUserService.getUser(client.id);
    if (user && user.id) {
      this.connectedUsers.delete(user.id);
    }
  }

  async handleConnection(client: Socket) {
    const user: BasicUserI = await this.onlineUserService.newConnect(client);

    if (!user)
      client.disconnect();

    if (user && user.id) {
      if (this.connectedUsers.has(user.id))
        this.connectedUsers.delete(user.id);
      this.connectedUsers.set(user.id, client.id);
    }
  }

  ////////
  ///KEYS HANDLER
  ///////

  @SubscribeMessage('keydown')
  keydown(client: Socket, keydown: string) {
    const user = this.onlineUserService.getUser(client.id);

    for (let game of this.gamesMap.values()) {
      if (game.player1 && game.player1.user && game.player1.user.id === user.id || game.player2 && game.player2.user && game.player2.user.id === user.id) {
        this.pongService.keydown(game, user, keydown);
        return;
      }
    }
  }

  @SubscribeMessage('keyup')
  keyup(client: Socket, keyup: string) {
    const user = this.onlineUserService.getUser(client.id);
    if (!user)
      return;
    this.gamesMap.forEach((game, id) => {
      if ((!game.player1 || !game.player1.user) || (!game.player2 || !game.player2.user))
        return;
      if (game.player1.user.id === user.id || game.player2.user.id === user.id) {
        this.pongService.keyup(game, user, keyup);
        return;
      }
    });
  }

  ////////
  //GAME HANDLER
  ///////

  @SubscribeMessage('newGame')
  async newGame(client: Socket, normalOrNot: boolean) {
    let user = this.onlineUserService.getUser(client.id);
    if (user) {
      if (this.pongService.userIsInGame(user, this.gamesMap)) {
        client.emit('notification', "Vous êtes déjà dans une partie");
        return;
      }
    }
    let game: GameI = this.searchGameMapAwaiting(normalOrNot, user);
    if (game) {
      this.pongService.joinGame(client, game);
      await this.pongService.delay(1500);
      this.sendToPlayers(game.player1.user, 'stopSearchLoop', game.id_searchinterval1);
      this.sendToPlayers(game.player2.user, 'stopSearchLoop', game.id_searchinterval2);
      game.id_searchinterval1 = 0;
      game.id_searchinterval2 = 0;
      await this.pongService.drawInit(game);
    }
    else {
      if (normalOrNot == true)
        this.creatNewGameMap(client, NORMALGAME);
      else {
        // var x = this.pongService.between(1, MAX_MAP)
        var x = Math.floor(Math.random() * (MAX_MAP - 1) + 1);
        this.creatNewGameMap(client, x);
      }
    }
  }

  ////////
  ///LOOP HANDLER SEARCHING OPPONENT
  ///////

  @SubscribeMessage('id_intervalmap')
  varSearchLoopMap(client: Socket, id: number) {
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

  ////////
  ///INVITE HANDLER
  ///////


  @SubscribeMessage('inviteUser')
  inviteUser(client: Socket, id: number) {
    this.invitePlayUser(client, id, this.gamesMap);
  }

  @SubscribeMessage('responseInvite')
  async responseInvite(client: Socket, response: responseInvite) {
    const user = this.onlineUserService.getUser(client.id);
    console.log(response, "===========");
    if (user && response.accepted) {
      this.sendToPlayers(user, 'notification', "vous avez accepté l'invitation");
      let game = this.gamesMap.get(response.gameId);
      if (game) {
        this.eventEmitter.emit('game.init', game);
      }
    } else if (!response.accepted)
    {
      this.sendToPlayers(user, 'notification', "Vous avez refusé l'invitation");
      this.gamesMap.delete(response.gameId);
      // remove game from db
    }
  }

  @SubscribeMessage('needOnGoingGames')
  async needOnGoingGames(client: Socket) {
    client.emit('onGoingGames', await this.gameService.getStartedGames());
  }

  ///////
  //OTHER
  //////

  private searchGameMapAwaiting(normalOrNot: boolean, user: BasicUserI): GameI {
    if (!user)
      return ;
    if (normalOrNot) {
      for (let value of this.gamesMap.values()) 
      {
        if (value.mapId === NORMALGAME && value.player2 === undefined && user.id !== value.player1.user.id)
          return value;
      }
    }
    else {
      for (let value of this.gamesMap.values()) {
        if (value.mapId !== NORMALGAME && value.player2 === undefined && user.id !== value.player1.user.id)
          return value;
      }
    }
    return undefined;
  }


  @SubscribeMessage('spectate')
  addSpectator(spectator: Socket, idGame: number) {
    for (let game of this.gamesMap.values()) {
      if (game.id === idGame) {
        const newSpec = this.onlineUserService.getUser(spectator.id);
        game.spectators.push(newSpec);
        return;
      }
    }
  }

  @SubscribeMessage('deleteSpectate')
  dellSpectator(spectator: Socket, idGame: number) {
    for (let game of this.gamesMap.values()) {
      if (game.id === idGame) {
        const newSpec = this.onlineUserService.getUser(spectator.id);
        game.spectators.splice(game.spectators.indexOf(newSpec), 1);
        return;
      }
    }
  }

  @OnEvent('game.init')
  async gameInit(game: GameI) {
    if (game && game.dbGame) {
      this.sendToGame(game, 'redirectGame', game.id);
      this.sendToGame(game, 'drawInit', null);
      await this.pongService.delay(1000);
      this.sendToGame(game, 'drawInit', null);
      this.sendToGame(game, 'drawText', "La partie va commencer");
      await this.pongService.delay(1000);
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
      if (game.dbGame) {
        await this.gameService.startGame(game.dbGame.id);
        await this.pongService.startGame(game, game.mapId);
        this.sendToGame(game, 'onGoingGames', await this.gameService.getStartedGames());
      }
    }
  }

  @OnEvent('game.users.matched')
  async matchedUsersEvent(data: any) {
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

        if (!user || !user.id)
          continue;
        const userSocket = this.connectedUsers.get(user.id);
        if (!userSocket)
          continue;
        if (user && user && user.id) {
          const userSocket = this.connectedUsers.get(user.id);
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
  async deleteGame(game: GameI) {
    console.log("delete game");
    if (game && (!game.player1 || !game.player2))
      return ;
    console.log("delete game");
    this.gamesMap.delete(game.id);
    this.sendToGame(game, 'onGoingGames', await this.gameService.getStartedGames());
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

  // a bouger sur pong.service.ts

  async invitePlayUser(client: Socket, id: number, games: Map<number, GameI>): Promise<void> {

    const inviter = this.onlineUserService.getDataPlayer(client.id);
    const target = this.onlineUserService.getDataPlayerById(id);
    let game: GameI;


    if ((!inviter || !target) || (inviter.id == target.id))
      return ;
    if (this.pongService.userIsInGame(inviter, games) || this.pongService.userIsInGame(target, games)) {
      this.sendToPlayers(inviter, 'notification', target.displayname + " est déjà en partie");
      return ;
    }
    if (!(game = await this.createPrivateGame(inviter, target)))
      return;
    if (inviter && target && inviter.id !== target.id && game) {
      this.eventEmitter.emit('game.invite', {
        gameId: game.id,
        user: inviter,
        target: target,
      })

    }
  }

  async createPrivateGame(player1: dataPlayerI, player2: dataPlayerI): Promise<GameI> {

    if (!player1 || !player2)
      return null;
    var game = this.pongService.initState();
    var dbGame: Game = await this.gameService.createGame(player1.id, player2.id);
    if (game && dbGame) {
      game = {
        id: dbGame.id,
        player1: {
          user: player1,
          paddle: game.player1.paddle,
          points: game.player1.points,
        },
        player2: {
          user: player2,
          paddle: game.player2.paddle,
          points: game.player2.points,
        },
        mapId: this.pongService.between(0, 3),
        ball: game.ball,
        spectators: [],
        obstacle: game.obstacle,
        dbGame: dbGame
      }
    }
    this.gamesMap.set(game.id, game);
    return game;
  }

  @SubscribeMessage('stopSearch')
  stopSearch(client: Socket)
  {
    const user = this.onlineUserService.getUser(client.id);
    if (!user)
      return ;
    for (const [key, value] of this.gamesMap)
    {
      if (value.player1.user.id == user.id && !value.player2)
        this.gamesMap.delete(key);
    }
  }

  @SubscribeMessage('inGame')
  inGame(client: Socket, idGame: number) {
    const user = this.onlineUserService.getUser(client.id);
    if (!user)
      return ;
    for (let game of this.gamesMap.values())
      if (game.player1.user.id == user.id || (game.player2 && game.player2.user && game.player2.user.id == user.id)){
        client.emit('inGame', true);
        return;
    }
    client.emit('inGame', false);
  }

  public async creatNewGameMap(client: Socket, mapId: number): Promise<GameI> {
    const user: dataPlayerI = this.onlineUserService.getDataPlayer(client.id);
    console.log(user);
    if (!user)
      return;
    var game: GameI = this.pongService.initState();
    var dbGame: Game = await this.gameService.createGame(user.id);
    if (game && dbGame) {
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
    this.gamesMap.set(game.id, game);
    return this.gamesMap.get(game.id);
  }


}