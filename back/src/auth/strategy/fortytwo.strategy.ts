import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { doesNotMatch } from 'assert';
import { IntraUser } from 'src/user/interface/intraUser.interface';
import { UserService } from 'src/user/user.service';
import { ConfigService, getConfigToken } from '@nestjs/config';


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ){
    configService.get<string>('INTRA_CLIENT_ID')
    super({
      clientID: configService.get<string>('INTRA_CLIENT_ID'),
      clientSecret: configService.get<string>('INTRA_CLIENT_SECRET'),
      callbackURL: String("http://"+ configService.get<string>('HOST') +":3000/api/v1/auth/42/callback"),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const intraUser = {
      email: profile.emails[0].value,
      intra_name: profile.username,
      intra_id: Number.parseInt(profile.id),
      avatar_url: profile._json.image.link,
      displayname: profile.username, 
    };
    const user = await this.userService.findByEmail(intraUser.email);
	if (!user) {
		return await this.userService.createIntraUser(intraUser);
	}
    return user;
  }
}
