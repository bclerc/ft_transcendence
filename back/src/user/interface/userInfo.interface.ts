import { Game, UserState } from "@prisma/client";
import { BasicUserI } from "./basicUser.interface";

export class UserInfoI {
  id: number;
  state: UserState;
  displayname: string;
  intra_name: string;
  email: string;
  avatar_url: string;
  friends: BasicUserI[];
  position_in_leaderboard?: number;
  games: any[];
  score: number;
  _count: {
    games_win: number;
    games_lose: number;
    games: number;
  }
  blockedUsers: BasicUserI[];
  twoFactorEnabled: boolean;
}