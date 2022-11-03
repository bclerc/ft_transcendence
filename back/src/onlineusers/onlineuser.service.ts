import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketServer } from '@nestjs/websockets';
import { UserState } from '@prisma/client';
import { UserInfo } from 'os';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { jwtConstants } from 'src/auth/constants';
import { BasicUserI } from 'src/user/interface/basicUser.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OnlineUserService {
  handleConnection(client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    throw new Error("Method not implemented.");
  }

  public onlineUsers: Map<String, BasicUserI> = new Map<String, BasicUserI>();


  @WebSocketServer() server;

  constructor 
  (@Inject(forwardRef(() => UserService)) public readonly userService: UserService, 
  @Inject(JwtService) private readonly jwtService: JwtService,
  )
  {}
  
  async initUser(socketId: string, user: BasicUserI) {
    this.onlineUsers.set(socketId, user);
    this.userService.setState(user.id, UserState.ONLINE);
  }

  async newConnect(socket: Socket)
  {
    try {
      const token = socket.handshake.query['token'] as string;
      const res = this.jwtService.verify(token, {
        ignoreExpiration: false,
        secret: jwtConstants.secret,
      });
      const user = await this.userService.findOne(res.sub);
      if (!user)
        return socket.disconnect();
      this.initUser(socket.id, user);
      socket.data.user = user;
    } catch (error) {
      return socket.disconnect();
    }
  }

  getUser(socketId?: string, userId?: number, basicUser?: BasicUserI): BasicUserI {
    if (socketId) {
      return this.onlineUsers.get(socketId);
    }
    if (userId) {
      for (let [key, value] of this.onlineUsers) {
        if (value.id == userId)
          return value;
      }
    }
    if (basicUser) {
      for (let [key, value] of this.onlineUsers) {
        if (value.id == basicUser.id) 
          return value;
      }
    }
  }


  sendToUser(user: BasicUserI | number, event: string, data: any) {
    let userId = typeof user == 'number' ? user : user.id;

    for (let [key, value] of this.onlineUsers) {
       if (value.id == userId) {
         this.server.to(key).emit(event, data);
       }
    }
  }

  sendToUsers(users: BasicUserI[], event: string, data: any) {
    for (let user of users) {
      this.sendToUser(user, event, data);
    }
  }

  deleteUser(socketId: string) {
    let user = this.onlineUsers.get(socketId);
    if (user) {
      this.userService.setState(user.id, UserState.OFFLINE);
    }
    this.onlineUsers.delete(socketId);
  }
}
