import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { IntraUser } from 'src/user/interface/intraUser.interface';
import { UserController } from 'src/user/user.controller';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: { access_token: this.jwtService.sign(payload), message: 'Token access for ' + user.email },
    };
  }
}
