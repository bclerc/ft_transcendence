import { Module } from '@nestjs/common';
import { PongGateway } from './pong.gateway';
import { PongService } from './services/pong.service';

@Module({
  controllers: [],
  providers: [PongService, PongGateway]
})
export class PongModule {}
