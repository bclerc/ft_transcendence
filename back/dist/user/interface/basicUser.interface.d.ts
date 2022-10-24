import { UserState } from "@prisma/client";
export declare class BasicUserI {
    id: number;
    state: UserState;
    intra_name: string;
    email: string;
    avatar_url: string;
}
