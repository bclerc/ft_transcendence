import { Controller, Request, Get, Body, Post, UseGuards, Res, Req, HttpException, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { Jwt2faAuthGuard } from './auth/guards/jwt2fa.guard';
import { PrismaService } from './prisma/prisma.service';
import { channel } from 'diagnostics_channel';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService
    ) {}

  /**
   * Pour tester en developement
   * rediriger vers la page d'accueil du site en prod. 
   */

}