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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async newUser(data) {
        return await this.prisma.user.create({ data });
    }
    async createIntraUser(user) {
        return await this.prisma.user.create({
            data: {
                email: user.email,
                password: '',
                intra_name: user.intra_name,
                intra_id: user.intra_id,
                avatar_url: user.avatar_url,
                displayname: user.displayname
            }
        });
    }
    async findAll() {
        const users = (await this.prisma.user.findMany());
        for (const user of users)
            delete user['password'];
        return users;
    }
    async findOne(id) {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    id: Number(id),
                },
            });
            return user;
        }
        catch (error) {
            throw new common_1.NotFoundException({ message: 'User ' + id + ' not exist' });
        }
    }
    async findByEmail(iemail) {
        return await this.prisma.user.findUnique({
            where: {
                email: String(iemail),
            },
        });
    }
    async set2FASsecret(userId, secret) {
        await this.prisma.user.update({
            where: {
                id: Number(userId),
            },
            data: {
                twoFactorAuthenticationSecret: secret,
            },
        });
    }
    async set2FAEnable(userId, enable) {
        await this.prisma.user.update({
            where: {
                id: Number(userId),
            },
            data: {
                twoFactorEnabled: enable,
            },
        });
        return {
            message: enable ? '2FA enabled' : '2FA disabled',
        };
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map