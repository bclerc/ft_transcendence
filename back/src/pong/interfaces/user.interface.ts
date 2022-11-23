import { Socket } from "socket.io";

export interface UserI {
    id?: string;
    socket?: Socket,
    email?: string;
	  ban?: boolean;
    avatar?: string;
    level?: number;
	twoFactorAuthEnabled?: boolean;
	twoFactorAuthenticationSecret?: string;
}