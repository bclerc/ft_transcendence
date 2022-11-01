import { Inject, Injectable } from '@nestjs/common';
import { BallI } from '../interfaces/ball.interface';
import { PlayerI } from '../interfaces/player.interface';
import { PointI } from '../interfaces/point.interface';
import { GameI } from '../interfaces/game.interface';
import { Socket } from 'socket.io';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { GameModule } from 'src/game/game.module';


const BALL_RADIUS = 4;
const PLAYER_HEIGHT = 65;
const PLAYER_WIDTH = 8;
const HEIGHTCANVAS = 400;
const WIDTHCANVAS = 600;

const MAX_SCORE = 50;

const MAX_SPEED = 13; //ball
const defaultSpeed = 5; //speed de la balle par default

const SPEED_PLAYER = 10



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

////////
//// MAP2
///////// obstacle1
const MAP2_OBSTACLE_W = 20; // width
const MAP2_OBSTACLE_H = 200; // height
const MAP2_OBSTACLE_POSX = (WIDTHCANVAS / 2) - (MAP1_OBSTACLE1_W / 2); // position x
const MAP2_OBSTACLE_POSY = 0; // position y
const MAP2_OBSTACLE_RADIUS = 2;
const MAP2_OBSTACLE_SPEED = 2;
////
////


@Injectable()
export class PongService {

    constructor(
	    @Inject(OnlineUserService) private onlineUserService: OnlineUserService,
    )
    {};

    loopGameNormal(game: GameI){

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
        }
        //rebond vertical bas
        else if (game.ball.y > HEIGHTCANVAS - game.ball.height)
        {
            //inversement de la direction y
            game.ball.dy *= -1;
            game.ball.y = HEIGHTCANVAS - game.ball.height;
        }

        ////horizontalement
        game.ball.x += game.ball.dx;

