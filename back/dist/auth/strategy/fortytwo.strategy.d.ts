import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private readonly authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
