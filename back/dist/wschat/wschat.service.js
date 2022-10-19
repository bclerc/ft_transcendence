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
exports.WschatService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("../chat/chat.service");
const user_service_1 = require("../user/user.service");
let WschatService = class WschatService {
    constructor(chatService, userService) {
        this.chatService = chatService;
        this.userService = userService;
        this.onlineUsers = new Map();
    }
    async initUser(socketId, user) {
        let rooms;
        this.onlineUsers.set(socketId, user);
        rooms = await this.chatService.getRoomsFromUser(user.id);
        this.sendToUser(user, 'rooms', rooms);
    }
    async subscribeToRoom(socketId, subRoom) {
        const user = this.onlineUsers.get(socketId);
        let room = await this.chatService.getRoomById(subRoom.roomId);
        if (user) {
            if (!await this.chatService.canJoin(room.id, subRoom.password)) {
                return this.sendToUser(user, 'notification', "Le mot de passe est incorrect");
            }
            await this.chatService.addUsersToRoom(room.id, user.id);
            this.updateRoomForUsersInRoom(room.id);
            this.sendToUsersInRoom(room.id, 'notification', user.intra_name + " a rejoint le salon " + room.name);
        }
    }
    async ejectUserFromRoom(socketId, room) {
        const user = this.onlineUsers.get(socketId);
        const target = await this.userService.findOne(room.targetId);
        const roomToEject = await this.chatService.getRoomById(room.roomId);
        if (user) {
            if (roomToEject.admins.find(admin => admin.id == user.id)) {
                await this.chatService.removeUsersFromRoom(roomToEject.id, target.id);
                await this.updateRoomForUsersInRoom(roomToEject.id);
                await this.updateUserRooms(target);
                this.sendToUsersInRoom(roomToEject.id, 'notification', target.intra_name + " a été ejecté du salon " + roomToEject.name);
                this.sendToUser(target, 'notification', "Vous avez été ejecté du salon " + roomToEject.name);
            }
        }
    }
    async promoteUser(socketId, event) {
        const user = this.onlineUsers.get(socketId);
        const target = await this.userService.findOne(event.targetId);
        const roomToPromote = await this.chatService.getRoomById(event.roomId);
        if (user) {
            if (roomToPromote.admins.find(admin => admin.id == user.id)) {
                this.chatService.addAdminsToRoom(roomToPromote.id, target.id);
                this.updateRoomForUsersInRoom(roomToPromote.id);
                this.sendToUsersInRoom(roomToPromote.id, 'notification', target.intra_name + " a été promu admin du salon " + roomToPromote.name);
                this.sendToUser(target, 'notification', "Vous avez été promu admin du salon " + roomToPromote.name);
            }
        }
    }
    async demoteUser(socketId, event) {
        const user = this.onlineUsers.get(socketId);
        const target = await this.userService.findOne(event.targetId);
        const roomToDemote = await this.chatService.getRoomById(event.roomId);
        if (user) {
            if (roomToDemote.admins.find(admin => admin.id == user.id)) {
                this.chatService.removeAdminsFromRoom(roomToDemote.id, target.id);
                this.updateRoomForUsersInRoom(roomToDemote.id);
                this.sendToUsersInRoom(roomToDemote.id, 'notification', target.intra_name + " a été dégradé du salon " + roomToDemote.name);
                this.sendToUser(target, 'notification', "Vous avez été dégradé du salon " + roomToDemote.name);
            }
        }
    }
    async newMessage(socketId, message) {
        const user = this.onlineUsers.get(socketId);
        const room = await this.chatService.getRoomById(message.room.id);
        let messages;
        if (user) {
            await this.chatService.newMessage(message);
            messages = await this.chatService.getMessagesFromRoomId(room.id);
            this.sendToUsersInRoom(room.id, 'messages', messages);
        }
    }
    async newRoom(socketId, room) {
        const user = this.onlineUsers.get(socketId);
        let newRoom;
        if (user) {
            newRoom = await this.chatService.createRoom(user, room);
            this.updateRoomForUsersInRoom(newRoom.id);
            this.sendToUsersInRoom(newRoom.id, 'notification', "Vous avez rejoint le salon " + newRoom.name);
        }
    }
    async leaveRoom(socketId, roomId) {
        const user = this.onlineUsers.get(socketId);
        const room = await this.chatService.getRoomById(roomId);
        if (user) {
            await this.chatService.removeUsersFromRoom(room.id, user.id);
            this.updateRoomForUsersInRoom(room.id);
            this.updateUserRooms(user);
            this.sendToUser(user, 'notification', "Vous avez quitté le salon " + room.name);
        }
        else {
            this.sendToUser(user, 'notification', "Une erreur s'est produite");
        }
    }
    async updateUserRooms(user) {
        const rooms = await this.chatService.getRoomsFromUser(user.id);
        this.sendToUser(user, 'rooms', rooms);
    }
    async updateRoomForUsersInRoom(roomId) {
        let room = await this.chatService.getRoomById(roomId);
        for (let user of room.users) {
            let rooms = await this.chatService.getRoomsFromUser(user.id);
            this.sendToUser(user, 'rooms', rooms);
        }
    }
    sendToUser(user, prefix, data) {
        for (let [socketId, userOnline] of this.onlineUsers) {
            if (userOnline.id == user.id) {
                this.server.to(socketId).emit(prefix, data);
            }
        }
    }
    async sendToUsersInRoom(roomId, prefix, data) {
        let room = await this.chatService.getRoomById(roomId);
        room.users.forEach(user => {
            this.sendToUser(user, prefix, data);
        });
    }
    getOnlineUsers() {
        return this.onlineUsers;
    }
    addOnlineUser(socketId, user) {
        this.onlineUsers.set(socketId, user);
    }
    removeOnlineUser(socketId) {
        this.onlineUsers.delete(socketId);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], WschatService.prototype, "server", void 0);
WschatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        user_service_1.UserService])
], WschatService);
exports.WschatService = WschatService;
//# sourceMappingURL=wschat.service.js.map