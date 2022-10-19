"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const user_service_1 = require("./user/user.service");
const prisma_service_1 = require("./prisma/prisma.service");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const prisma_module_1 = require("./prisma/prisma.module");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const http_exception_filter_1 = require("./user/filter/http-exception.filter");
const chat_gateway_1 = require("./chat/chat.gateway");
const jwt_1 = require("@nestjs/jwt");
const chat_module_1 = require("./chat/chat.module");
const chat_service_1 = require("./chat/chat.service");
const message_service_1 = require("./message/message.service");
const wschat_service_1 = require("./wschat/wschat.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule, auth_module_1.AuthModule, user_module_1.UserModule, prisma_module_1.PrismaModule, config_1.ConfigModule.forRoot(), chat_module_1.ChatModule],
        providers: [app_service_1.AppService, user_service_1.UserService, prisma_service_1.PrismaService, {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            }, chat_gateway_1.ChatGateway, chat_service_1.ChatService, message_service_1.MessageService, wschat_service_1.WschatService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map