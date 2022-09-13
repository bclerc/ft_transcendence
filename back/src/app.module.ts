import { Module } from '@nestjs/common';
import { AuthController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './user/filter/http-exception.filter';

import { HttpModule } from '@nestjs/axios';
import { PongModule } from './pong/pong.module';


@Module({
  imports: [AuthModule, UserModule, PrismaModule, ConfigModule.forRoot(), HttpModule, PongModule],
  controllers: [AuthController, UserController],
  providers: [AppService, UserService, PrismaService, {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
  }],
})
export class AppModule {}
