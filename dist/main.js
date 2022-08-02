"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const passport = require("passport");
const http_exception_filter_1 = require("./user/filter/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.use(session({
        secret: process.env.SESSION_SALT,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: Number.parseInt(process.env.COOKIE_MAX_AGE),
            httpOnly: false,
            sameSite: 'strict',
            secure: false,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map