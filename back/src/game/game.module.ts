import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [GameController],
  imports: [PrismaModule, UserModule],
  providers: [GameService]

})
export class GameModule {}
