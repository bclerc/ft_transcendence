import { Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
declare const Jwt2faStrategy_base: new (...args: any[]) => Strategy;
export declare class Jwt2faStrategy extends Jwt2faStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(payload: any): Promise<import(".prisma/client").User>;
}
export {};
