import { UserState } from "@prisma/client";
import { BasicUserI } from "./basicUser.interface";
export declare class UserInfoI {
    id: number;
    state: UserState;
    intra_name: string;
    email: string;
    avatar_url: string;
    friends: BasicUserI[];
    twoFactorEnabled: boolean;
}
