export interface UserI {
    id?: string;
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