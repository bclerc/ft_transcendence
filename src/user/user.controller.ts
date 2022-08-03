import { Body, Controller, Request, Get, HttpException, Param, Post, UseFilters, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StaffGuard } from '../auth/guards/staff.guard';
import { newUserDto } from './dto/newUser.dto';
import { User } from '@prisma/client';
import { FortyTwoGuard } from '../auth/guards/FortyTwo.guard';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt2fa.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req: any, @Param('id') id): Promise<User>{
    if (req.user.id != id && !req.user.staff)
      throw new ForbiddenException();
    return this.userService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async newUser(@Body() data: newUserDto): Promise<User> {
    return await this.userService.newUser(data);
  }
}

