import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/jwtpayload.interface';
import { UserInfoI } from 'src/user/interface/userInfo.interface';
declare const Jwt2faStrategy_base: any;
export declare class Jwt2faStrategy extends Jwt2faStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(payload: JwtPayload): Promise<UserInfoI>;
}
export {};
