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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const constants_1 = require("../auth/constants");
const user_service_1 = require("../user/user.service");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(userService, jwtService, chatService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.chatService = chatService;
        this.logger = new common_1.Logger('ChatGateway');
        this.onlineUsers = new Map();
    }
    async handleConnection(socket) {
        try {
            const token = socket.handshake.query['token'];
            const res = this.jwtService.verify(token, {
                ignoreExpiration: false,
                secret: constants_1.jwtConstants.secret,
            });
            const user = await this.userService.findOne(res.sub);
            if (!user)
                return socket.disconnect();
            this.onlineUsers.set(socket.id, user);
            socket.data.user = user;
            const rooms = await this.chatService.getRoomsFromUser(user.id);
            console.log("");
            return this.server.to(socket.id).emit('rooms', rooms);
        }
        catch (error) {
            socket.disconnect(true);
        }
    }
    async handleDisconnect(socket) {
        this.onlineUsers.delete(socket.id);
        socket.disconnect();
    }
    async handleMessage(client, payload, message) {
        console.log('Message received: ' + message);
        const user = await this.onlineUsers.get(client.id);
        this.server.emit('message', user.intra_name + ': ' + message);
    }
    async onCreateRoom(client, payload, newRoom) {
        const user = await this.onlineUsers.get(client.id);
        const room = await this.chatService.createRoom(user, newRoom);
        for (const user of this.onlineUsers) {
            if (newRoom.users.find((u) => (u.id === user[1].id) || (user[1].id === room.ownerId))) {
                this.server.to(user[0].toString()).emit('rooms', room);
                console.log('emitted to ' + user[1].intra_name + ' ' + room);
            }
        }
    }
    async onJoinRoom(client, payload, room) {
        const messages = await this.chatService.getMessagesFromRoom(room);
        this.server.to(client.id).emit('messages', messages);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(2, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(2, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onCreateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(2, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onJoinRoom", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(81, { cors: { origin: '*' } }),
    __param(0, (0, common_1.Inject)(user_service_1.UserService)),
    __param(1, (0, common_1.Inject)(jwt_1.JwtService)),
    __param(2, (0, common_1.Inject)(chat_service_1.ChatService)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        chat_service_1.ChatService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map