        //sil y a rebond entre balle et paddle:
        if (((game.ball.x < WIDTHCANVAS / 2) && this.colision(game.ball, game.player1.paddle)) || ((game.ball.x > WIDTHCANVAS / 2) && this.colision(game.ball, game.player2.paddle)))
        {
            if ((game.ball.x < WIDTHCANVAS / 2) && this.colision(game.ball, game.player1.paddle))
            {
                this.rebond(game.ball, game.player1.paddle);
                game.ball.x = 0 + PLAYER_WIDTH;
            }
            else
            {
                this.rebond(game.ball, game.player2.paddle);
                game.ball.x = WIDTHCANVAS - PLAYER_WIDTH;
            }
        }
        //si le point est marqué:
        else if ( game.ball.x <= (0 - game.ball.width) || game.ball.x >= (WIDTHCANVAS + game.ball.width))
        {
            //mise a jour des scores et emission au front
            game.ball.x <= (0 - game.ball.width) ? game.player2.points++ : 42;
            game.ball.x >= (WIDTHCANVAS + game.ball.width) ? game.player1.points++ : 42;
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

            if (game.ball.x <= (0 - game.player1.paddle.width))     //reinitialiser la balle et sa direction y vers celui qui vient de perdre
                this.reinitBall(game.ball, -1);
            else
                this.reinitBall(game.ball, 1);
            this.reinitPlayers(game.player1, game.player2);     //reinit position joueur au centre
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
            if (game.ball.x - game.ball.radius <= 0)
                this.reinitBall(game.ball, 1);
            else
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

//////
//LOOP3
/////

loopGameMap2(game: GameI){
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


    /////
    //REBOND OBSTACLE AVANT TOUT
    /////

    //si ball de droite a gauche
    if (game.ball.dx < 0)
    {
        if (game.ball.y + game.ball.radius >= game.obstacle.y && game.ball.y - game.ball.radius <= game.obstacle.y + game.obstacle.height)
        {
            if (game.ball.x - game.ball.radius <= game.obstacle.x + game.obstacle.width && game.ball.x + game.ball.radius >= game.obstacle.x)
            {
                game.ball.x = game.obstacle.x + game.obstacle.width;
                game.ball.dx *= -1;
            }
        }
        else
        {
            if (game.ball.x >= game.obstacle.x && game.ball.x <= game.obstacle.x + game.obstacle.width)
            {
                // if ()
                // {
                    
                // }
            }
        }
        // else if (   (game.ball.y + game.ball.radius <= game.obstacle.y && game.ball.y - game.ball.radius > 0))
        // {
        //     if (game.ball.x )
        // }
        // else if (game.ball.y - game.ball.radius >= game.obstacle.y + game.obstacle.height && game.ball.y + game.ball.radius > HEIGHTCANVAS)
        // {

        // }
    }
    else
    {
        if (game.ball.y + game.ball.radius >= game.obstacle.y && game.ball.y - game.ball.radius <= game.obstacle.y + game.obstacle.height)
        {
            if (game.ball.x + game.ball.radius >= game.obstacle.x && game.ball.x - game.ball.radius <= game.obstacle.x)
            {
                game.ball.x = game.obstacle.x - game.ball.radius;
                game.ball.dx *= -1;
            }
        }
    }
    
    ////////
    //////HORIZONT
    ////////

    //verifier avant et apres le deplacement de ball si ca a touché lobstacle en deplacvement
    
    game.ball.x += game.ball.dx;

    //sil y a rebond entre balle et paddle:
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
    /////
    //si le point est marqué:
    /////
    if ( game.ball.x <= (0 - game.ball.width) || game.ball.x >= (WIDTHCANVAS + game.ball.width))
    {
        //mise a jour des scores et emission au front
        game.ball.x <= (0 - game.ball.width) ? game.player2.points++ : 42;
        game.ball.x >= (WIDTHCANVAS + game.ball.width) ? game.player1.points++ : 42;
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
        if (game.ball.x - game.ball.radius <= 0)
            this.reinitBall(game.ball, 1);
        else
            this.reinitBall(game.ball, -1);
        //reinit position joueur au centre et obstacle
        this.reinitPlayers(game.player1, game.player2);
        this.reinitObstacle(game.obstacle);
    }

    ///////
    ////////VERTICALEMENT
    ///////
    
    game.ball.y += game.ball.dy;



    //sil y a un rebond bordures terrain
    if ( game.ball.y - game.ball.radius <= 0)
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
    }

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

    //envoyer les datas aux sockets
    //pour eviter les copy cyclique, il faut enlever les sockets 
    var copy = JSON.parse(JSON.stringify(game, (key, value) => {
        if (key === 'socket')
            return undefined;
        return value;
    }));
    game.player1.socket.emit('drawMap2', copy);
    game.player2.socket.emit('drawMap2', copy);
}




    async drawInit(game: GameI)
    {
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
    }

	delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
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

    reinitObstacle(obstacle: PointI): void
    {
        obstacle.x = WIDTHCANVAS / 2 - MAP2_OBSTACLE_W / 2;
        obstacle.y = MAP2_OBSTACLE_POSY;
        obstacle.dx = 0;
        obstacle.dy = MAP2_OBSTACLE_SPEED;
        obstacle.height = MAP2_OBSTACLE_H;
        obstacle.width = MAP2_OBSTACLE_W;
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
			id: "1",
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


    keydownZ(game: GameI, client: Socket)
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

    keydownS(game: GameI, client: Socket)
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

    keyupZ(game: GameI, client: Socket)
    {
        if (game.player1.socket === client)
           game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
        else
            game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
    }

    keyupS(game: GameI, client: Socket)
    {
        if (game.player1.socket === client)
            game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
        else
            game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
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

    deleteGame(g: GameI, allGames: GameI[]){
		var newAllGames: GameI[] = allGames.filter(game => game != g);
		allGames = newAllGames;
	}
}
