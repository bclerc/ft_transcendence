/// <reference types="node" />
import { BallI } from "./ball.interface";
import { PlayerI } from "./player.interface";
import { UserI } from "./user.interface";
export interface GameI {
    id?: string;
    player1?: PlayerI;
    player2?: PlayerI;
    ball?: BallI;
    key_handler1?: number;
    key_handler2?: number;
    spectators?: UserI[];
    id_interval?: NodeJS.Timer;
    id_searchinterval1?: number;
    id_searchinterval2?: number;
    type?: number;
}
