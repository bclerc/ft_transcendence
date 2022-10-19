import { GameI } from "./game.interface";
export interface LobbyI {
    allNormalGames: GameI[];
    allRankedGame: GameI[];
}
