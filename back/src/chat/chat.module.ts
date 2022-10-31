import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PenaltiesService } from './services/penalties/penalties.service';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ChatController],
  imports: [PrismaModule, UserModule, ChatModule],
  exports: [PenaltiesService],
  providers: [ChatService, PrismaService, OnlineUserService, UserService, PenaltiesService]
})
export class ChatModule {}
