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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const common_2 = require("@nestjs/common");
const newUser_dto_1 = require("./dto/newUser.dto");
const jwt2fa_guard_1 = require("../auth/guards/jwt2fa.guard");
const updateUser_dto_1 = require("./dto/updateUser.dto");
const friendRequest_dto_1 = require("./dto/friendRequest.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async findAll() {
        return this.userService.findAll();
    }
    async getLoggedUser(req) {
        return await this.userService.findOne(req.user.id);
    }
    async findOne(req, id) {
        return this.userService.getBasicUser(id);
    }
    async findUserByName(name) {
        return await this.userService.findByName(name);
    }
    async newUser(data) {
        return await this.userService.newUser(data);
    }
    async updateUser(req, data) {
        return await this.userService.updateUser(req.user.id, data);
    }
    async getFriends(req) {
        return await this.userService.getFriends(req.user.id);
    }
    async getFriendsPanding(req) {
        console.log(req.user.id);
        return await this.userService.getFriendRequests(req.user.id);
    }
    async acceptFriend(req, id) {
        const request = await this.userService.getFriendsRequestsById(id);
        if (request) {
            if (request.toId == req.user.id) {
                await this.userService.acceptFriend(id);
                return { message: "Friend request accepted", state: 'success' };
            }
            else
                return { message: "You are not the receiver of this friend request" };
        }
    }
    async declineFriend(req, id) {
        this.userService.declineFriend(id);
    }
    async requestFriend(req, id) {
        if (req.user.id == id)
            throw new common_1.ForbiddenException();
        return await this.userService.addFriend(req.user.id, id);
    }
    async newRequest(req, data) {
        console.log(data);
        if (req.user.id == data.toId)
            throw new common_1.ForbiddenException();
        if (await this.userService.haveFriend(req.user.id, data.toId))
            return { message: "You are already friends", state: 'error' };
        return await this.userService.addFriend(req.user.id, data.toId);
    }
    async removeFriend(req, id) {
        return await this.userService.removeFriend(req.user.id, id);
    }
    async getFriendsByIds(req, data) {
        const request = await this.userService.getFriendsRequestsById(data.requestId);
        if (request) {
            if (request.toId == req.user.id) {
                if (data.action == friendRequest_dto_1.FriendRequestAction.ACCEPT) {
                    await this.userService.acceptFriend(request.id);
                    return { message: "Friend request accepted", state: 'success' };
                }
                if (data.action == friendRequest_dto_1.FriendRequestAction.DECLINE) {
                    this.userService.declineFriend(request.id);
                    return { message: "Friend request declined", state: 'success' };
                }
            }
            else
                return { message: "You are not the receiver of this friend request" };
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLoggedUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('search/:name'),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserByName", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newUser_dto_1.newUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "newUser", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, updateUser_dto_1.updateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)('friends/get'),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriends", null);
__decorate([
    (0, common_1.Get)('friends/panding'),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriendsPanding", null);
__decorate([
    (0, common_1.Get)('friends/accept/:id'),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "acceptFriend", null);
__decorate([
    (0, common_1.Post)('friends/decline/:id'),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "declineFriend", null);
__decorate([
    (0, common_1.Post)('friends/request/:id'),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "requestFriend", null);
__decorate([
    (0, common_1.Post)('friends/request'),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, friendRequest_dto_1.newFriendRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "newRequest", null);
__decorate([
    (0, common_1.Get)('friends/remove/:id'),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.Post)('friends'),
    (0, common_2.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, friendRequest_dto_1.FriendRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriendsByIds", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map