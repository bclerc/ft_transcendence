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
const BALL_RADIUS = 4;
const PLAYER_HEIGHT = 65;
const PLAYER_WIDTH = 8;
const HEIGHTCANVAS = 400;
const WIDTHCANVAS = 500;
const MAX_SCORE = 5;
const MAX_SPEED = 6;
const defaultSpeed = 3;
let PongService = class PongService {
    loopGameNormal(game) {
        game.player1.paddle.y += game.player1.paddle.dy;
        game.player2.paddle.y += game.player2.paddle.dy;
        if (game.player1.paddle.y < 0)
            game.player1.paddle.y = 0;
        else if (game.player1.paddle.y > HEIGHTCANVAS - game.player1.paddle.height)
            game.player1.paddle.y = HEIGHTCANVAS - game.player1.paddle.height;
        if (game.player2.paddle.y < 0)
            game.player2.paddle.y = 0;
        else if (game.player2.paddle.y > HEIGHTCANVAS - game.player2.paddle.height)
            game.player2.paddle.y = HEIGHTCANVAS - game.player2.paddle.height;
        game.ball.y += game.ball.dy;
        if (game.ball.y < 0) {
            game.ball.dy *= -1;
            game.ball.y = 0;
        }
        else if (game.ball.y > HEIGHTCANVAS - game.ball.height) {
            game.ball.dy *= -1;
            game.ball.y = HEIGHTCANVAS - game.ball.height;
        }
        game.ball.x += game.ball.dx;
        if (game.ball.x <= (0 - game.ball.width) || game.ball.x >= (WIDTHCANVAS + game.ball.width)) {
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
            if (game.player1.points === MAX_SCORE || game.player2.points === MAX_SCORE) {
                clearInterval(game.id_interval);
                if (game.player1.points === 1) {
                    game.player1.socket.emit('win');
                    game.player2.socket.emit('lose');
                }
                else {
                    game.player1.socket.emit('lose');
                    game.player2.socket.emit('win');
                }
                return;
            }
            if (game.ball.x <= (0 - game.player1.paddle.width))
                this.reinitBall(game.ball, -1);
            else
                this.reinitBall(game.ball, 1);
            this.reinitPlayers(game.player1, game.player2);
        }
        else if (((game.ball.x < WIDTHCANVAS / 2) && this.colision(game.ball, game.player1.paddle)) || ((game.ball.x > WIDTHCANVAS / 2) && this.colision(game.ball, game.player2.paddle))) {
            if (this.colision(game.ball, game.player1.paddle))
                this.rebond(game.ball, game.player1.paddle);
            else
                this.rebond(game.ball, game.player2.paddle);
        }
        var copy = JSON.parse(JSON.stringify(game, (key, value) => {
            if (key === 'socket')
                return undefined;
            return value;
        }));
        game.player1.socket.emit('draw', copy);
        game.player2.socket.emit('draw', copy);
    }
    colision(ball, paddle) {
        if (ball.x < WIDTHCANVAS - paddle.width && ball.x > 0 + paddle.width)
            return false;
        if (ball.y >= paddle.y && ball.y <= paddle.y + paddle.height)
            return true;
        return false;
    }
    reinitBall(ball, dir) {
        ball.speed = defaultSpeed;
        ball.x = WIDTHCANVAS / 2;
        ball.y = HEIGHTCANVAS / 2;
        ball.dx = ball.speed * dir;
        if (Math.random() > 0.5)
            ball.dy = Math.random() * 3;
        else
            ball.dy = -Math.random() * 3;
    }
    reinitPlayers(player1, player2) {
        player1.paddle.y = HEIGHTCANVAS / 2 - player1.paddle.height / 2;
        player2.paddle.y = HEIGHTCANVAS / 2 - player2.paddle.height / 2;
    }
    rebond(ball, paddle) {
        if (Math.abs(ball.speed) < MAX_SPEED) {
            ball.speed *= 1.2;
        }
        ball.dx = -Math.sign(ball.dx);
        ball.dy = ((ball.y + ball.height / 2) - (paddle.y + paddle.height / 2)) / 2;
        if (Math.abs(ball.dx) < Math.abs(ball.dy) / 3)
            ball.dx = Math.abs(ball.dy) / 3 * Math.sign(ball.dx);
        let magnitude = Math.sqrt(Math.pow(ball.dx, 2) + Math.pow(ball.dy, 2));
        ball.dx = ball.dx / magnitude * ball.speed;
        ball.dy = ball.dy / magnitude * ball.speed;
    }
    initState() {
        var p1 = {
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
        var p2 = {
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
        var state = {
            id: "1",
            player1: p1,
            player2: p2,
            type: 0,
            ball: {
                x: WIDTHCANVAS / 2,
                y: HEIGHTCANVAS / 2,
                dx: -2,
                dy: -5,
                speed: 2,
                width: 3,
                height: 3,
                radius: BALL_RADIUS
            },
        };
        return state;
    }
};
PongService = __decorate([
    (0, common_1.Injectable)()
], PongService);
exports.PongService = PongService;
//# sourceMappingURL=pong.service.js.map