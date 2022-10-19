"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongService = void 0;
const common_1 = require("@nestjs/common");
const WIDTH = 500;
const HEIGHT = 300;
const paddleWidht = 15;
const paddleHeight = 50;
const defaultSpeed = 2;
let PongService = class PongService {
    endGame(state, server) {
        clearInterval(state.id);
    }
    loopGame(state, server) {
        var player1 = state.player1;
        var player2 = state.player2;
        var ball = state.ball;
        player1.paddle.y += player1.paddle.dy;
        player2.paddle.y += player2.paddle.dy;
        if (player1.paddle.y < 0)
            player1.paddle.y = 0;
        else if (player1.paddle.y > HEIGHT - paddleHeight)
            player1.paddle.y = HEIGHT - paddleHeight;
        if (player2.paddle.y < 0)
            player2.paddle.y = 0;
        else if (player2.paddle.y > HEIGHT - paddleHeight)
            player2.paddle.y = HEIGHT - paddleHeight;
        ball.y += ball.dy;
        if (ball.y < 0) {
            ball.dy *= -1;
            ball.y = 0;
        }
        else if (ball.y > HEIGHT - ball.height) {
            ball.dy *= -1;
            ball.y = HEIGHT - ball.height;
        }
        ball.x += ball.dx;
        if (ball.x <= (0 - ball.width) || ball.x >= (WIDTH + ball.width)) {
            ball.x <= (0 - ball.width) ? player2.points++ : 42;
            ball.x >= (WIDTH + ball.width) ? player1.points++ : 42;
            server.emit('score', [state.player1.points, state.player2.points]);
            if (ball.x <= (0 - paddleWidht))
                this.reinitBall(ball, -1);
            else if (ball.x >= (WIDTH + paddleWidht))
                this.reinitBall(ball, 1);
        }
        if (this.colision(ball, player1.paddle) || this.colision(ball, player2.paddle)) {
            if (this.colision(ball, player1.paddle))
                this.rebond(ball, player1.paddle);
            else
                this.rebond(ball, player2.paddle);
        }
        this.emiteNewData(server, ball, player1, player2);
    }
    playerAutoMove(state) {
        state.player1.paddle.y += state.ball.speed * 0.75;
        state.player2.paddle.y += state.ball.speed * 0.75;
    }
    colision(ball, paddle) {
        return ball.x < paddle.x + paddle.width &&
            ball.x + ball.width > paddle.x &&
            ball.y < paddle.y + paddle.height &&
            ball.y + ball.height > paddle.y;
    }
    reinitBall(ball, dir) {
        ball.speed = defaultSpeed;
        ball.x = 200 - ball.width / 2;
        ball.y = 150 - ball.height / 2;
        ball.dx = 10 * dir;
        ball.dy = Math.random() * 20 - 10;
        let magnitude = Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2));
        ball.dx = ball.dx / magnitude * ball.speed;
        ball.dy = ball.dy / magnitude * ball.speed;
    }
    rebond(ball, paddle) {
        ball.speed *= 1.05;
        ball.dx = -Math.sign(ball.dx) * 10;
        ball.dy = ((ball.y + ball.height / 2) - (paddle.y + paddle.height / 2)) / 2;
        if (Math.abs(ball.dx) < Math.abs(ball.dy) / 3)
            ball.dx = Math.abs(ball.dy) / 3 * Math.sign(ball.dx);
        if (Math.abs(ball.dy) < 0.5)
            ball.dy = 0;
        let magnitude = Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2));
        ball.dx = ball.dx / magnitude * ball.speed;
        ball.dy = ball.dy / magnitude * ball.speed;
        if (paddle.x < 200)
            ball.x = paddle.x + paddle.width;
        else
            ball.x = paddle.x - paddle.width;
    }
    emiteNewData(server, ball, player1, player2) {
        var n_data = {
            player1: {
                paddle: player1.paddle,
                points: player1.points,
            },
            player2: {
                paddle: player2.paddle,
                points: player2.points,
            },
            ball: ball
        };
    }
};
PongService = __decorate([
    (0, common_1.Injectable)()
], PongService);
exports.PongService = PongService;
//# sourceMappingURL=pong2.service.js.map