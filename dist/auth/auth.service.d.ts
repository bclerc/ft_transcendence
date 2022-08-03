import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    generate2FASecret(user: User): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    verify2FACode(user: User, code: string): Promise<Boolean>;
    login(userid: number, isTwoFactorAuthenticated: boolean): Promise<{
        access_token: {
            access_token: string;
            message: string;
        };
    }>;
}
