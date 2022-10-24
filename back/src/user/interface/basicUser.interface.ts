import { UserState } from "@prisma/client";

export class BasicUserI {
    id: number;
    state: UserState
    intra_name: string;
    email: string;
    avatar_url: string;
} 