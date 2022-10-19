import { UserService } from './user.service';
import { newUserDto } from './dto/newUser.dto';
import { User } from '@prisma/client';
import { updateUserDto } from './dto/updateUser.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<User[]>;
    getLoggedUser(req: any): Promise<User>;
    findOne(req: any, id: number): Promise<User>;
    findUserByName(name: string): Promise<User[]>;
    newUser(data: newUserDto): Promise<User>;
    updateUser(req: any, data: updateUserDto): Promise<{
        message: string;
    }>;
}
