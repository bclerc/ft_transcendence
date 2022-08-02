import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './user/filter/http-exception.filter';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, ConfigModule.forRoot()],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService, {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
  }],
})
export class AppModule {}
