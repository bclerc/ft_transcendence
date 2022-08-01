import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { doesNotMatch } from 'assert';
import { IntraUser } from 'src/user/interface/intraUser.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService
  ){
    super({
      clientID:
        '#',
      clientSecret:
        '#',
      callbackURL: 'http://localhost:3000/auth/42/callback',

    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<IntraUser> {
    console.log(profile);
    const intraUser: IntraUser = profile;
    return intraUser;
  }
}
