import { Inject, Injectable } from '@nestjs/common';
import { BallI } from '../interfaces/ball.interface';
import { PlayerI } from '../interfaces/player.interface';
import { PointI } from '../interfaces/point.interface';
import { GameI } from '../interfaces/game.interface';
import { Socket } from 'socket.io';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { VariablePong } from '../variables.pong';

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
////
export const MAX_SCORE = 50;
export const MAX_SPEED = 10; //ball
export const defaultSpeed = 5; //speed de la balle par default
export const SPEED_PLAYER = 8

@Injectable()
export class PongService {
	// variables: VariablePong;

    constructor(
	    @Inject(OnlineUserService) private onlineUserService: OnlineUserService,
        // private variables: VariablePong
    )
    {
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        console.log("ici");
        var a = WIDTHCANVAS / 2;
        console.log(a);
        // console.log(variables);
    };

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
    // console.log(this.variables);
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
    // de h en b && 


    if  (   game.ball.dy > 0 && 
            game.ball.x >= game.obstacle.x - game.ball.radius &&
            game.ball.x <= game.obstacle.x + game.obstacle.width + game.ball.radius &&
            game.ball.y >= game.obstacle.y - game.ball.radius && 
            game.ball.y <= game.obstacle.y + game.ball.radius
    )
    {
        console.log("North");
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
        console.log("South");
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
        console.log("Est");
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
        console.log("West coast negzz ");
        game.ball.x = game.obstacle.x - game.ball.radius;
        game.ball.dx *= -1;
    }



    // if (game.ball.dy > 0 && game.ball.y > 0 + game.ball.radius && game.ball.y <= game.obstacle.y + game.obstacle.height)
    //     {
    //         if (game.ball.x + game.ball.radius >= game.obstacle.x && game.ball.x - game.ball.radius <= game.obstacle.x + game.obstacle.width && game.ball.y + game.ball.radius >= game.obstacle.y)
    //         {
    //             console.log("4");
    //             game.ball.y = game.obstacle.y - game.ball.radius;
    //             game.ball.dy *= -1;
    //     }
    // }
    // else if (game.ball.dy < 0 && game.ball.y + game.ball.radius < HEIGHTCANVAS && game.ball.y - game.ball.radius >= game.obstacle.y)
    // {
    //     if (game.ball.x + game.ball.radius >= game.obstacle.x && game.ball.x - game.ball.radius <= game.obstacle.x + game.obstacle.width && game.ball.y - game.ball.radius <= game.obstacle.y + game.obstacle.height)
    //     {
    //     console.log("5");
    //     game.ball.y = game.obstacle.y + game.obstacle.height + game.ball.radius;
    //         game.ball.dy *= -1;
    //     }
    // }
    // else if (game.ball.y + game.ball.radius >= game.obstacle.y && game.ball.y - game.ball.radius <= game.obstacle.y + game.obstacle.height)
    // {
    //     if (game.ball.dx < 0 && game.ball.x - game.ball.radius <= game.obstacle.x + game.obstacle.width && game.ball.x - game.ball.radius >= game.obstacle.x)
    //     {
    //         console.log("2", game.ball, game.obstacle);
    //         game.ball.x = game.obstacle.x + game.obstacle.width;
    //         game.ball.dx *= -1;
    //     }
    //     else if (game.ball.dx > 0 && game.ball.x + game.ball.radius >= game.obstacle.x && game.ball.x + game.ball.radius <= game.obstacle.x + game.obstacle.width)
    //     {
    //         console.log("3");
    //         game.ball.x = game.obstacle.x - game.ball.radius;
    //         game.ball.dx *= -1;
    //     }
    // }
    // else if (game.ball.y + game.ball.radius < HEIGHTCANVAS && game.ball.y - game.ball.radius >= game.obstacle.y + game.obstacle.height)
    // {

    // }    
    
    


    //  if (game.ball.y + game.ball.radius >= game.obstacle.y && game.ball.y - game.ball.radius <= game.obstacle.y + game.obstacle.height)
        // {
        //     if (game.ball.x + game.ball.radius >= game.obstacle.x && game.ball.x - game.ball.radius <= game.obstacle.x)
        //     {
        //         game.ball.x = game.obstacle.x - game.ball.radius;
        //         game.ball.dx *= -1;
        //     }
        // }
    

