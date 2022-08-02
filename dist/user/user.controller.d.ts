import { UserService } from './user.service';
import { newUserDto } from './dto/newUser.dto';
import { User } from '@prisma/client';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<User[]>;
    findOne(req: any, id: any): Promise<User>;
    newUser(data: newUserDto): Promise<User>;
}
