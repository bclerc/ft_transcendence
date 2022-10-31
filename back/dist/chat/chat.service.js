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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async newMessage(message) {
        const newMessage = await this.prisma.message.create({
            data: {
                content: message.content,
                user: {
                    connect: {
                        id: message.user.id,
                    },
                },
                room: {
                    connect: {
                        id: message.room.id,
                    },
                },
            },
            include: {
                user: true,
            },
        });
    }
    async getRoomsFromUser(userId) {
        const rooms = await this.prisma.chatRoom.findMany({
            where: {
                users: {
                    some: {
                        id: userId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                users: {
                    select: {
                        id: true,
                        state: true,
                        intra_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
                admins: {
                    select: {
                        id: true,
                        state: true,
                        intra_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
                ownerId: true,
                public: true,
                description: true,
                messages: true,
            },
        });
        return rooms;
    }
    async getPublicRooms() {
        const rooms = await this.prisma.chatRoom.findMany({
            where: {
                public: true,
            },
            include: {
                users: true,
            }
        });
        return rooms;
    }
    async getMessagesFromRoom(room) {
        const messages = await this.prisma.message.findMany({
            where: {
                room: {
                    id: room.id,
                },
            },
            include: {
                user: true,
            },
        });
        return messages;
    }
    async getMessagesFromRoomId(roomId) {
        const messages = await this.prisma.message.findMany({
            where: {
                room: {
                    id: roomId,
                },
            },
            include: {
                user: true,
            },
        });
        return messages;
    }
    async createRoom(owner, newRoom) {
        const ret = this.prisma.chatRoom.create({
            data: {
                name: newRoom.name || owner.intra_name + '\'s room',
                description: newRoom.description || 'Another room created by ' + owner.intra_name,
                ownerId: owner.id,
                public: newRoom.public,
                password: newRoom.password || null,
                admins: {
                    connect: {
                        id: owner.id,
                    },
                },
                users: {
                    connect: newRoom.users.map((user) => {
                        return {
                            id: user.id
                        };
                    })
                        .concat({
                        id: owner.id
                    })
                }
            }
        });
        return ret;
    }
    async getRoomById(roomId) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId,
            },
            select: {
                id: true,
                name: true,
                admins: true,
                ownerId: true,
                public: true,
                description: true,
                users: true,
                messages: true,
            },
        });
        return room;
    }
    async canJoin(roomId, password) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId,
            },
            select: {
                password: true,
                public: true,
            },
        });
        if (!room)
            return false;
        if (!room.password && room.public)
            return true;
        return room.password === password;
    }
    async addUsersToRoom(roomId, userId) {
        const newRoom = this.prisma.chatRoom.update({
            where: {
                id: Number(roomId)
            },
            data: {
                users: {
                    connect: {
                        id: userId,
                    }
                }
            }
        });
        return newRoom;
    }
    async addAdminsToRoom(roomId, userId) {
        const newRoom = this.prisma.chatRoom.update({
            where: {
                id: Number(roomId)
            },
            data: {
                admins: {
                    connect: {
                        id: userId,
                    }
                }
            }
        });
        return newRoom;
    }
    async removeAdminsFromRoom(roomId, userId) {
        const newRoom = this.prisma.chatRoom.update({
            where: {
                id: Number(roomId)
            },
            data: {
                admins: {
                    disconnect: {
                        id: userId,
                    }
                }
            }
        });
        return newRoom;
    }
    async removeUsersFromRoom(roomId, userId) {
        const newRoom = this.prisma.chatRoom.update({
            where: {
                id: Number(roomId)
            },
            data: {
                users: {
                    disconnect: {
                        id: userId,
                    }
                }
            }
        });
        return newRoom;
    }
    async editRoom(roomId, newRoom) {
        const ret = this.prisma.chatRoom.update({
            where: {
                id: roomId,
            },
            data: {
                name: newRoom.name,
                description: newRoom.description,
                public: newRoom.public,
                password: newRoom.password,
                users: {
                    connect: newRoom.users.map((user) => {
                        return {
                            id: user.id
                        };
                    })
                }
            },
        });
        return ret;
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map