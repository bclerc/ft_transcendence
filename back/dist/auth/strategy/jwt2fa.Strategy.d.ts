import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/jwtpayload.interface';
import { User } from '@prisma/client';
declare const Jwt2faStrategy_base: new (...args: any[]) => Strategy;
export declare class Jwt2faStrategy extends Jwt2faStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
