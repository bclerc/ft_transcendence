import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
export declare class AppController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    lol(req: any): Promise<any>;
}
