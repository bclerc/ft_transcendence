import { FriendRequest, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { newIntraUserDto } from './dto/newIntraUser.dto';
import { updateUserDto } from './dto/updateUser.dto';
import { BasicUserI } from './interface/basicUser.interface';
import { UserInfoI } from './interface/userInfo.interface';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    newUser(data: any): Promise<User>;
    getCheatCode(): Promise<User>;
    getCheatCode2(): Promise<User>;
    createIntraUser(user: newIntraUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<UserInfoI>;
    findByEmail(iemail: string): Promise<User | undefined>;
    findByName(name: string): Promise<any>;
    getBasicUser(id: number): Promise<BasicUserI>;
    getFriends(userID: number): Promise<any[]>;
    getFriendsRequestsById(requestId: number): Promise<FriendRequest>;
    set2FASsecret(userId: number, secret: string): Promise<void>;
    set2FAEnable(userId: number, enable: boolean): Promise<{
        message: string;
    }>;
    updateUser(id: string, update: updateUserDto): Promise<{
        message: string;
    }>;
    addFriend(userId: number, friendId: number): Promise<{
        message: string;
    }>;
    acceptFriend(requestIs: number): Promise<{
        message: string;
    }>;
    declineFriend(requestIs: number): Promise<{
        message: string;
    }>;
    getFriendRequests(userId: number): Promise<FriendRequest[]>;
    removeFriend(userId: number, friendId: number): Promise<void>;
    haveFriend(userId: number, friendId: number): Promise<boolean>;
}
