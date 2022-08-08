import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    login(req: any): Promise<import("./interfaces/jwttoken.interface").JwtNewToken>;
    login42(): Promise<void>;
    callback(req: any): Promise<import("./interfaces/jwttoken.interface").JwtNewToken>;
    authenticate(request: any, body: any): Promise<import("./interfaces/jwttoken.interface").JwtNewToken>;
    generate2FACode(req: any): Promise<{
        secret: string;
        otpauthUrl: string;
        qrcode: any;
    }>;
    reset2FASecret(req: any, res: any): Promise<void>;
    disable2FA(req: any): Promise<{
        message: string;
    }>;
    enable2FA(req: any, data: any): Promise<{
        message: string;
    }>;
}
