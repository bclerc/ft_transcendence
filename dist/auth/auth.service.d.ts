import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: User): Promise<{
        access_token: {
            access_token: string;
            message: string;
        };
    }>;
}
