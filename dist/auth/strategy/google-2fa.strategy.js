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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFaStrategy = void 0;
const passport_2fa_totp_1 = require("passport-2fa-totp");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
const user_service_1 = require("../../user/user.service");
let TwoFaStrategy = class TwoFaStrategy extends (0, passport_1.PassportStrategy)(passport_2fa_totp_1.Strategy) {
    constructor(authService, userService, googleAuthenficator) {
        super();
        this.authService = authService;
        this.userService = userService;
        this.googleAuthenficator = googleAuthenficator;
    }
    async validate(accessToken, refreshToken, profile) {
        console.log("Logged ?");
    }
};
TwoFaStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService, typeof (_a = typeof passport_2fa_totp_1.GoogleAuthenticator !== "undefined" && passport_2fa_totp_1.GoogleAuthenticator) === "function" ? _a : Object])
], TwoFaStrategy);
exports.TwoFaStrategy = TwoFaStrategy;
//# sourceMappingURL=google-2fa.strategy.js.map