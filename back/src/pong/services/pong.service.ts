import { Injectable } from '@nestjs/common';
import { BallI } from '../interfaces/ball.interface';
import { PlayerI } from '../interfaces/player.interface';
import { PointI } from '../interfaces/point.interface';
import { GameI } from '../interfaces/game.interface';


const BALL_RADIUS = 4;
const PLAYER_HEIGHT = 65;
const PLAYER_WIDTH = 8;
const HEIGHTCANVAS = 400;
const WIDTHCANVAS = 600;

const MAX_SCORE = 50;

const MAX_SPEED = 13;
const defaultSpeed = 5; //speed de la balle par default



/////
//obstacls configs
/////
////
//// MAP1
///////// obstacle1
const MAP1_OBSTACLE1_W = 40; // width
const MAP1_OBSTACLE1_H = 125; // height
const MAP1_OBSTACLE1_POSX = (WIDTHCANVAS / 2) - (MAP1_OBSTACLE1_W / 2); // position x
const MAP1_OBSTACLE1_POSY = 0; // position y
const MAP1_OBSTACLE1_RADIUS = 2;
///////// obstacle2
const MAP1_OBSTACLE2_W = 40; // width
const MAP1_OBSTACLE2_H = 125; // height
const MAP1_OBSTACLE2_POSX = (WIDTHCANVAS / 2) - (MAP1_OBSTACLE1_W / 2); // position x
const MAP1_OBSTACLE2_POSY = (HEIGHTCANVAS - MAP1_OBSTACLE1_H); // position x
const MAP1_OBSTACLE2_RADIUS = 2;
////
////



@Injectable()
export class PongService {
    // loopId: number;

    // private endGame(state: GameI){
    //     clearInterval(state.id);
    // }

