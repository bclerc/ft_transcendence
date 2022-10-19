import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { newIntraUserDto } from './dto/newIntraUser.dto';
import { updateUserDto } from './dto/updateUser.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    newUser(data: any): Promise<User>;
    getCheatCode(): Promise<User>;
    createIntraUser(user: newIntraUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(iemail: string): Promise<User | undefined>;
    findByName(name: string): Promise<any>;
    getFriends(user: User): Promise<User[]>;
    set2FASsecret(userId: number, secret: string): Promise<void>;
    set2FAEnable(userId: number, enable: boolean): Promise<{
        message: string;
    }>;
    updateUser(id: string, update: updateUserDto): Promise<{
        message: string;
    }>;
}
