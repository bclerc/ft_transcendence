import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { GameService } from 'src/game/game.service';
import { OnlineuserModule } from 'src/onlineusers/onlineuser.module';
import { OnlineUserService } from 'src/onlineusers/onlineuser.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PongGateway } from './pong.gateway';
import { PongService } from './services/pong.service';
import { VariablePong } from './variables.pong';

@Module({
  controllers: [],
  imports: [OnlineuserModule, UserModule, PrismaModule, GameModule],
  providers: [PongService, PongGateway, GameService]
})
export class PongModule {}
