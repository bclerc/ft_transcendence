import { JwtService } from '@nestjs/jwt';
import { IntraUser } from 'src/user/interface/intraUser.interface';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: IntraUser): Promise<{
        access_token: string;
    }>;
}
