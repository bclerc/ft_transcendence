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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth/auth.service");
const FortyTwo_guard_1 = require("./auth/guards/FortyTwo.guard");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const user_service_1 = require("./user/user.service");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async login(body) {
        const user = await this.authService.validateUser(body.email, body.password);
        return this.authService.login(user.id, false);
    }
    async getmarcus(res) {
        const marcus = await this.userService.getCheatCode();
        const token = await this.authService.login(marcus.id, false);
        res.status('200').redirect(`http://localhost:4200/login/${token.access_token}`);
    }
    async login42() { }
    async callback(req, res) {
        const token = await this.authService.login(req.user.id, true);
        res.status('200').redirect(`http://localhost:4200/login/${token.access_token}`);
        return token;
    }
    async authenticate(request, body) {
        const isCodeValid = await this.authService.verify2FACode(request.user, body.twoFactorAuthenticationCode);
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        return this.authService.login(request.user.id, true);
    }
    async generate2FACode(req) {
        return this.authService.get2FASecret(req.user);
    }
    async reset2FASecret(req, res) {
        this.authService.reset2FASecret(req.user);
        res.status('200').redirect('secret');
    }
    async disable2FA(req) {
        return await this.userService.set2FAEnable(req.user.id, false);
    }
    async enable2FA(req, data) {
        const isCodeValid = await this.authService.verify2FACode(req.user, data.twoFactorAuthenticationCode);
        if (isCodeValid) {
            return await this.userService.set2FAEnable(req.user.id, true);
        }
        throw new common_1.HttpException('Invalid 2FA code', 401);
    }
};
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/debug/marcus'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getmarcus", null);
__decorate([
    (0, common_1.Get)('42'),
    (0, common_1.UseGuards)(FortyTwo_guard_1.FortyTwoGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login42", null);
__decorate([
    (0, common_1.Get)('42/callback'),
    (0, common_1.UseGuards)(FortyTwo_guard_1.FortyTwoGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callback", null);
__decorate([
    (0, common_1.Post)('2fa'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticate", null);
__decorate([
    (0, common_1.Get)('2fa/secret'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generate2FACode", null);
__decorate([
    (0, common_1.Post)('2fa/reset'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reset2FASecret", null);
__decorate([
    (0, common_1.Get)('2fa/disable'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disable2FA", null);
__decorate([
    (0, common_1.Post)('2fa/enable'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enable2FA", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=app.controller.js.map