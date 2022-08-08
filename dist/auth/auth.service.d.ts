import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { JwtNewToken } from './interfaces/jwttoken.interface';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    get2FASecret(user: User): Promise<{
        secret: string;
        otpauthUrl: string;
        qrcode: any;
    }>;
    verify2FACode(user: User, code: string): Promise<Boolean>;
    reset2FASecret(user: User): Promise<{
        secret: string;
        otpauthUrl: string;
        qrcode: any;
    }>;
    login(userid: number, isTwoFactorAuthenticated: boolean): Promise<JwtNewToken>;
}
