import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { BallI } from '../interfaces/ball.interface';
import { PlayerI } from '../interfaces/player.interface';
import { PointI } from '../interfaces/point.interface';
import { GameI } from '../interfaces/game.interface';

const WIDTH=500; //x du cadre du pong
const HEIGHT=300; //y du cadre

const paddleWidht=15 //x du paddle
const paddleHeight=50 //y du paddle

const defaultSpeed=2; //speed de la balle par default

@Injectable()
export class PongService {

    endGame(state: GameI, server: Server){
        clearInterval(state.id);
    }
    
    loopGame(state: GameI, server: Server){
        var player1: PlayerI = state.player1;
        var player2: PlayerI = state.player2;
        var ball: BallI = state.ball;
        ////
        //MOUVEMENTS DES JOUEURS
        ////
        player1.paddle.y += player1.paddle.dy;
        player2.paddle.y += player2.paddle.dy;
        
        //blocage des paddle pour au'il ne deborde pas en haut ou en bas
        //pour player1
        if (player1.paddle.y < 0)
            player1.paddle.y = 0;
        else if (player1.paddle.y > HEIGHT - paddleHeight)
            player1.paddle.y =  HEIGHT - paddleHeight;
            //pour player2
        if (player2.paddle.y < 0)
        player2.paddle.y = 0;
        else if (player2.paddle.y > HEIGHT - paddleHeight)
        player2.paddle.y =  HEIGHT - paddleHeight;

        /////
        //MOUVEMENT DE LA BALLE
        ////

        ////verticallement
        ball.y += ball.dy;
        //sil y a un rebond vertical haut
        if (ball.y < 0)
        {
            //inversement de la direction y
            ball.dy *= -1;
            ball.y = 0
        }
        //rebond vertical bas
        else if (ball.y > HEIGHT - ball.height)
        {
            //inversement de la direction y
            ball.dy *= -1;
            ball.y = HEIGHT - ball.height;
        }

        ////horizontalement
        ball.x += ball.dx;
        //si le point est marqué
        if (ball.x <= (0 - ball.width) || ball.x >= (WIDTH + ball.width))
        {
            //mise a jour des scores et emission au front
            ball.x <= (0 - ball.width) ? player2.points++ : 42;
            ball.x >= (WIDTH + ball.width) ? player1.points++ : 42;
            server.emit('score', [state.player1.points, state.player2.points]);
            // server.to(player1.socket.id).emit('score', [state.player1.points, state.player2.points]);
            // server.to(player2.socket.id).emit('score', [state.player1.points, state.player2.points]);
            
            //TO DO 
            //emission aux spectateurs

            //reinitialiser la balle et sa direction y vers celui aui vient de perdre
            if (ball.x <= (0 - paddleWidht))
                this.reinitBall(ball, -1);
            else if (ball.x >= (WIDTH + paddleWidht))    
                this.reinitBall(ball, 1);
        }
        //sil y a rebond entre balle et paddle
        if (this.colision(ball, player1.paddle) || this.colision(ball, player2.paddle))
        {
            if (this.colision(ball, player1.paddle))
                this.rebond(ball, player1.paddle);
            else
                this.rebond(ball, player2.paddle);
        }

        //creer les nouvelles data et les envoyer aux sockets
        this.emiteNewData(server, ball, player1, player2);
    }

    playerAutoMove(state: GameI) {
        state.player1.paddle.y += state.ball.speed * 0.75;
        state.player2.paddle.y += state.ball.speed * 0.75;
    }

    private colision(ball: BallI, paddle: PointI): boolean {
        return ball.x < paddle.x + paddle.width &&
        ball.x + ball.width > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.height > paddle.y;
    }

    private reinitBall(ball: BallI, dir: number): void {
        ball.speed = defaultSpeed;
        ball.x = 200 - ball.width/2;
        ball.y = 150 - ball.height/2;
        ball.dx = 10 * dir;
        ball.dy = Math.random() * 20 - 10;
        //reset magnitude of ball to speed multiplier
        let magnitude: number = Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2));
        ball.dx = ball.dx / magnitude * ball.speed;
        ball.dy = ball.dy / magnitude * ball.speed;
    }

    private rebond(ball: BallI, paddle: PointI): void {
        //a chaque rebond on ajpute de la vitesse
        ball.speed *= 1.05;

        //calcules du rebond
        ball.dx  = -Math.sign(ball.dx) * 10;
        ball.dy = ((ball.y + ball.height/2) - (paddle.y + paddle.height/2))/2;
        if (Math.abs(ball.dx) < Math.abs(ball.dy) / 3)
          ball.dx = Math.abs(ball.dy) / 3 * Math.sign(ball.dx);
        if (Math.abs(ball.dy) < 0.5)
          ball.dy = 0;
        let magnitude: number = Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2));
        ball.dx = ball.dx / magnitude * ball.speed;
        ball.dy = ball.dy / magnitude * ball.speed;
        if (paddle.x < 200)
            ball.x = paddle.x + paddle.width;
        else
            ball.x = paddle.x - paddle.width;
    }

    private emiteNewData(server: Server, ball: BallI, player1: PlayerI, player2: PlayerI)
    {
        var n_data: GameI = {
            player1:{
              paddle: player1.paddle,
              points: player1.points,
            },
            player2:{
              paddle: player2.paddle,
              points: player2.points,
            },
            ball: ball
          };

          //envoi des nouvelles datas aux sockets des joueurs
        //   server.to(player2.socket.id).emit('gamestate', n_data);
        //   server.to(player1.socket.id).emit('gamestate', n_data);

          //TO DO 
          //envoyer aussi aux spectateurs

    }
}
