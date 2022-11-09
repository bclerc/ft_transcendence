import { Socket } from "socket.io";

export interface UserI {
    id?: string;
    socket?: Socket,
    username?: string;
    password?: string;
    email?: string;
	ban?: boolean;
    avatar?: string;
    level?: number;
	school42id?: number;
	twoFactorAuthEnabled?: boolean;
	twoFactorAuthenticationSecret?: string;
}