import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    newUser(data: any): Promise<User>;
    newUserIntra(email: string, usernames: string): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(iemail: string): Promise<User | undefined>;
}
