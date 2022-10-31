import { UserService } from './user.service';
import { newUserDto } from './dto/newUser.dto';
import { FriendRequest, User } from '@prisma/client';
import { updateUserDto } from './dto/updateUser.dto';
import { FriendRequestDto, newFriendRequestDto } from './dto/friendRequest.dto';
import { BasicUserI } from './interface/basicUser.interface';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<User[]>;
    getLoggedUser(req: any): Promise<import("./interface/userInfo.interface").UserInfoI>;
    findOne(req: any, id: number): Promise<BasicUserI>;
    findUserByName(name: string): Promise<User[]>;
    newUser(data: newUserDto): Promise<User>;
    updateUser(req: any, data: updateUserDto): Promise<{
        message: string;
    }>;
    getFriends(req: any): Promise<User[]>;
    getFriendsPanding(req: any): Promise<FriendRequest[]>;
    acceptFriend(req: any, id: any): Promise<{
        message: string;
        state: string;
    } | {
        message: string;
        state?: undefined;
    }>;
    declineFriend(req: any, id: number): Promise<void>;
    requestFriend(req: any, id: number): Promise<{
        message: string;
    }>;
    newRequest(req: any, data: newFriendRequestDto): Promise<{
        message: string;
    } | {
        message: string;
        state: string;
    }>;
    removeFriend(req: any, id: number): Promise<void>;
    getFriendsByIds(req: any, data: FriendRequestDto): Promise<{
        message: string;
        state: string;
    } | {
        message: string;
        state?: undefined;
    }>;
}
