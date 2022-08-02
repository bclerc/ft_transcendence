import { Controller, Request, Get, Post, UseGuards, Res, Req } from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { FortyTwoGuard } from './auth/guards/FortyTwo.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('auth/42')
  @UseGuards(FortyTwoGuard)
  async login42() {}

  @Get('auth/42/callback')
  @UseGuards(FortyTwoGuard)
  async callback(@Req() req: any) {
    return this.authService.login(req.user);
  }
}
