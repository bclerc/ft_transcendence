
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { HttpExceptionFilter } from './user/filter/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();


  app.setGlobalPrefix('api/v1')
  app.use(session({
    secret: config.get('SESSION_SALT'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: config.get<Number>('SESSION_MAX_AGE'),
      httpOnly: false,
      sameSite: 'strict',
      secure: false,
    },
  }));

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  })

  app.useGlobalFilters(new HttpExceptionFilter())
  app.use(passport.initialize());
  app.use(passport.session())

  await app.listen(3000);
}

bootstrap();
