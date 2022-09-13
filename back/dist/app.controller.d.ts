import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { JwtNewToken } from './auth/interfaces/jwttoken.interface';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    login(body: any): Promise<JwtNewToken>;
    getmarcus(res: any): Promise<void>;
    login42(): Promise<void>;
    callback(req: any, res: any): Promise<JwtNewToken>;
    authenticate(request: any, body: any): Promise<JwtNewToken>;
    generate2FACode(req: any): Promise<import("./auth/interfaces/2fasecret.interface").IDoubleAuthenticationSecret>;
    reset2FASecret(req: any, res: any): Promise<void>;
    disable2FA(req: any): Promise<{
        message: string;
    }>;
    enable2FA(req: any, data: any): Promise<{
        message: string;
    }>;
}
