import { AuthService } from './auth/auth.service';
export declare class AppController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