    /////
    //MOUVEMENT DE LA BALLE
    ////        

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
        game.ball.x <= (0 - game.ball.width) ? (game.player2.points++ && this.reinitBall(game.ball, 1)) : (game.player1.points++ && this.reinitBall(game.ball, 1));
        // game.ball.x >= (WIDTHCANVAS + game.ball.width) ? game.player1.points++ : 42;
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
        //     this.reinitBall(game.ball, 1);
        // else
        //     this.reinitBall(game.ball, -1);
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

loopGameMap3(game: GameI){
    ////
    //MOUVEMENTS DES JOUEURS
    ////
    // console.log(this.variables);
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

    /////
    //REBOND OBSTACLE AVANT TOUT
    /////

    // if  (   game.ball.dy > 0 && 
    //         game.ball.x >= game.obstacle.x - game.ball.radius &&
    //         game.ball.x <= game.obstacle.x + game.obstacle.width + game.ball.radius &&
    //         game.ball.y >= game.obstacle.y - game.ball.radius && 
    //         game.ball.y <= game.obstacle.y + game.ball.radius
    // )
    // {
    //     console.log("North");
    //     game.ball.y = game.obstacle.y - game.ball.radius;
    //     game.ball.dy *= -1;
    // }
    
    // else if (    game.ball.dy < 0 && 
    //         game.ball.x >= game.obstacle.x - game.ball.radius &&
    //         game.ball.x <= game.obstacle.x + game.obstacle.width + game.ball.radius &&
    //         game.ball.y >= game.obstacle.y + game.obstacle.height - game.ball.radius && 
    //         game.ball.y <= game.obstacle.y + game.obstacle.height + game.ball.radius
    // )
    // {
    //     console.log("South");
    //     game.ball.y = game.obstacle.y + game.obstacle.height + game.ball.radius;
    //     game.ball.dy *= -1;
    // }
    // else if (    game.ball.dx < 0 && 
    //     game.ball.x >= game.obstacle.x + game.obstacle.width - game.ball.radius &&
    //     game.ball.x <= game.obstacle.x + game.obstacle.width + game.ball.radius &&
    //     game.ball.y >= game.obstacle.y && 
    //     game.ball.y <= game.obstacle.y + game.obstacle.height
    // )
    // {
    //     console.log("Est");
    //     game.ball.x = game.obstacle.x + game.obstacle.width + game.ball.radius;
    //     game.ball.dx *= -1;
    // }
    // else if (    game.ball.dx > 0 && 
    //     game.ball.x >= game.obstacle.x - game.ball.radius &&
    //     game.ball.x <= game.obstacle.x + game.ball.radius &&
    //     game.ball.y >= game.obstacle.y && 
    //     game.ball.y <= game.obstacle.y + game.obstacle.height
    // )
    // {
    //     console.log("West coast negzz ");
    //     game.ball.x = game.obstacle.x - game.ball.radius;
    //     game.ball.dx *= -1;
    // }

    /////
    //MOUVEMENT DE LA BALLE
    ////        

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
        game.ball.x <= (0 - game.ball.width) ? (game.player2.points++ && this.reinitBall(game.ball, 1)) : (game.player1.points++ && this.reinitBall(game.ball, 1));
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
        game.ball.dy *= -1;
        game.ball.y = 0 + game.ball.radius;
    }
    //rebond horiz bas
    else if (game.ball.y + game.ball.radius >= HEIGHTCANVAS)
    {
        game.ball.dy *= -1;
        game.ball.y = HEIGHTCANVAS - game.ball.radius;
    }

    var copy = JSON.parse(JSON.stringify(game, (key, value) => {
        if (key === 'socket')
            return undefined;
        return value;
    }));
    game.player1.socket.emit('drawMap3', copy);
    game.player2.socket.emit('drawMap3', copy);
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

    private colision(ball: BallI, paddle: PointI): boolean {
        if (ball.x + ball.radius < (WIDTHCANVAS - paddle.width) && ball.x - ball.radius > (0 + paddle.width))
            return false;
        if (ball.y >= paddle.y && ball.y <= paddle.y + paddle.height)
            return true;
        return false;
    }

    private reinitBall(ball: BallI, dir: number): void {
        // ball.speed = defaultSpeed;
        ball.x = WIDTHCANVAS /2;
        ball.y = HEIGHTCANVAS /2;
        // ball.dx = ball.speed * dir;
        if (dir > 0)
    		ball.dx = Math.floor(Math.random() * (-1 - -defaultSpeed + 1) + -defaultSpeed);
        else
    		ball.dx = Math.floor(Math.random() * (defaultSpeed - 1 + 1) + 1);
        ball.dy = Math.floor(Math.random() * (defaultSpeed - -defaultSpeed + 1) + -defaultSpeed);

        // ball.dx = Math.random() * 10 * dir;
        // ball.dy = Math.random() * 10;
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
        
        // if (Math.abs(ball.speed) < MAX_SPEED) {
			// ball.speed *= 1.2;
		// }
        // else
            // ball.speed = MAX_SPEED;
        //calcules du rebond

        var impact = ball.y - paddle.y - paddle.height / 2;
        var ratio = 100 / (paddle.height / 2);

        ball.dy = Math.round(impact * ratio / 10);
        if (ball.dy === 0)
            ball.dy = 1;
        ball.dx *= -1.2;
        if (ball.dx < 0 && ball.dx < -MAX_SPEED)
			ball.dx = -MAX_SPEED;
        else if (ball.dx > 0 && ball.dx > MAX_SPEED)
			ball.dx = MAX_SPEED;

        //old vers
        // ball.dx  = -Math.sign(ball.dx);
        // ball.dy = ((ball.y + ball.height/2) - (paddle.y + paddle.height/2))/2;

        // if (Math.abs(ball.dx) < Math.abs(ball.dy) / 3)
        //   ball.dx = Math.abs(ball.dy) / 3 * Math.sign(ball.dx);

        // let magnitude: number = Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2));

        // ball.dx = ball.dx / magnitude * ball.speed;
        // ball.dy = ball.dy / magnitude * ball.speed;
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
