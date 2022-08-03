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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const local_auth_guard_1 = require("./auth/guards/local-auth.guard");
const auth_service_1 = require("./auth/auth.service");
const FortyTwo_guard_1 = require("./auth/guards/FortyTwo.guard");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const user_service_1 = require("./user/user.service");
const jwt2fa_guard_1 = require("./auth/guards/jwt2fa.guard");
let AppController = class AppController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async lol(req) {
        return (req.user);
    }
    async login(req) {
        return this.authService.login(req.user.id, false);
    }
    async login42() { }
    async callback(req) {
        return this.authService.login(req.user.id, false);
    }
    async authenticate(request, body) {
        const isCodeValid = this.authService.verify2FACode(request.user, body.twoFactorAuthenticationCode);
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        return this.authService.login(request.user, true);
    }
    async generate2FACode(req) {
        const user = req.user;
        this.authService.generate2FASecret(user);
        this.userService.set2FAEnable(user.id);
    }
    async enable2FA(req, data) {
        if (this.authService.verify2FACode(req.user, data.code)) {
            const user = req.user;
            this.userService.set2FAEnable(user.id);
            return;
        }
        throw new common_1.HttpException('Invalid 2FA code', 401);
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.UseGuards)(jwt2fa_guard_1.Jwt2faAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "lol", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('auth/42'),
    (0, common_1.UseGuards)(FortyTwo_guard_1.FortyTwoGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login42", null);
__decorate([
    (0, common_1.Get)('auth/42/callback'),
    (0, common_1.UseGuards)(FortyTwo_guard_1.FortyTwoGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "callback", null);
__decorate([
    (0, common_1.Post)('auth/2fa'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "authenticate", null);
__decorate([
    (0, common_1.Get)('auth/test'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "generate2FACode", null);
__decorate([
    (0, common_1.Post)('auth/enable'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "enable2FA", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map