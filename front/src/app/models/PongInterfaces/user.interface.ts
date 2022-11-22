export interface UserI {
    id?: string;
    intra_name?: string;
    displayname?: string;    
    username?: string;
    password?: string;
    email?: string;
    ban?: boolean;
    avatar_url?: string;
    level?: number;
    school42id?: number;
  twoFactorAuthEnabled?: boolean;
  twoFactorAuthenticationSecret?: string;
}