import { UserState } from "@prisma/client";

export class BasicUserI {
    id: number;
    state: UserState
    displayname: string;
    intra_name: string;
    email: string;
    avatar_url: string;
    inRoomId?: number;
    inGameId?: number; 
} 