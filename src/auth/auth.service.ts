import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';

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

  async generate2FASecret(user: User) {
    const secret = authenticator.generateSecret();
	
    const otpauthUrl = authenticator.keyuri(user.email, 'Transcendence42', secret);
	
    await this.usersService.set2FASsecret(user.id, secret);
	
    return {
		secret,
		otpauthUrl
    }
 }

  async verify2FACode(user: User, code: string): Promise<Boolean> {
    return authenticator.verify({ 
      token: code,
      secret: user.twoFactorAuthenticationSecret
    });;
  }


  async login(userid: number, isTwoFactorAuthenticated: boolean) {
	  const payload = { isTwoFactorAuthenticate: isTwoFactorAuthenticated, sub: userid };
	  return {
	  	access_token: { access_token: this.jwtService.sign(payload), message: 'Login successful' },
	  };
	}
}
