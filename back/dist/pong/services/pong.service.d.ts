import { PlayerI } from '../interfaces/player.interface';
import { GameI } from '../interfaces/game.interface';
export declare class PongService {
    loopGame(game: GameI): void;
    private colision;
    private reinitBall;
    reinitPlayers(player1: PlayerI, player2: PlayerI): void;
    private rebond;
    initState(): GameI;
}
