export interface UserI {
    id?: string;
    intra_name?: string;
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