    loopGameNormal(game: GameI){
        // var player1: PlayerI = game.player1;
        // var player2: PlayerI = game.player2;
        // var ball: BallI = game.ball;
        ////
        //MOUVEMENTS DES JOUEURS
        ////
        
        game.player1.paddle.y += game.player1.paddle.dy;
        game.player2.paddle.y += game.player2.paddle.dy;

        //blocage des paddle pour au'il ne deborde pas en haut ou en bas
        //pour player1
        if (game.player1.paddle.y < 0)
            game.player1.paddle.y = 0;
        else if (game.player1.paddle.y > HEIGHTCANVAS - game.player1.paddle.height)
            game.player1.paddle.y =  HEIGHTCANVAS - game.player1.paddle.height;
        //pour player2
        if (game.player2.paddle.y < 0)
            game.player2.paddle.y = 0;
        else if (game.player2.paddle.y > HEIGHTCANVAS - game.player2.paddle.height)
            game.player2.paddle.y =  HEIGHTCANVAS - game.player2.paddle.height;

        /////
        //MOUVEMENT DE LA BALLE
        ////

        ////verticallement
        game.ball.y += game.ball.dy;
        //sil y a un rebond vertical haut
        if (game.ball.y < 0)
        {
            //inversement de la direction y
            game.ball.dy *= -1;
            game.ball.y = 0
            // game.player1.socket.emit('play', 0);
            // game.player2.socket.emit('play', 0);
        }
        //rebond vertical bas
        else if (game.ball.y > HEIGHTCANVAS - game.ball.height)
        {
            //inversement de la direction y
            game.ball.dy *= -1;
            game.ball.y = HEIGHTCANVAS - game.ball.height;
            // game.player1.socket.emit('play', 0);
            // game.player2.socket.emit('play', 0);
        }

        ////horizontalement
        game.ball.x += game.ball.dx;

        //sil y a rebond entre balle et paddle:
        if (((game.ball.x < WIDTHCANVAS / 2) && this.colision(game.ball, game.player1.paddle)) || ((game.ball.x > WIDTHCANVAS / 2) && this.colision(game.ball, game.player2.paddle)))
        {
            // game.player1.socket.emit('play', 1);
            // game.player2.socket.emit('play', 1);
            console.log("rebond !!")

            if ((game.ball.x < WIDTHCANVAS / 2) && this.colision(game.ball, game.player1.paddle))
            {
                this.rebond(game.ball, game.player1.paddle);
                // console.log("1bef ballx = ", game.ball.x);
                game.ball.x = 0 + PLAYER_WIDTH;
                // console.log("1aft ballx = ", game.ball.x);
            }
            else
            {
                this.rebond(game.ball, game.player2.paddle);
                // console.log("2bef ballx = ", game.ball.x);
                game.ball.x = WIDTHCANVAS - PLAYER_WIDTH;
                // console.log("2aft ballx = ", game.ball.x);
            }
        }
        //si le point est marqué:
        else if ( game.ball.x <= (0 - game.ball.width) || game.ball.x >= (WIDTHCANVAS + game.ball.width))
        {
            //mise a jour des scores et emission au front
            game.ball.x <= (0 - game.ball.width) ? game.player2.points++ : 42;
            game.ball.x >= (WIDTHCANVAS + game.ball.width) ? game.player1.points++ : 42;
            // game.player1.socket.emit('play', 2);
            // game.player2.socket.emit('play', 2);
            game.player1.socket.emit('score', {
                score1: game.player1.points,
                score2: game.player2.points
            });
            game.player2.socket.emit('score', {
                score1: game.player1.points,
                score2: game.player2.points
            });
            

            ///Si Max SCORE atteint
            if (game.player1.points === MAX_SCORE || game.player2.points === MAX_SCORE)
            {
                clearInterval(game.id_interval);
                if (game.player1.points === MAX_SCORE)
                {
                    game.player1.socket.emit('win');
                    game.player2.socket.emit('lose');
                }
                else
                {
                    game.player1.socket.emit('lose');
                    game.player2.socket.emit('win');
                }
                return ;
            }
            //TO DO 
            //emission aux spectateurs

            //reinitialiser la balle et sa direction y vers celui qui vient de perdre
            if (game.ball.x <= (0 - game.player1.paddle.width))
                this.reinitBall(game.ball, -1);
            else
                this.reinitBall(game.ball, 1);
            //reinit position joueur au centre
            this.reinitPlayers(game.player1, game.player2);
        }



        //sil y a rebond entre balle et objects


        //envoyer les datas aux sockets
        //pour eviter les copy cyclique, il faut enlever les sockets 
        var copy = JSON.parse(JSON.stringify(game, (key, value) => {
            if (key === 'socket')
                return undefined;
            return value;
        }));
        game.player1.socket.emit('drawNormalMap', copy);
        game.player2.socket.emit('drawNormalMap', copy);
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

        
        ////////
        //////HORIZONT
        ////////
        
        game.ball.x += game.ball.dx;
        

        //rebond obstacle verticalement
        if ( game.ball.y <= MAP1_OBSTACLE1_H || game.ball.y >= HEIGHTCANVAS - MAP1_OBSTACLE2_H )
        {
            // rebond vertic gauche
            if (game.ball.x < WIDTHCANVAS / 2 && (game.ball.x + game.ball.radius >= (WIDTHCANVAS/2 - (MAP1_OBSTACLE1_W/2))))
            {
                
                game.ball.dx *= -1;
                game.ball.x = (WIDTHCANVAS/2 - (MAP1_OBSTACLE1_W/2)) - game.ball.radius;
            }
            // rebond vertic droite
            else if (game.ball.x > WIDTHCANVAS / 2 && (game.ball.x - game.ball.radius <= (WIDTHCANVAS/2 + (MAP1_OBSTACLE2_W/2))))
            {
                game.ball.dx *= -1;
                game.ball.x = (WIDTHCANVAS/2 + (MAP1_OBSTACLE1_W/2)) + game.ball.radius;
            }
        }
        //sil y a rebond entre balle et paddle:
        if ((game.ball.x < WIDTHCANVAS / 2) && this.colision(game.ball, game.player1.paddle))
        {
            // game.player1.socket.emit('play', 1);
            // game.player2.socket.emit('play', 1);

            this.rebond(game.ball, game.player1.paddle);
            game.ball.x = 0 + PLAYER_WIDTH + game.ball.radius;
        }
        else if ((game.ball.x > WIDTHCANVAS / 2) && this.colision(game.ball, game.player2.paddle))
        {
            this.rebond(game.ball, game.player2.paddle);
            game.ball.x = WIDTHCANVAS - PLAYER_WIDTH - game.ball.radius;
        }
        /////
        //si le point est marqué:
        /////
        if ( game.ball.x <= (0 - game.ball.width) || game.ball.x >= (WIDTHCANVAS + game.ball.width))
        {
            //mise a jour des scores et emission au front
            game.ball.x <= (0 - game.ball.width) ? game.player2.points++ : 42;
            game.ball.x >= (WIDTHCANVAS + game.ball.width) ? game.player1.points++ : 42;
            // game.player1.socket.emit('play', 2);
            // game.player2.socket.emit('play', 2);
            game.player1.socket.emit('score', {
                score1: game.player1.points,
                score2: game.player2.points
            });
            game.player2.socket.emit('score', {
                score1: game.player1.points,
                score2: game.player2.points
            });
            

            ///Si Max SCORE atteint
            if (game.player1.points === MAX_SCORE || game.player2.points === MAX_SCORE)
            {
                clearInterval(game.id_interval);
                if (game.player1.points === MAX_SCORE)
                {
                    game.player1.socket.emit('win');
                    game.player2.socket.emit('lose');
                }
                else
                {
                    game.player1.socket.emit('lose');
                    game.player2.socket.emit('win');
                }
                return ;
            }
            //TO DO 
            //emission aux spectateurs

            //reinitialiser la balle et sa direction y vers celui qui vient de perdre
            // if (game.ball.x - game.ball.radius <= 0)
                // this.reinitBall(game.ball, 1);
            // else
                this.reinitBall(game.ball, -1);
            //reinit position joueur au centre
            this.reinitPlayers(game.player1, game.player2);
        }

        ///////
        ////////VERTICALEMENT
        ///////
        
        game.ball.y += game.ball.dy;
        
        
        //rebond obstacle horiz
        
        if ((WIDTHCANVAS/2 - MAP1_OBSTACLE1_W/2) <= game.ball.x - game.ball.radius && 
            game.ball.x + game.ball.radius <= (WIDTHCANVAS - (WIDTHCANVAS/2 - MAP1_OBSTACLE1_W/2))
            )
        {
            //rebond obstacle haut
            if (game.ball.y - game.ball.radius <= MAP1_OBSTACLE1_H)
            {
                game.ball.dy *= -1;
                game.ball.y = MAP1_OBSTACLE1_H + game.ball.radius;
            }
            //rebond obstacle bas
            else if ( game.ball.y + game.ball.radius >= (HEIGHTCANVAS - MAP1_OBSTACLE2_H))
            {
                game.ball.dy *= -1;
                game.ball.y = HEIGHTCANVAS - MAP1_OBSTACLE2_H - game.ball.radius;
            }
        }
        //sil y a un rebond horiz haut
        else if ( game.ball.y - game.ball.radius <= 0)
        {
            //inversement de la direction y
            game.ball.dy *= -1;
            game.ball.y = 0 + game.ball.radius;
        }
        //rebond horiz bas
        else if (game.ball.y + game.ball.radius >= HEIGHTCANVAS)
        {
            //inversement de la direction y
            game.ball.dy *= -1;
            game.ball.y = HEIGHTCANVAS - game.ball.radius;
            // game.player1.socket.emit('play', 0);
            // game.player2.socket.emit('play', 0);
        }

        //envoyer les datas aux sockets
        //pour eviter les copy cyclique, il faut enlever les sockets 
        var copy = JSON.parse(JSON.stringify(game, (key, value) => {
            if (key === 'socket')
                return undefined;
            return value;
        }));
        game.player1.socket.emit('drawMap1', copy);
        game.player2.socket.emit('drawMap1', copy);
    }








