import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
import { IDoubleAuthenticationSecret } from './interfaces/2fasecret.interface';
import { JwtNewToken } from './interfaces/jwttoken.interface';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<User>;
    get2FASecret(user: User): Promise<IDoubleAuthenticationSecret>;
    verify2FACode(user: User, code: string): Promise<Boolean>;
    reset2FASecret(user: User): Promise<IDoubleAuthenticationSecret>;
    login(userid: number, isTwoFactorAuthenticated: boolean): Promise<JwtNewToken>;
}
