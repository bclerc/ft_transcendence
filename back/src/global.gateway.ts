import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat/chat.service';
import { OnlineUserService } from './onlineusers/onlineuser.service';
import { UserService } from './user/user.service';
import { WschatService } from './wschat/wschat.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ConnectableObservable } from 'rxjs';
import { RequestEvent } from './friends/interfaces/friends.event';
import { BasicUserI } from './user/interface/basicUser.interface';
import { ChatRoomI } from './chat/interfaces/chatRoom.interface';
import { ConfigService } from '@nestjs/config';


@WebSocketGateway(8181, { cors: { origin: 'localhost' } })
export class GlobalGateway implements  OnGatewayConnection, OnGatewayDisconnect  {

  @WebSocketServer() server;


  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ChatService) private readonly chatService: ChatService,
    @Inject(WschatService) private readonly wschatService: WschatService,
    private readonly onlineUserService: OnlineUserService,
  ) { }

  
  handleConnection(client: Socket) {
    this.onlineUserService.newConnect(client);
	}

  handleDisconnect(client: any) {
    this.onlineUserService.deleteUser(client.id);
  }

  
  @OnEvent('friend.request')
  async handleFriendRequest(data: RequestEvent) {
    if (data.success) {
      this.sendToUser(data.user, 'notification', "Vous avez envoyé une demande d'amitié à " + data.target.displayname);
      this.sendToUser(data.target, 'notification', data.user.displayname + " vous a envoyé une demande d'amitié");
    } else {
      this.sendToUser(data.user, 'notification', 'Impossible d\'envoyer la demande d\'amitié. ' + data.message);
    }
  }


  @SubscribeMessage('whoami')
  async whoami(client: Socket) {
    let user = this.onlineUserService.getUser(client.id);
    if (user) {
      this.server.emit(client.id, 'whoami', await this.userService.findOne(user.id));
    }
  }

  sendToUser(user: BasicUserI, prefix: string, data: any) {  
      if (user) {
        for (let [key, value] of this.onlineUserService.onlineUsers) {
          if (value.id == user.id) 
          {
            this.server.to(key).emit(prefix, data);
          }
        }
      }
  }

  async sendToUsersInRoom(roomId: number, prefix: string, data: any) {
    let room = await this.chatService.getRoomById(roomId);

    room.users.forEach(user => {
      this.sendToUser(user, prefix, data);
    });
  }
}
