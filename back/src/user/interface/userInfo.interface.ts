import { UserState } from "@prisma/client";
import { BasicUserI } from "./basicUser.interface";

export class UserInfoI {
    id: number;
    state: UserState;
    displayname: string;
    intra_name: string;
    email: string;
    avatar_url: string;
    friends: BasicUserI[];
    blockedUsers: BasicUserI[];
    twoFactorEnabled: boolean;
}