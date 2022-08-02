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
        process.env.INTRA_CLIENT_ID,
      clientSecret:
		process.env.INTRA_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/v1/auth/42/callback',

    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    console.log(profile);
    const intraUser = {
      email: profile.emails[0].value,
      intra_name: profile.username,
      intra_id: Number.parseInt(profile.id),
      avatar_url: profile.photos[0].value,
      displayname: profile.displayName, 
    };
	
    const user = await this.userService.findByEmail(profile.emails[0].value);
	if (!user) {
		return await this.userService.createIntraUser(intraUser);
	}
    return user;
  }
}
