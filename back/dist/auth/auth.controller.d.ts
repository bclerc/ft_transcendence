import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    login(body: any): Promise<import("./interfaces/jwttoken.interface").JwtNewToken>;
    getmarcus(res: any): Promise<void>;
    login42(): Promise<void>;
    callback(req: any, res: any): Promise<import("./interfaces/jwttoken.interface").JwtNewToken>;
    authenticate(request: any, body: any): Promise<import("./interfaces/jwttoken.interface").JwtNewToken>;
    generate2FACode(req: any): Promise<import("./interfaces/2fasecret.interface").IDoubleAuthenticationSecret>;
    reset2FASecret(req: any, res: any): Promise<void>;
    disable2FA(req: any): Promise<{
        message: string;
    }>;
    enable2FA(req: any, data: any): Promise<{
        message: string;
    }>;
}
