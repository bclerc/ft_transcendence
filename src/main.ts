import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { HttpExceptionFilter } from './user/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
  app.use(session({
	secret: process.env.SESSION_SALT,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: Number.parseInt(process.env.COOKIE_MAX_AGE),
		httpOnly: false,
		sameSite: 'strict',
		secure:  false,
	},
}));
  app.useGlobalFilters(new HttpExceptionFilter())
	app.use(passport.initialize());
  app.use(passport.session())



  
  await app.listen(3000);
}
bootstrap();
