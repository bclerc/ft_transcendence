import { UserState } from "@prisma/client";


export class BasicUserI {
    id: number;
    state: UserState
    displayname: string;
    intra_name: string;
    email: string;
    avatar_url: string;
    score?: number;
    position_in_leaderboard?: number;
    _count?: {
      games_win: number;
      games_lose: number;
      games: number;
    }
    inRoomId?: number;
    inGameId?: number; 
}

export interface  GameUser {
  id: number;
  displayname: string;
  avatar_url: string;
  rank?: number;
}