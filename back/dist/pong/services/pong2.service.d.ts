import { Server } from 'socket.io';
import { GameI } from '../interfaces/game.interface';
export declare class PongService {
    endGame(state: GameI, server: Server): void;
    loopGame(state: GameI, server: Server): void;
    playerAutoMove(state: GameI): void;
    private colision;
    private reinitBall;
    private rebond;
    private emiteNewData;
}
