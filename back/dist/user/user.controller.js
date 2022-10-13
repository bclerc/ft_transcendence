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
        if (req.user.id != id && !req.user.staff)
            throw new common_1.ForbiddenException();
        return this.userService.findOne(id);
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
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map