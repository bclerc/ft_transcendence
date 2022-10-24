import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/jwtpayload.interface';
import { UserInfoI } from 'src/user/interface/userInfo.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<UserInfoI>;
}
export {};
