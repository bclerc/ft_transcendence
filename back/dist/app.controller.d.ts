import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly authService;
    private readonly userService;
    private readonly prismaService;
    constructor(authService: AuthService, userService: UserService, prismaService: PrismaService);
}
