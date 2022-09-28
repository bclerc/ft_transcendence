import { PassportSerializer } from "@nestjs/passport";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";
export declare class sessionSerializer extends PassportSerializer {
    private readonly userService;
    constructor(userService: UserService);
    serializeUser(user: User, done: Function): void;
    deserializeUser(id: number, done: Function): any;
}
