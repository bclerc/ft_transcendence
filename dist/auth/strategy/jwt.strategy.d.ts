import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/jwtpayload.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<import(".prisma/client").User>;
}
export {};
