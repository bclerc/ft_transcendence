import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
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
import { ChatGateway } from './chat/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { MessageService } from './message/message.service';
import { WschatService } from './wschat/wschat.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { HttpModule } from '@nestjs/axios';
import { PongModule } from './pong/pong.module';
import { OnlineUserService } from './onlineusers/onlineuser.service';
import { OnlineuserModule } from './onlineusers/onlineuser.module';
import { FriendsService } from './friends/friends.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { GameModule } from './game/game.module';


@Module({
  imports: [
    AuthModule,
     UserModule,
     PrismaModule,
     ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
     }),
     EventEmitterModule.forRoot(),
     HttpModule,
     PongModule,
     ChatModule,
     JwtModule,
     OnlineuserModule,
     CloudinaryModule,
     GameModule
    ],
  controllers: [
    AuthController,
    UserController
  ],
  providers: [
    AppService,
    UserService,
    PrismaService, 
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
     ChatGateway,
     ChatService,
     MessageService,
     WschatService,
     FriendsService
    ],
})
export class AppModule { }
