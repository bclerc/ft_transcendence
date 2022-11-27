import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Http2ServerRequest } from 'http2';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { UserService } from '../user/user.service';
import { IDoubleAuthenticationSecret } from './interfaces/2fasecret.interface';
import { JwtNewToken } from './interfaces/jwttoken.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {

    throw new UnauthorizedException("Invalid credentials");
  }

  async get2FASecret(user: User) : Promise<IDoubleAuthenticationSecret> {
    const secret =  await user.twoFactorAuthenticationSecret || authenticator.generateSecret();
    const otpauthUrl =  await authenticator.keyuri(user.intra_name, 'Transcendence42', secret);
    const qrcode = await toDataURL(otpauthUrl);
    await this.usersService.set2FASsecret(user.id, secret);
    return {
  		secret,
	  	otpauthUrl,
      qrcode,      
    };
 }
  async verify2FACode(userId: number, code: string): Promise<Boolean> {
    const twoFactorAuthenticationSecret = await this.usersService.get2FASsecret(userId);
    if (!twoFactorAuthenticationSecret)
      throw new UnauthorizedException("User have not secret set");
    return authenticator.verify({ 
      token:  code,
      secret: twoFactorAuthenticationSecret
    });
  }

  async reset2FASecret(user: User) {
    await this.usersService.set2FASsecret(user.id, null);
    return await this.get2FASecret(user);
  }

  async login(userid: number, isTwoFactorAuthenticated: boolean): Promise<JwtNewToken> {
	  const payload = { isTwoFactorAuthenticate: isTwoFactorAuthenticated, sub: userid };
	  return {
	  	access_token: this.jwtService.sign(payload),
      message: 'Login successful',
	  };
	}
}
