import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
export declare class AppController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    lol(req: any): Promise<any>;
    login(req: any): Promise<{
        access_token: {
            access_token: string;
            message: string;
        };
    }>;
    login42(): Promise<void>;
    callback(req: any): Promise<{
        access_token: {
            access_token: string;
            message: string;
        };
    }>;
    authenticate(request: any, body: any): Promise<{
        access_token: {
            access_token: string;
            message: string;
        };
    }>;
    generate2FACode(req: any): Promise<void>;
    enable2FA(req: any, data: any): Promise<void>;
}
