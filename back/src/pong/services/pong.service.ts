import { Inject, Injectable } from '@nestjs/common';
import { BallI } from '../interfaces/ball.interface';
import { PlayerI } from '../interfaces/player.interface';
import { PointI } from '../interfaces/point.interface';
import { GameI } from '../interfaces/game.interface';
import { Socket } from 'socket.io';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { GameService } from 'src/game/game.service';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';


const BALL_RADIUS = 4;
const PLAYER_HEIGHT = 80;
const PLAYER_WIDTH = 8;
const HEIGHTCANVAS = 400;
const WIDTHCANVAS = 600;

/////
//obstacls configs
/////
////
//// MAP1
///////// obstacle1
export const MAP1_OBSTACLE1_W = 40; // width
export const MAP1_OBSTACLE1_H = 125; // height
export const MAP1_OBSTACLE1_POSX = (WIDTHCANVAS / 2) - (MAP1_OBSTACLE1_W / 2); // position x
export const MAP1_OBSTACLE1_POSY = 0; // position y
export const MAP1_OBSTACLE1_RADIUS = 2;
///////// obstacle2
export const MAP1_OBSTACLE2_W = 40; // width
export const MAP1_OBSTACLE2_H = 125; // height
export const MAP1_OBSTACLE2_POSX = (WIDTHCANVAS / 2) - (MAP1_OBSTACLE2_W / 2); // position x
export const MAP1_OBSTACLE2_POSY = (HEIGHTCANVAS - MAP1_OBSTACLE2_H); // position x
export const MAP1_OBSTACLE2_RADIUS = 2;
////
////
//// MAP2
///////// obstacle1
export const MAP2_OBSTACLE_W = 40; // width
export const MAP2_OBSTACLE_H = 130; // height
export const MAP2_OBSTACLE_POSX = (WIDTHCANVAS / 2) - (MAP2_OBSTACLE_W / 2); // position x
export const MAP2_OBSTACLE_POSY = 0; // position y
export const MAP2_OBSTACLE_SPEED = 1;
export const MAP2_OBSTACLE_RADIUS = 2;
////
//
//
//// MAP3
///////// obstacle1
export const MAP3_OBSTACLE1_W = 250; // width
export const MAP3_OBSTACLE1_H = 20; // height
export const MAP3_OBSTACLE1_POSX = (WIDTHCANVAS / 2) - (MAP3_OBSTACLE1_W / 2); // position x
export const MAP3_OBSTACLE1_POSY = ((HEIGHTCANVAS / 2) - MAP3_OBSTACLE1_H) / 2; // position y
export const MAP3_OBSTACLE1_SPEED = 1;
export const MAP3_OBSTACLE1_RADIUS = 2;
//
///////// obstacle2
export const MAP3_OBSTACLE2_W = 250; // width
export const MAP3_OBSTACLE2_H = 20; // height
export const MAP3_OBSTACLE2_POSX = (WIDTHCANVAS / 2) - (MAP3_OBSTACLE2_W / 2); // position x
export const MAP3_OBSTACLE2_POSY = (HEIGHTCANVAS / 2) + (( HEIGHTCANVAS / 2 - MAP3_OBSTACLE2_H) / 2); // position y
export const MAP3_OBSTACLE2_SPEED = 1;
export const MAP3_OBSTACLE2_RADIUS = 2;
//
//

////

export const MAX_SCORE = 10;

export const MAX_SPEED = 10; //ball
export const defaultSpeed = 5; //speed de la balle par default
export const SPEED_PLAYER = 8



@Injectable()
export class PongService {
  // variables: VariablePong;
  
  constructor(
    @Inject(OnlineUserService) private onlineUserService: OnlineUserService,
    @Inject(GameService) private gameService: GameService,
                        private eventEmitter: EventEmitter2)
        // private variables: VariablePong )
        {
        }
        
