import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../auth/token.storage';
import { ChatRoom, newRoom } from './chatRoom.interface';
import { Message } from './message.interface';
@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(public socket: Socket,
              private snackBar: MatSnackBar,
              private http: HttpClient,
              private token : TokenStorageService, private jwtService : JwtHelperService,
              ) { }

   sendMessage(message: Message) {
      this.socket.emit('message', message);
    }

    getMessages(room: ChatRoom): Observable<Message[]> {  
       return this.socket.fromEvent<Message[]>('messages')
    }

    getRooms(): Observable<ChatRoom[]> {
      return this.socket.fromEvent<ChatRoom[]>('rooms');
    }
    
    getPublicRooms(): Observable<ChatRoom[]> {
      return  this.socket.fromEvent<ChatRoom[]>('publicRooms');
    }
    
    getDmRooms(): Observable<ChatRoom[]> {
      return  this.socket.fromEvent<ChatRoom[]>('dmRooms');
    }

    createRoom(room: newRoom) {
      this.http.post('http://'+ environment.host +':3000/api/v1/chat/create', room).subscribe(
        (data : any) => {
          this.snackBar.open(data.message, 'OK', {
            duration: 2000,
          });
        });
    }

    editRoom(room: ChatRoom) {
      this.socket.emit('editRoom', room);
    }

    deleteRoom(room: ChatRoom) {
      this.socket.emit('deleteRoom', room.id);
    }

    subscribeRoom(room: ChatRoom, pass?: string | null) {
      let object = {
        roomId: room.id,
        password: pass,
      }
      this.socket.emit('subscribeRoom', object);
    }

    blockUser(userId: number, block: boolean)
    {
      this.socket.emit('blockUser', {block: block, userId: userId});
    }

    pardonUser(userId: number, penaltyId: number) {
      this.socket.emit('pardonUser', {userId: userId, penaltyId: penaltyId});
    }

    promoteUser(userId: number, roomId: number) {
      this.socket.emit('promoteUser', { roomId: roomId, targetId: userId });
    }
  
    demoteUser(userId: number, roomId: number) {
      this.socket.emit('demoteUser',  { roomId: roomId, targetId: userId });
    }

    needRooms() {
      this.socket.emit('needRooms');
    }

    needPublicRooms() {
      this.socket.emit('needPublicRooms');
    }

    needDmRooms() {
      this.socket.emit('needDmRooms');
    }

    joinRoom(room: ChatRoom) {
      this.socket.emit('joinRoom', room);
    }

    leaveRoom(room: ChatRoom) {
      this.socket.emit('leaveRoom', room);
    }

  }

