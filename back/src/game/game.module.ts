import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [GameController],
  imports: [PrismaModule],
  providers: [GameService]

})
export class GameModule {}
