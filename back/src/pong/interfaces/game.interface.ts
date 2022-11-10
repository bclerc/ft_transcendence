import { BallI } from "./ball.interface";
import { PlayerI } from "./player.interface";
import { PointI } from "./point.interface";
import { UserI } from "./user.interface";

export interface GameI {
	id?: string;			//id de la partie actuelle
	player1?: PlayerI; 		//info du playeur 1
	player2?: PlayerI;		//info du playeur 2
	ball?: BallI;			//info de la balle

	obstacle:PointI;
	
	// acceleration?: number;	//option de partie
	// direction?: PointI;		//option de partie
	key_handler1?: number;
	key_handler2?: number;
	
	mapId?: number;

	spectators?: UserI[]; //tableau des utilisateurs qui regardent le match

	id_interval?: NodeJS.Timer; //id pour arreter la loop du game
	id_searchinterval1?: number; //id pour arreter la loop du game pour le player 1
	id_searchinterval2?: number; //id pour arreter la loop du game pour le player 2
	type?: number;			//type de la partie; normal/random 
}