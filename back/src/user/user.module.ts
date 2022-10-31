import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatModule } from 'src/chat/chat.module';
import { PenaltiesService } from 'src/chat/services/penalties/penalties.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { FriendsService } from 'src/friends/friends.service';
import { OnlineuserModule } from 'src/onlineusers/onlineuser.module';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserController, UserService, JwtService, FriendsService],
  exports: [UserService],
  imports: [PrismaModule, OnlineuserModule, CloudinaryModule],
  controllers: [UserController],
})
export class UserModule {}
