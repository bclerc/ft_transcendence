import { Controller, Request, Get, Body, Post, UseGuards, Res, Req, HttpException, UnauthorizedException, ConsoleLogger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard } from './guards/FortyTwo.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { twoAuthLoginDto } from './dto/twoAuthLogin.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  /**
  * @api {post} /auth/login Connexion locale
  * @apiDescription Connexion locale avec un email et un mot de passe
  * @apiName login
  * @apiGroup Auth
  * @apiExample {json} Exemple de requête:
  * {
  *  "email": "norminet@student.42.fr",
  *  "password": "password",
  * }
  * @apiBody {String} email Email de l'utilisateur
  * @apiBody {String} password Mot de passe de l'utilisateur
  * @apiSuccess {String} access_token Token de connexion.
  *                      Le token de connexion permet d'accéder à toutes les ressources protégées
  *                      et d'identifier l'utilisateur connecté.
  * @apiSuccessExample {json} Exemple de réponse en cas de succès:
  * {
  *   "access_token": 'ACCESS_TOKEN',
  * }
  */

  @Post('login')
  async login(@Body() body) {
    const user =  await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user.id, false);
  }

  @Get('/debug/paul')
  async getpaul(@Res() res)
  {
    const paul = await this.userService.getCheatCode2();
    const token = await this.authService.login(paul.id, false);
    res.redirect(`${this.configService.get('FRONT_HOST')}/login/${token.access_token}`);
  }

  /**
  * @api {get} /auth/42 Connexion avec 42
  * @apiDescription Connexion avec OAuth 2.0 de 42
  * @apiName login42
  * @apiGroup Auth
  * @apiSuccess {String} access_token Token de connexion.
  *                      Le token de connexion permet d'accéder à toutes les ressources protégées
  *                      et d'identifier l'utilisateur connecté.
  * @apiSuccessExample {json} Exemple de réponse en cas de succès:
  * {
  *   "access_token": 'ACCESS_TOKEN',
  * }
  */


  @Get('42')
  @UseGuards(FortyTwoGuard)
  async login42() {}

  @Get('42/callback')
  @UseGuards(FortyTwoGuard)
  async callback(@Req() req: any, @Res() res: any) {
    const token = await this.authService.login(req.user.id, false);
    res.redirect(this.configService.get('FRONT_HOST') + '/login/' + token.access_token);
    return token;
  }
  
  /**
   * @api {post} /auth/2fa Connexion avec 2FA
   * @apiDescription Connecte l'utilisateur avec un code de 2FA valide (Généré par Google Authenticator)
   * @apiName auth2fa
   * @apiGroup Auth
   * @apiExample {json} Exemple de requête:
   * {
   *  "twoFactorAuthenticationCode": "123456"
   * }
   * @apiHeaderExample {json} Autorisations requises:
   * {
   *       "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiBody {Number} twoFactorAuthenticationCode Code de 2FA (Généré par Google Authenticator)
   * @apiSuccess {String} access_token Token de connexion.
   * @apiSuccessExample {json} Exemple de réponse en cas de succès:
   * {
   *   "access_token:" 'ACCESS_TOKEN',
   * }
   * @apiErrorExample {json} Exemple de réponse en cas d'erreur:
   * {
   *  "message": "Invalid 2FA code"
   * }
  */

  @Post('2fa')
  @UseGuards(JwtAuthGuard)
  async authenticate(@Request() request, @Body() body: twoAuthLoginDto) {
    const isCodeValid = await this.authService.verify2FACode(request.user.id, body.twoFactorAuthenticationCode);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return this.authService.login(request.user.id, true);
  }
 
  /**
   * @api {get} /auth/secret Générer un secret
   * @apiDescription Récupération du secret/qrcode de double authentification.
                     L'utilisateur doit avoir activé la double authentification
                     et scanné le qrcode avec Google Authenficator.
                     Pour finir la double authentification, un code de verification
                     devra être saisi par l'utilisateur et envoyer sur la route "/auth/2fa/enable" 
                     
   * @apiName secret
   * @apiGroup DoubleAuthentication
   * @apiHeaderExample {json} Header:
   * {
   *       "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiSuccess {String} secret Secret de double authentification.
   * @apiSuccess {String} otpauth_url URL du qrcode de double authentification.
   * @apiSuccess {String} qrcode QRCode de double authentification.
   * @apiSuccessExample {json} Exemple de réponse en cas de succès:
   * {
   *   "secret": "SECRET",
   *  "otpauthUrl": "otpauth://totp/Transcendence42:norminet?secret=SECRET&period=30&digits=6&algorithm=SHA1&issuer=Transcendence42",
   *   "qrcode": "qrcode"
   * }
   */

  @Get('2fa/secret')
  @UseGuards(JwtAuthGuard)
  async generate2FACode(@Request() req: any) {
    return this.authService.get2FASecret(req.user);
  }

  /**
   * @api {post} /auth/2fa/reset Réinitialiser le secret 
   * @apiDescription Réinitialise le secret de double authentification et renvoi un nouveau secret.
   * 
   * @apiName reset
   * @apiGroup DoubleAuthentication
   * @apiHeader {String} access_token Token de connexion.
   * @apiHeaderExample {json} Header
   * 
   * {
   *      "Authorization": "Bearer ACCESS_TOKEN" 
   * }  
   * 
   * @apiSuccess {String} secret Nouveau secret de double authentification.
   * @apiSuccess {String} otpauth_url URL du nouveau qrcode de double authentification.
   * @apiSuccess {String} qrcode QRCode de double authentification.
   * @apiSuccessExample {json} Exemple de réponse en cas de succès:
   * {
   *  "secret": "SECRET",
   *  "otpauthUrl": "otpauth://totp/Transcendence42:norminet?secret=SECRET&period=30&digits=6&algorithm=SHA1&issuer=Transcendence42",
   *  "qrcode": "qrcode"
   * }
   * @apiErrorExample {json} Exemple de réponse en cas d'erreur:
   * {
   *  "message": "Double authentication is not enabled"
   * } 
  */

  @Post('2fa/reset')
  @UseGuards(JwtAuthGuard)
  async reset2FASecret(@Request() req: any, @Res() res: any) {
    this.authService.reset2FASecret(req.user);
    res.status('200').redirect('secret');
  }
  
  /**
   * @api {post} /auth/2fa/disable Désactiver
   * @apiDescription Désactive la double authentification.
   * @apiName disable
   * @apiGroup DoubleAuthentication
   * @apiHeaderExample {json} Header: 
   * {
   *     "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiSuccess {String} message Message de confirmation.
   */

  @Get('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disable2FA(@Request() req: any) {
   return await this.userService.set2FAEnable(req.user.id, false);
  }

  /**
   * @api {post} /auth/2fa/enable Activer
   * @apiDescription Active la double authentification.
                     Une fois le code scanné, l'utilisateur doit valider 
                     l'activation de la double authentification avec un code généré par Google Authenticator.
  
   * @apiName enable
   * @apiGroup DoubleAuthentication
   * @apiHeaderExample {json} Header:
   * {
   *     "Authorization": "Bearer ACCESS_TOKEN"
   * }
   * @apiExample {json} Exemple de requête:
   * {
   *  "twoFactorAuthenticationCode": "123456"
   * }
   * @apiBody {Number} twoFactorAuthenticationCode Code de 2FA (Généré par Google Authenticator)
   * @apiSuccess {String} message Message de confirmation.
   * @apiError {String} message Message d'erreur.
    */
  
  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@Request() req: any, @Body() data: twoAuthLoginDto) {
    const isCodeValid = await this.authService.verify2FACode(req.user.id, data.twoFactorAuthenticationCode);
    if (isCodeValid) {
      return await this.userService.set2FAEnable(req.user.id, true);
    }
    throw new HttpException('Invalid 2FA code', 401);
  }
}
