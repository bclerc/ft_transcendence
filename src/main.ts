import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
  app.use(session({
	secret: process.env.SESSION_SALT,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7,
		httpOnly: false,
		sameSite: 'strict',
		secure:  false,
	},
}));

	app.use(passport.initialize());
  	app.use(passport.session())

  await app.listen(3000);
}
bootstrap();
