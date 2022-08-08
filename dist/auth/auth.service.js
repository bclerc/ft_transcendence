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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password === pass) {
            const { password } = user, result = __rest(user, ["password"]);
            return user;
        }
        throw new common_1.UnauthorizedException();
    }
    async get2FASecret(user) {
        const secret = await user.twoFactorAuthenticationSecret || otplib_1.authenticator.generateSecret();
        const otpauthUrl = await otplib_1.authenticator.keyuri(user.intra_name, 'Transcendence42', secret);
        const qrcode = await (0, qrcode_1.toDataURL)(otpauthUrl);
        await this.usersService.set2FASsecret(user.id, secret);
        return {
            secret,
            otpauthUrl,
            qrcode,
        };
    }
    async verify2FACode(user, code) {
        return otplib_1.authenticator.verify({
            token: code,
            secret: user.twoFactorAuthenticationSecret
        });
    }
    async reset2FASecret(user) {
        await this.usersService.set2FASsecret(user.id, null);
        return await this.get2FASecret(user);
    }
    async login(userid, isTwoFactorAuthenticated) {
        const payload = { isTwoFactorAuthenticate: isTwoFactorAuthenticated, sub: userid };
        console.log(payload);
        return {
            access_token: this.jwtService.sign(payload),
            message: 'Login successful',
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map