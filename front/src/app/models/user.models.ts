import { Component, Input } from "@angular/core";

export interface UserI {
    id? :               number;
    state?:             string;
    email? :            string;
    intra_name? :       string;
    avatar_url? :        string;
    intra_id? :         number;
    displayname? :      string;
    description? :      string;
    //password? :         string;
    username? :         string;
    staff? :            boolean;
    createdAt? :        Date;
    twoFactorEnabled? : boolean;
    friendOf? : UserI[];

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
    //password? :         string;
    username! :         string;
    elo? :              number;
    staff? :            boolean;
    Createdat? :        Date;
    
    
    constructor(ida: number, usernamea: string, avatarUrla: string) {
        this.id = ida;
        this.username = usernamea;
        this.avatarURL = avatarUrla;
    }
  }