    // playerAutoMove(game: GameI): GameI {
    //     game.player1.paddle.y = (game.ball.y - game.player1.paddle.height / 2) * 0.55;
    //     game.player2.paddle.y = (game.ball.y - game.player2.paddle.height / 2) * 0.55;
    //     return game;
    // }

    private colision(ball: BallI, paddle: PointI): boolean {
        if (ball.x + ball.radius < (WIDTHCANVAS - paddle.width) && ball.x - ball.radius > (0 + paddle.width))
            return false;
        if (ball.y >= paddle.y && ball.y <= paddle.y + paddle.height)
            return true;
        return false;
    }

    private reinitBall(ball: BallI, dir: number): void {
        ball.speed = defaultSpeed;
        ball.x = WIDTHCANVAS /2;
        ball.y = HEIGHTCANVAS /2;
        ball.dx = ball.speed * dir;
        // let nbr = Math.random();
        // console.log("nbr = ", nbr);
        // if (nbr > 0.5)
            // ball.dy = nbr * 3;
        // else
            // ball.dy = defaultSpeed * -1;
    }

    reinitPlayers(player1: PlayerI, player2: PlayerI): void {
        player1.paddle.y = HEIGHTCANVAS / 2 - player1.paddle.height / 2;
        player2.paddle.y = HEIGHTCANVAS / 2 - player2.paddle.height / 2;
    }

    private rebond(ball: BallI, paddle: PointI): void {
        //a chaque rebond on ajpute de la vitesse
        
        if (Math.abs(ball.speed) < MAX_SPEED) {
			ball.speed *= 1.2;
		}
        else
            ball.speed = MAX_SPEED;
        //calcules du rebond
        ball.dx  = -Math.sign(ball.dx);
        ball.dy = ((ball.y + ball.height/2) - (paddle.y + paddle.height/2))/2;

        if (Math.abs(ball.dx) < Math.abs(ball.dy) / 3)
          ball.dx = Math.abs(ball.dy) / 3 * Math.sign(ball.dx);

        let magnitude: number = Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2));

        ball.dx = ball.dx / magnitude * ball.speed;
        ball.dy = ball.dy / magnitude * ball.speed;
    }
    
    initState(): GameI{
		var p1: PlayerI = {
    		// user: UserI;
    		// socket: Socket,
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
    		// user: UserI;
    		// socket: Socket;
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
			id: "1",
			player1: p1,
			player2: p2,
			// acceleration: 3,
            // direction: {
            //     x: 0,
            //     y: 0,
            //     dx: 0,
            //     dy: 0,
            //     height: 0,
            //     width: 0
            // },
            type: 0,
			// score1: 0,
			// score2: 0,
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
}
