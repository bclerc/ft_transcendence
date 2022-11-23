export interface UserI {
    id? :               number;
    state?:             string;
    email? :            string;
    intra_name? :       string;
    avatar_url? :       string;
    intra_id? :         number;
    displayname? :      string;
    description? :      string;
    username? :         string;
    staff? :            boolean;
    createdAt? :        Date;
    twoFactorEnabled? : boolean;
    friendOf? :         UserI[];
    friends? :          UserI[];
    position_in_leaderboard?: number;
    blockedBy? :        UserI[];
    blockedUsers?:      UserI[];
    score?:              number;
    _count?: {
       games_win: number,
       games_lose: number,
       games: number 
      };
    games?:             any[];
}

export class User {
    

/*  info recuperer via la requete get du back
{
    "id": 1,
    "email": "norminet@student.42.fr",
    "intra_name": "Norminet",
    "avatar_url": "https://cdn.intra.42.fr/users/norminet.jpg",
    "intra_id": 1,
    "displayname": "Norminet",
    "description": null,
    "elo": 12,
    "staff": true,
    "createdAt": "2022-08-02T18:31:06.050Z"
}*/

    id! :               number;
    state?:            string; 
    email? :            string;
    intra_name? :       string;
    avatarURL! :        string;
    intra_id? :         number; 
    username! :         string;
    elo? :              number;
    staff? :            boolean;
    Createdat? :        Date;
    blockedUsers?:      UserI[]; 
    
    
    constructor(ida: number, usernamea: string, avatarUrla: string) {
        this.id = ida;
        this.username = usernamea;
        this.avatarURL = avatarUrla;
    }
  }