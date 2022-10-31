"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const pong_service_1 = require("./services/pong.service");
const PLAYER_HEIGHT = 65;
const PLAYER_WIDTH = 8;
const HEIGHTCANVAS = 400;
const WIDTHCANVAS = 600;
const NORMALGAME = 0;
const MAX_MAPID = 1;
const SPEED_PLAYER = 10;
const RIGHTSIDE = 0;
const LEFTSIDE = 1;
let PongGateway = class PongGateway {
    constructor(pongService) {
        this.pongService = pongService;
        this.connectedUsers = [];
        this.state = {};
        this.allGames = [];
        this.allRandomGames = [];
    }
    ;
    afterInit(server) {
    }
    handleDisconnect(client) {
        this.connectedUsers = this.connectedUsers.filter((user) => user.id != client.id);
        var g = this.allGames.find(game => (game.player1.socket === client));
        this.deleteGame(g);
    }
    handleConnection(client, ...args) {
        this.addNewUser(client);
    }
    init(client) {
        client.emit('drawInit');
        client.emit('enableButtonS');
    }
    keydownZ(client) {
        var game = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
        if (game) {
            if (game.player1.socket === client) {
                if (game.player1.paddle.dy != -SPEED_PLAYER)
                    game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
            }
            else {
                if (game.player2.paddle.dy != -SPEED_PLAYER)
                    game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
            }
        }
        else {
            var game = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
            if (game) {
                if (game.player1.socket === client) {
                    if (game.player1.paddle.dy != -SPEED_PLAYER)
                        game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
                }
                else {
                    if (game.player2.paddle.dy != -SPEED_PLAYER)
                        game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
                }
            }
        }
    }
    keydownW(client) {
        var game = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
        if (game) {
            if (game.player1.socket === client) {
                if (game.player1.paddle.dy != -SPEED_PLAYER)
                    game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
            }
            else {
                if (game.player2.paddle.dy != -SPEED_PLAYER)
                    game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
            }
        }
        else {
            var game = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
            if (game) {
                if (game.player1.socket === client) {
                    if (game.player1.paddle.dy != -SPEED_PLAYER)
                        game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
                }
                else {
                    if (game.player2.paddle.dy != -SPEED_PLAYER)
                        game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
                }
            }
        }
    }
    keydownS(client) {
        var game = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
        if (game) {
            if (game.player1.socket === client) {
                if (game.player1.paddle.dy != SPEED_PLAYER)
                    game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
            }
            else {
                if (game.player2.paddle.dy != SPEED_PLAYER)
                    game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
            }
        }
        else {
            var game = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
            if (game) {
                if (game.player1.socket === client) {
                    if (game.player1.paddle.dy != SPEED_PLAYER)
                        game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
                }
                else {
                    if (game.player2.paddle.dy != SPEED_PLAYER)
                        game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
                }
            }
        }
    }
    keyupZ(client) {
        var game = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
        if (game) {
            if (game.player1.socket === client)
                game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
            else
                game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
        }
        else {
            var game = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
            if (game) {
                if (game.player1.socket === client)
                    game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
                else
                    game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
            }
        }
    }
    keyupW(client) {
        var game = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
        if (game) {
            if (game.player1.socket === client)
                game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
            else
                game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
        }
        else {
            var game = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
            if (game) {
                if (game.player1.socket === client)
                    game.player1.paddle.dy = game.player1.paddle.dy + SPEED_PLAYER;
                else
                    game.player2.paddle.dy = game.player2.paddle.dy + SPEED_PLAYER;
            }
        }
    }
    keyupS(client) {
        var game = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
        if (game) {
            if (game.player1.socket === client)
                game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
            else
                game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
        }
        else {
            var game = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
            if (game) {
                if (game.player1.socket === client)
                    game.player1.paddle.dy = game.player1.paddle.dy - SPEED_PLAYER;
                else
                    game.player2.paddle.dy = game.player2.paddle.dy - SPEED_PLAYER;
            }
        }
    }
    async newGame(client) {
        var game = this.searchGameAwaiting();
        if (game) {
            this.joinGame(client, game);
            client.emit('drawName', 0);
            await this.delay(1500);
            if (game.player1.socket)
                game.player1.socket.emit('stopSearchLoop', game.id_searchinterval1);
            if (game.player2.socket)
                game.player2.socket.emit('stopSearchLoop', game.id_searchinterval2);
            game.id_searchinterval1 = 0;
            game.id_searchinterval2 = 0;
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
            this.startGame(game, NORMALGAME);
        }
        else {
            game = this.creatNewGame(client);
            client.emit('drawName', 1);
        }
    }
    async newGameRandom(client) {
        var game = this.searchGameAwaitingRandom();
        if (game) {
            this.joinGame(client, game);
            client.emit('drawName', RIGHTSIDE);
            var x = Math.floor(Math.random() * (MAX_MAPID - 1 + 1) + 1);
            await this.delay(1500);
            if (game.player1.socket)
                game.player1.socket.emit('stopSearchLoop', game.id_searchinterval1);
            if (game.player2.socket)
                game.player2.socket.emit('stopSearchLoop', game.id_searchinterval2);
            game.id_searchinterval1 = 0;
            game.id_searchinterval2 = 0;
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
            this.startGame(game, x);
        }
        else {
            game = this.creatNewGameRandom(client);
            client.emit('drawName', LEFTSIDE);
        }
    }
    varSearchLoop(client, id) {
        var game = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
        if (game) {
            if (game.player1.socket === client)
                game.id_searchinterval1 = id;
            else
                game.id_searchinterval2 = id;
        }
    }
    varSearchLoopRandom(client, id) {
        var game = this.allRandomGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
        if (game) {
            if (game.player1.socket === client)
                game.id_searchinterval1 = id;
            else
                game.id_searchinterval2 = id;
        }
    }
    stopgame(client) {
        var game = this.allGames.find(game => (game.player1.socket === client || (game.player2 && game.player2.socket === client)));
        if (game) {
            clearInterval(game.id_interval);
            if (game.player1)
                this.init(game.player1.socket);
            if (game.player2)
                this.init(game.player2.socket);
            this.deleteGame(game);
        }
    }
    addNewUser(client) {
        var user = {
            id: client.id
        };
        this.connectedUsers.push(user);
    }
    async startGame(game, mapid) {
        if (mapid === 0) {
            game.id_interval = setInterval(() => {
                this.pongService.loopGameNormal(game);
            }, 1000 / 60);
        }
        else if (mapid === 1) {
            game.id_interval = setInterval(() => {
                this.pongService.loopGameMap1(game);
            }, 1000 / 60);
        }
    }
    searchGameAwaiting() {
        return this.allGames.find(game => (game.player1 != undefined && game.player2 != undefined) ? false : true);
    }
    searchGameAwaitingRandom() {
        return this.allRandomGames.find(game => (game == undefined || (game.player1 != undefined && game.player2 != undefined)) ? false : true);
    }
    creatNewGame(client) {
        var game = this.pongService.initState();
        game = {
            id: client.id,
            player1: {
                socket: client,
                paddle: game.player1.paddle,
                points: game.player1.points,
            },
            player2: undefined,
            ball: game.ball
        };
        this.allGames.push(game);
        return game;
    }
    creatNewGameRandom(client) {
        var game = this.pongService.initState();
        game = {
            id: client.id,
            player1: {
                socket: client,
                paddle: game.player1.paddle,
                points: game.player1.points,
            },
            player2: undefined,
            ball: game.ball
        };
        this.allRandomGames.push(game);
        return game;
    }
    joinGame(client, game) {
        game.player2 = {
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
        };
    }
    deleteGame(g) {
        var newAllGames = this.allGames.filter(game => game != g);
        this.allGames = newAllGames;
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], PongGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('init'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "init", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('keydownZ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "keydownZ", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('keydownW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "keydownW", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('keydownS'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "keydownS", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('keyupZ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "keyupZ", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('keyupW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "keyupW", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('keyupS'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "keyupS", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], PongGateway.prototype, "newGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('newGameRandom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], PongGateway.prototype, "newGameRandom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('id_interval'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "varSearchLoop", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('id_intervalRandom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "varSearchLoopRandom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("stopGame"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "stopgame", null);
PongGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8181, {
        cors: {
            origin: "*"
        }
    }),
    __metadata("design:paramtypes", [pong_service_1.PongService])
], PongGateway);
exports.PongGateway = PongGateway;
//# sourceMappingURL=pong.gateway.js.map