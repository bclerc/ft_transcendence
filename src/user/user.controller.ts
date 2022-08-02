import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { newUserDto } from './dto/newUser.dto';
import { User } from '@prisma/client';
import { FortyTwoGuard } from '../auth/guards/FortyTwo.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(FortyTwoGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(Number.parseInt(id));
  }
  @Post()
  @UseGuards(FortyTwoGuard)
  async newUser(@Body() data: newUserDto): Promise<User> {
    return await this.userService.newUser(data);
  }
}