  public delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
  }
  
  async drawInit(game: GameI)
  {
    if (game)
      this.eventEmitter.emit('game.init', game);
  }
  
  userIsInGame(user: BasicUserI, gameMap: Map<number, GameI>): boolean {
    let isInGame = false;
    
    gameMap.forEach((game: GameI) => {
    if (game.player1.user.id === user.id || (game.player2 && game.player2.user.id === user.id)) {
      isInGame = true;
    }});
    return isInGame;
  } 
  
  private colision(ball: BallI, paddle: PointI): boolean {
    if (ball.x + ball.radius < (WIDTHCANVAS - paddle.width) && ball.x - ball.radius > (0 + paddle.width))
    return false;
    if (ball.y >= paddle.y && ball.y <= paddle.y + paddle.height)
        return true;
        return false;
      }
      
      private reinitBall(ball: BallI, dir: number): void {
        ball.x = WIDTHCANVAS /2;
        ball.y = HEIGHTCANVAS /2;
        if (dir > 0)
        ball.dx = Math.floor(Math.random() * (-1 - -defaultSpeed + 1) + -defaultSpeed);
        else
    		ball.dx = Math.floor(Math.random() * (defaultSpeed - 1 + 1) + 1);
        ball.dy = Math.floor(Math.random() * (defaultSpeed - -defaultSpeed + 1) + -defaultSpeed);
    }

    private reinitPlayers(player1: PlayerI, player2: PlayerI): void {
        player1.paddle.y = HEIGHTCANVAS / 2 - player1.paddle.height / 2;
        player2.paddle.y = HEIGHTCANVAS / 2 - player2.paddle.height / 2;
    }

    private reinitObstacle(obstacle: PointI): void
    {
        obstacle.x = WIDTHCANVAS / 2 - MAP2_OBSTACLE_W / 2;
        obstacle.y = MAP2_OBSTACLE_POSY;
        obstacle.dx = 0;
        obstacle.dy = MAP2_OBSTACLE_SPEED;
        obstacle.height = MAP2_OBSTACLE_H;
        obstacle.width = MAP2_OBSTACLE_W;
    }
    
    private rebond(ball: BallI, paddle: PointI): void {
        var impact = ball.y - paddle.y - paddle.height / 2;
        var ratio = 100 / (paddle.height / 2);

        ball.dy = Math.round(impact * ratio / 10);
        if (ball.dy > -4 && ball.dy <= 0)
            ball.dy = -4;
        else if (ball.dy < 4 && ball.dy > 0)
            ball.dy = 4;
        ball.dx *= -1.2;
        if (ball.dx > -2 && ball.dx <= 0)
        ball.dx = -2;
        else if (ball.dx < 2 && ball.dx > 0)
        ball.dx = 2;
        if (ball.dx < -MAX_SPEED)
        ball.dx = -MAX_SPEED;
        else if (ball.dx > MAX_SPEED)
        ball.dx = MAX_SPEED;
    }
    
    initState(): GameI{
		var p1: PlayerI = {
	    	paddle: {
				x: 0,
				y: HEIGHTCANVAS / 2 - PLAYER_HEIGHT / 2,
				dx: 0,
				dy: 0,
				width: PLAYER_WIDTH,
				height: PLAYER_HEIGHT
			},
    		points: 0
		};

		var p2: PlayerI = {
            paddle: {
				x: WIDTHCANVAS - PLAYER_WIDTH,
				y: HEIGHTCANVAS / 2 - PLAYER_HEIGHT / 2,
				dx: 0,
				dy: 0,
				width: PLAYER_WIDTH,
				height: PLAYER_HEIGHT
			},
    		points: 0
		};
        
		var state: GameI = {
            id: 1,
			player1: p1,
			player2: p2,
            type: 0,
            obstacle: {
                x: WIDTHCANVAS / 2 - MAP2_OBSTACLE_W / 2,
                y: MAP2_OBSTACLE_POSY,
                dx: 0,
                dy: MAP2_OBSTACLE_SPEED,
                height: MAP2_OBSTACLE_H,
                width: MAP2_OBSTACLE_W,
            },
			ball: {
				x: WIDTHCANVAS / 2,
				y: HEIGHTCANVAS / 2,
				dx: 2,
				dy: -5,
				speed: defaultSpeed,
				width: 3,
				height: 3,
				radius: BALL_RADIUS
			},
		}
		return state;
	}

    keydown(game: GameI, client: BasicUserI, key: string)
    {
        if (key === 'z' || key === 'w')
        {
            if (game && game.player1 && game.player1.user.id === client.id)
            {
                game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
                if (game.player1.paddle.dy < -SPEED_PLAYER)
                game.player1.paddle.dy = -SPEED_PLAYER;
            }
            else if (game && game.player2 && game.player2.user.id === client.id)
            {
                game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
                if (game.player2.paddle.dy < - SPEED_PLAYER)
                game.player2.paddle.dy = -SPEED_PLAYER;
            }
        }
        else if (key === 's')
        {
            if (game && game.player1 && game.player1.user.id === client.id)
            {
                game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
                if (game.player1.paddle.dy > SPEED_PLAYER)
                game.player1.paddle.dy = SPEED_PLAYER;
            }
            else if (game && game.player2 && game.player2.user.id === client.id)
            {
                game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
                if (game.player2.paddle.dy > SPEED_PLAYER)
                   game.player2.paddle.dy = SPEED_PLAYER;
            }
        }
    }

    keyup(game: GameI, client: BasicUserI,  key: string)
    {
        if (key === 'z' || key === 'w')
        {
            if (game.player1.user.id === client.id)
                game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
            else
            game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
        }
        else if (key === 's')
        {
            if (game.player1.user.id === client.id)
                game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
            else
                game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
            }
    }

    async joinGame(client: Socket, game: GameI){
      const player = await this.onlineUserService.getUser(client.id);

     await this.gameService.addPlayerToGame(game.id, player.id);
      game.player2 = {
          user: player,
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
      this.eventEmitter.emit('game.users.matched', game);
	}

    deleteGame(g: GameI, allGames: GameI[]){
		var newAllGames: GameI[] = allGames.filter(game => game != g);
		allGames = newAllGames;
	}
    
    private drawForAll(map: string, game: GameI)
    {
      if (map && game) {
        this.eventEmitter.emit('game.draw', map, game);
      }
    }



    private finalForAll(game: GameI)
    {
        var i = 0;

        let winnerId, looserId, winnerScore, looserScore;
        console.log("Game finished");

        if (game.player1.points === MAX_SCORE)
        {
            winnerId = game.player1.user.id;
            looserId = game.player2.user.id;
            winnerScore = game.player1.points;
            looserScore = game.player2.points;
        }
        else
        {
            winnerId = game.player2.user.id;
            looserId = game.player1.user.id;
            winnerScore = game.player2.points;
            looserScore = game.player1.points;
        }
        //Draw le final dune autre maniere pour les spectators !!!
        // game.spectators[].socket.emit('');
        this.gameService.stopGame(game.dbGame.id, winnerId, looserId, looserScore, winnerScore);
        
    }

	async startGame(game: GameI, mapid: number)
    {
        if (mapid === 0)
        {
            game.id_interval = setInterval(() => {
                this.loopGameNormal(game);
            }, 1000/60);
        }
        else if (mapid === 1)
        {
            game.id_interval = setInterval(() => {
                this.loopGameMap1(game);
            }, 1000/60);
        }
        else if (mapid === 2)
        {
            game.id_interval = setInterval(() => {
                this.loopGameMap2(game);
            }, 1000/60);
        }		
        else if (mapid === 3)
        {
            game.id_interval = setInterval(() => {
                this.loopGameMap3(game);
            }, 1000/60);
        }
    }

    //
    ////LOOPGAME
    //


    loopGameNormal(game: GameI){
        ////
        //MOUVEMENTS DES JOUEURS
        ////
        game.player1.paddle.y += game.player1.paddle.dy;
        game.player2.paddle.y += game.player2.paddle.dy;
    
        //blocage des paddle pour au'il ne deborde pas en haut ou en bas
        if (game.player1.paddle.y < 0)
            game.player1.paddle.y = 0;
        else if (game.player1.paddle.y > HEIGHTCANVAS - game.player1.paddle.height)
            game.player1.paddle.y =  HEIGHTCANVAS - game.player1.paddle.height;
        if (game.player2.paddle.y < 0)
            game.player2.paddle.y = 0;
        else if (game.player2.paddle.y > HEIGHTCANVAS - game.player2.paddle.height)
            game.player2.paddle.y =  HEIGHTCANVAS - game.player2.paddle.height;
    
        /////
        //MOUVEMENT DE LA BALLE
        ////
        game.ball.y += game.ball.dy;
        if (game.ball.y < 0 + game.ball.radius)  //sil y a un rebond vertical haut
        {
            game.ball.dy *= -1;
            game.ball.y = 0 + game.ball.radius;
        }
        else if (game.ball.y > HEIGHTCANVAS - game.ball.height)         //rebond vertical bas
        {
            game.ball.dy *= -1;
            game.ball.y = HEIGHTCANVAS - game.ball.height;
        }
    
        game.ball.x += game.ball.dx;
        if ((game.ball.x < WIDTHCANVAS / 2) && this.colision(game.ball, game.player1.paddle)) //sil y a rebond entre balle et paddle
        {
            this.rebond(game.ball, game.player1.paddle);
            game.ball.x = 0 + PLAYER_WIDTH + game.ball.radius;
        }
        else if ((game.ball.x > WIDTHCANVAS / 2) && this.colision(game.ball, game.player2.paddle))
        {
            this.rebond(game.ball, game.player2.paddle);
            game.ball.x = WIDTHCANVAS - PLAYER_WIDTH - game.ball.radius;
        }
    
        if ( game.ball.x <= (0 + game.ball.width) || game.ball.x >= (WIDTHCANVAS - game.ball.radius))   //si le point est marqué:
        {
            if (game.ball.x <= (0 + game.ball.width))
            {
                game.player2.points++;
                this.reinitBall(game.ball, -1);
            }
            else
            {
                game.player1.points++;
                this.reinitBall(game.ball, 1);
            }
            if (game.player1.points === MAX_SCORE || game.player2.points === MAX_SCORE) ///Si Max SCORE atteint
            {
                clearInterval(game.id_interval);
                this.finalForAll(game);
                return ;
            }
            this.reinitPlayers(game.player1, game.player2);
        }
        this.drawForAll("drawNormalMap", game);
    }
    
    
    //////
    //LOOP2
    //////
    
    loopGameMap1(game: GameI){
        ////
        //MOUVEMENTS DES JOUEURS
        ////
        game.player1.paddle.y += game.player1.paddle.dy;
        game.player2.paddle.y += game.player2.paddle.dy;
        if (game.player1.paddle.y < 0)
            game.player1.paddle.y = 0;
        else if (game.player1.paddle.y > HEIGHTCANVAS - game.player1.paddle.height)
            game.player1.paddle.y =  HEIGHTCANVAS - game.player1.paddle.height;
        if (game.player2.paddle.y < 0)
            game.player2.paddle.y = 0;
        else if (game.player2.paddle.y > HEIGHTCANVAS - game.player2.paddle.height)
            game.player2.paddle.y =  HEIGHTCANVAS - game.player2.paddle.height;
        /////
        //MOUVEMENT DE LA BALLE
        ////        
        ////////
        //////HORIZONT
        ////////
        game.ball.x += game.ball.dx;
        if ( game.ball.y <= MAP1_OBSTACLE1_H || game.ball.y >= HEIGHTCANVAS - MAP1_OBSTACLE2_H )
        {
            if (game.ball.x < WIDTHCANVAS / 2 && (game.ball.x + game.ball.radius >= (WIDTHCANVAS/2 - (MAP1_OBSTACLE1_W/2))))
            {
                game.ball.dx *= -1;
                game.ball.x = (WIDTHCANVAS/2 - (MAP1_OBSTACLE1_W/2)) - game.ball.radius;
            }
            else if (game.ball.x > WIDTHCANVAS / 2 && (game.ball.x - game.ball.radius <= (WIDTHCANVAS/2 + (MAP1_OBSTACLE2_W/2))))
            {
                game.ball.dx *= -1;
                game.ball.x = (WIDTHCANVAS/2 + (MAP1_OBSTACLE1_W/2)) + game.ball.radius;
            }
        }
    
        if ((game.ball.x < WIDTHCANVAS / 2) && this.colision(game.ball, game.player1.paddle))
        {
            this.rebond(game.ball, game.player1.paddle);
            game.ball.x = 0 + PLAYER_WIDTH + game.ball.radius;
        }
        else if ((game.ball.x > WIDTHCANVAS / 2) && this.colision(game.ball, game.player2.paddle))
        {
            this.rebond(game.ball, game.player2.paddle);
            game.ball.x = WIDTHCANVAS - PLAYER_WIDTH - game.ball.radius;
        }
    
        if ( game.ball.x <= (0 + game.ball.width) || game.ball.x >= (WIDTHCANVAS - game.ball.radius))   //si le point est marqué:
        {
            if (game.ball.x <= (0 + game.ball.width))
            {
                game.player2.points++;
                this.reinitBall(game.ball, -1);
            }
            else
            {
                game.player1.points++;
                this.reinitBall(game.ball, 1);
            }
            if (game.player1.points === MAX_SCORE || game.player2.points === MAX_SCORE) ///Si Max SCORE atteint
            {
                clearInterval(game.id_interval);
                this.finalForAll(game);
                return ;
            }
            this.reinitPlayers(game.player1, game.player2);
            this.drawForAll("drawMap1", game);
            return ;
        }
    
        ///////
        ////////VERTICALEMENT
        ///////
        game.ball.y += game.ball.dy;
        if (    (WIDTHCANVAS/2 - MAP1_OBSTACLE1_W/2) <= game.ball.x - game.ball.radius && 
                game.ball.x + game.ball.radius <= (WIDTHCANVAS - (WIDTHCANVAS/2 - MAP1_OBSTACLE1_W/2))
        )
        {
            if (game.ball.y - game.ball.radius <= MAP1_OBSTACLE1_H)
            {
                game.ball.dy *= -1;
                game.ball.y = MAP1_OBSTACLE1_H + game.ball.radius;
            }
            else if ( game.ball.y + game.ball.radius >= (HEIGHTCANVAS - MAP1_OBSTACLE2_H))
            {
                game.ball.dy *= -1;
                game.ball.y = HEIGHTCANVAS - MAP1_OBSTACLE2_H - game.ball.radius;
            }
        }
        if ( game.ball.y - game.ball.radius <= 0)
        {
            game.ball.dy *= -1;
            game.ball.y = 0 + game.ball.radius;
        }
        else if (game.ball.y + game.ball.radius >= HEIGHTCANVAS)
        {
            game.ball.dy *= -1;
            game.ball.y = HEIGHTCANVAS - game.ball.radius;
        }
        this.drawForAll("drawMap1", game);
    }
    
    //////
    //LOOP3
    /////
    
    loopGameMap2(game: GameI)
    {
        ////
        //MOUVEMENTS DES JOUEURS
        ////
        game.player1.paddle.y += game.player1.paddle.dy;
        game.player2.paddle.y += game.player2.paddle.dy;
    
        //blocage des paddle pour au'il ne deborde pas en haut ou en bas
        if (game.player1.paddle.y < 0)
            game.player1.paddle.y = 0;
        else if (game.player1.paddle.y > HEIGHTCANVAS - game.player1.paddle.height)
            game.player1.paddle.y =  HEIGHTCANVAS - game.player1.paddle.height;
        if (game.player2.paddle.y < 0)
            game.player2.paddle.y = 0;
        else if (game.player2.paddle.y > HEIGHTCANVAS - game.player2.paddle.height)
            game.player2.paddle.y =  HEIGHTCANVAS - game.player2.paddle.height;
    
    
        ///////
        ////Mouvement object
        ///////
    
        game.obstacle.y += game.obstacle.dy;
        if (game.obstacle.dy > 0 && game.obstacle.y + game.obstacle.height >= HEIGHTCANVAS)
        {
            game.obstacle.y = HEIGHTCANVAS - game.obstacle.height;
            game.obstacle.dy *= -1;
        }
        else if (game.obstacle.dy < 0 && game.obstacle.y <= 0)
        {
            game.obstacle.y = 0;
            game.obstacle.dy *= -1;
        }
        /////
        //REBOND OBSTACLE AVANT TOUT
        /////
    
        if  (   game.ball.dy > 0 && 
                game.ball.x >= game.obstacle.x - game.ball.radius &&
                game.ball.x <= game.obstacle.x + game.obstacle.width + game.ball.radius &&
                game.ball.y >= game.obstacle.y - game.ball.radius && 
                game.ball.y <= game.obstacle.y + game.ball.radius
        )
        {
            game.ball.y = game.obstacle.y - game.ball.radius;
            game.ball.dy *= -1;
        }
        
        else if (    game.ball.dy < 0 && 
                game.ball.x >= game.obstacle.x - game.ball.radius &&
                game.ball.x <= game.obstacle.x + game.obstacle.width + game.ball.radius &&
                game.ball.y >= game.obstacle.y + game.obstacle.height - game.ball.radius && 
                game.ball.y <= game.obstacle.y + game.obstacle.height + game.ball.radius
        )
        {
            game.ball.y = game.obstacle.y + game.obstacle.height + game.ball.radius;
            game.ball.dy *= -1;
        }
        else if (    game.ball.dx < 0 && 
            game.ball.x >= game.obstacle.x + game.obstacle.width - game.ball.radius &&
            game.ball.x <= game.obstacle.x + game.obstacle.width + game.ball.radius &&
            game.ball.y >= game.obstacle.y && 
            game.ball.y <= game.obstacle.y + game.obstacle.height
        )
        {
            game.ball.x = game.obstacle.x + game.obstacle.width + game.ball.radius;
            game.ball.dx *= -1;
        }
        else if (    game.ball.dx > 0 && 
            game.ball.x >= game.obstacle.x - game.ball.radius &&
            game.ball.x <= game.obstacle.x + game.ball.radius &&
            game.ball.y >= game.obstacle.y && 
            game.ball.y <= game.obstacle.y + game.obstacle.height
        )
        {
            game.ball.x = game.obstacle.x - game.ball.radius;
            game.ball.dx *= -1;
        }
    
        /////
        //MOUVEMENT DE LA BALLE
        ////        
        ////////
        //////HORIZONT
        ////////
        game.ball.x += game.ball.dx;
        if ((game.ball.x < WIDTHCANVAS / 2) && this.colision(game.ball, game.player1.paddle))
        {
            this.rebond(game.ball, game.player1.paddle);
            game.ball.x = 0 + PLAYER_WIDTH + game.ball.radius;
        }
        else if ((game.ball.x > WIDTHCANVAS / 2) && this.colision(game.ball, game.player2.paddle))
        {
            this.rebond(game.ball, game.player2.paddle);
            game.ball.x = WIDTHCANVAS - PLAYER_WIDTH - game.ball.radius;
        }
        if ( game.ball.x <= (0 + game.ball.width) || game.ball.x >= (WIDTHCANVAS - game.ball.radius))   //si le point est marqué:
        {
            //mise a jour des scores
            if (game.ball.x <= (0 + game.ball.width))
            {
                game.player2.points++;
                this.reinitBall(game.ball, -1);
            }
            else
            {
                game.player1.points++;
                this.reinitBall(game.ball, 1);
            }
            if (game.player1.points === MAX_SCORE || game.player2.points === MAX_SCORE) ///Si Max SCORE atteint
            {
                clearInterval(game.id_interval);
                this.finalForAll(game);
                return ;
            }
            this.reinitPlayers(game.player1, game.player2);
            this.reinitObstacle(game.obstacle);
            this.drawForAll("drawMap2", game);
            return ;
        }
    
        ///////
        ////////VERTICALEMENT
        ///////
        game.ball.y += game.ball.dy;
        if ( game.ball.y - game.ball.radius <= 0)
        {
            game.ball.dy *= -1;
            game.ball.y = 0 + game.ball.radius;
        }
        else if (game.ball.y + game.ball.radius >= HEIGHTCANVAS)
        {
            game.ball.dy *= -1;
            game.ball.y = HEIGHTCANVAS - game.ball.radius;
        }
        this.drawForAll("drawMap2", game);
    }
    
    
    
    loopGameMap3(game: GameI)
    {
        ////
        //MOUVEMENTS DES JOUEURS
        ////
        game.player1.paddle.y += game.player1.paddle.dy;
        game.player2.paddle.y += game.player2.paddle.dy;
        if (game.player1.paddle.y < 0)    //blocage des paddle pour au'il ne deborde pas en haut ou en bas
            game.player1.paddle.y = 0;
        else if (game.player1.paddle.y > HEIGHTCANVAS - game.player1.paddle.height)
            game.player1.paddle.y =  HEIGHTCANVAS - game.player1.paddle.height;
        if (game.player2.paddle.y < 0)
            game.player2.paddle.y = 0;
        else if (game.player2.paddle.y > HEIGHTCANVAS - game.player2.paddle.height)
            game.player2.paddle.y =  HEIGHTCANVAS - game.player2.paddle.height;
    
        /////
        //REBOND OBSTACLE AVANT TOUT
        /////
        if  (   game.ball.dy > 0 && 
                game.ball.x >= MAP3_OBSTACLE1_POSX - game.ball.radius &&
                game.ball.x <= MAP3_OBSTACLE1_POSX + MAP3_OBSTACLE1_W + game.ball.radius &&
                game.ball.y >= MAP3_OBSTACLE1_POSY - game.ball.radius && 
                game.ball.y <= MAP3_OBSTACLE1_POSY + game.ball.radius
        )
        {
            game.ball.y = MAP3_OBSTACLE1_POSY - game.ball.radius;
            game.ball.dy *= -1;
        }
        else if  (   game.ball.dy > 0 && 
            game.ball.x >= MAP3_OBSTACLE2_POSX - game.ball.radius &&
            game.ball.x <= MAP3_OBSTACLE2_POSX + MAP3_OBSTACLE2_W + game.ball.radius &&
            game.ball.y >= MAP3_OBSTACLE2_POSY - game.ball.radius && 
            game.ball.y <= MAP3_OBSTACLE2_POSY + game.ball.radius
        )
        {
            game.ball.y = MAP3_OBSTACLE2_POSY - game.ball.radius;
            game.ball.dy *= -1;
        }
        else if (   game.ball.dy < 0 && 
                    game.ball.x >= MAP3_OBSTACLE1_POSX - game.ball.radius &&
                    game.ball.x <= MAP3_OBSTACLE1_POSX + MAP3_OBSTACLE1_W + game.ball.radius &&
                    game.ball.y >= MAP3_OBSTACLE1_POSY + MAP3_OBSTACLE1_H - game.ball.radius && 
                    game.ball.y <= MAP3_OBSTACLE1_POSY + MAP3_OBSTACLE1_H + game.ball.radius
        )
        {
            game.ball.y = MAP3_OBSTACLE1_POSY + MAP3_OBSTACLE1_H + game.ball.radius;
            game.ball.dy *= -1;
        }
        else if (   game.ball.dy < 0 && 
                    game.ball.x >= MAP3_OBSTACLE2_POSX - game.ball.radius &&
                    game.ball.x <= MAP3_OBSTACLE2_POSX + MAP3_OBSTACLE2_W + game.ball.radius &&
                    game.ball.y >= MAP3_OBSTACLE2_POSY + MAP3_OBSTACLE2_H - game.ball.radius && 
                    game.ball.y <= MAP3_OBSTACLE2_POSY + MAP3_OBSTACLE2_H + game.ball.radius
        )
        {
            game.ball.y = MAP3_OBSTACLE2_POSY + MAP3_OBSTACLE2_H + game.ball.radius;
            game.ball.dy *= -1;
        }
        else if (   game.ball.dx < 0 && 
                    game.ball.x >= MAP3_OBSTACLE1_POSX + MAP3_OBSTACLE1_W - game.ball.radius &&
                    game.ball.x <= MAP3_OBSTACLE1_POSX + MAP3_OBSTACLE1_W + game.ball.radius &&
                    game.ball.y >= MAP3_OBSTACLE1_POSY && 
                    game.ball.y <= MAP3_OBSTACLE1_POSY + MAP3_OBSTACLE1_H
        )
        {
            game.ball.x = MAP3_OBSTACLE1_POSX + MAP3_OBSTACLE1_W + game.ball.radius;
            game.ball.dx *= -1;
        }
        else if (   game.ball.dx < 0 && 
                    game.ball.x >= MAP3_OBSTACLE2_POSX + MAP3_OBSTACLE2_W - game.ball.radius &&
                    game.ball.x <= MAP3_OBSTACLE2_POSX + MAP3_OBSTACLE2_W + game.ball.radius &&
                    game.ball.y >= MAP3_OBSTACLE2_POSY && 
                    game.ball.y <= MAP3_OBSTACLE2_POSY + MAP3_OBSTACLE2_H
        )
        {
            game.ball.x = MAP3_OBSTACLE2_POSX + MAP3_OBSTACLE2_W + game.ball.radius;
            game.ball.dx *= -1;
        }
        else if (    game.ball.dx > 0 && 
            game.ball.x >= MAP3_OBSTACLE1_POSX - game.ball.radius &&
            game.ball.x <= MAP3_OBSTACLE1_POSX + game.ball.radius &&
            game.ball.y >= MAP3_OBSTACLE1_POSY && 
            game.ball.y <= MAP3_OBSTACLE1_POSY + MAP3_OBSTACLE1_H
        )
        {
            game.ball.x = MAP3_OBSTACLE1_POSX - game.ball.radius;
            game.ball.dx *= -1;
        }
        else if (    game.ball.dx > 0 && 
            game.ball.x >= MAP3_OBSTACLE2_POSX - game.ball.radius &&
            game.ball.x <= MAP3_OBSTACLE2_POSX + game.ball.radius &&
            game.ball.y >= MAP3_OBSTACLE2_POSY && 
            game.ball.y <= MAP3_OBSTACLE2_POSY + MAP3_OBSTACLE2_H
        )
        {
            game.ball.x = MAP3_OBSTACLE2_POSX - game.ball.radius;
            game.ball.dx *= -1;
        }
    
        /////
        //MOUVEMENT DE LA BALLE
        ////        
    
        ////////
        //////HORIZONT
        ////////
        game.ball.x += game.ball.dx;
        if ((game.ball.x < WIDTHCANVAS / 2) && this.colision(game.ball, game.player1.paddle))  //sil y a rebond entre balle et paddle:
        {
            this.rebond(game.ball, game.player1.paddle);
            game.ball.x = 0 + PLAYER_WIDTH + game.ball.radius;
        }
        else if ((game.ball.x > WIDTHCANVAS / 2) && this.colision(game.ball, game.player2.paddle))
        {
            this.rebond(game.ball, game.player2.paddle);
            game.ball.x = WIDTHCANVAS - PLAYER_WIDTH - game.ball.radius;
        }
        if ( game.ball.x <= (0 + game.ball.width) || game.ball.x >= (WIDTHCANVAS - game.ball.radius))   //si le point est marqué:
        {
            //mise a jour des scores
            if (game.ball.x <= (0 + game.ball.width))
            {
                game.player2.points++;
                this.reinitBall(game.ball, -1);
            }
            else
            {
                game.player1.points++;
                this.reinitBall(game.ball, 1);
            }
            if (game.player1.points === MAX_SCORE || game.player2.points === MAX_SCORE) ///Si Max SCORE atteint
            {
                clearInterval(game.id_interval);
                this.finalForAll(game);
                return ;
            }
            this.reinitPlayers(game.player1, game.player2);
            this.drawForAll("drawMap3", game);
            return ;
        }
    
    ///////
    ////////VERTICALEMENT
    ///////
        game.ball.y += game.ball.dy;
        if ( game.ball.y - game.ball.radius <= 0) //sil y a un rebond bordures terrain
        {
            game.ball.dy *= -1;
            game.ball.y = 0 + game.ball.radius;
        }
        else if (game.ball.y + game.ball.radius >= HEIGHTCANVAS) //rebond horiz bas
        {
            game.ball.dy *= -1;
            game.ball.y = HEIGHTCANVAS - game.ball.radius;
        }
        this.drawForAll("drawMap3", game);
    }

   async usersMatched(users: BasicUserI[], game: GameI): Promise<void> {
    if (game && game.dbGame) {
      this.eventEmitter.emit('game.users.matched', { users, game });
    }
   }
}
