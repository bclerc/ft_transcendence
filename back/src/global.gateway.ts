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


@WebSocketGateway(8181, { cors: { origin: '*' } })
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

  
  @SubscribeMessage('whoami')
  async whoami(client: Socket) {
    let user = this.onlineUserService.getUser(client.id);
    if (user) {
      this.onlineUserService.sendToUser(user, 'whoami', await this.userService.findOne(user.id));
    }
  }


  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
