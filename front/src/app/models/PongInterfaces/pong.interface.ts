import { BallI } from "./ball.interface";
import { PlayerI } from "./player.interface";
import { PointI } from "./point.interface";
import { UserI } from "./user.interface";

export interface GameI {
  id?: string;			//id de la partie actuelle
  player1?: PlayerI; 		//info du playeur 1
  player2?: PlayerI;		//info du playeur 2
  ball?: BallI;		//info de la balle
  obstacle: PointI;

  spectators?: UserI[]; //tableau des utilisateurs qui regardent le match
  id_interval?: any;
  mapId?: number;			//type de la partie; normal/classé 
}

export interface GameListInfo {
  id: number;
  users: UserI[];
  state: any;
}