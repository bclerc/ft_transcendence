import { Module } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { PenaltiesService } from 'src/chat/services/penalties/penalties.service';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [OnlineUserService, UserService, ChatService, PenaltiesService],
  exports: [OnlineUserService, ChatService],
  imports: [PrismaModule],
  controllers: [],

})
export class OnlineuserModule {}
