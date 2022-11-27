import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from '../interfaces/jwtpayload.interface';
import { User } from '@prisma/client';
import { UserInfoI } from 'src/user/interface/userInfo.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserService) private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserInfoI> {
    return await this.userService.findOne(Number.parseInt(payload.sub));
  }
}
