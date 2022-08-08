import { GoogleAuthenticator } from 'passport-2fa-totp';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
declare const TwoFaStrategy_base: new (...args: any[]) => any;
export declare class TwoFaStrategy extends TwoFaStrategy_base {
    private readonly authService;
    private userService;
    private googleAuthenficator;
    constructor(authService: AuthService, userService: UserService, googleAuthenficator: GoogleAuthenticator);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
