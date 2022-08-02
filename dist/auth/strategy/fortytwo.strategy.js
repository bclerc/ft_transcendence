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
exports.FortyTwoStrategy = void 0;
const passport_42_1 = require("passport-42");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
const user_service_1 = require("../../user/user.service");
let FortyTwoStrategy = class FortyTwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy) {
    constructor(authService, userService) {
        super({
            clientID: process.env.INTRA_CLIENT_ID,
            clientSecret: process.env.INTRA_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/v1/auth/42/callback',
        });
        this.authService = authService;
        this.userService = userService;
    }
    async validate(accessToken, refreshToken, profile) {
        console.log(profile);
        const intraUser = {
            email: profile.emails[0].value,
            intra_name: profile.username,
            intra_id: Number.parseInt(profile.id),
            avatar_url: profile.photos[0].value,
            displayname: profile.displayName,
        };
        const user = await this.userService.findByEmail(profile.emails[0].value);
        if (!user) {
            return await this.userService.createIntraUser(intraUser);
        }
        return user;
    }
};
FortyTwoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], FortyTwoStrategy);
exports.FortyTwoStrategy = FortyTwoStrategy;
//# sourceMappingURL=fortytwo.strategy.js.map