import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/jwtpayload.interface';
import { User } from '@prisma/client';
import { UserInfoI } from 'src/user/interface/userInfo.interface';
import { userInfo } from 'os';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(@Inject(UserService) private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user: UserInfoI = await this.userService.findOne(Number.parseInt(payload.sub));
    if (!user.twoFactorEnabled) {
      return user;
    }
    if (payload.isTwoFactorAuthenticate) {
      return user;
    }
    throw new UnauthorizedException({message: '2FA_REQUIRED'});
  }
}