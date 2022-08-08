export class JwtPayload {
    sub: string;
    isTwoFactorAuthenticate: boolean;
    iat?: number;
    exp?: number;
}