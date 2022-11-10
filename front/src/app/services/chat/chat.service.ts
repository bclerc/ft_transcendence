
import { C } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { ChatRoom } from './chatRoom.interface';
import { Message } from './message.interface';
@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(public socket: Socket,
              private snackBar: MatSnackBar,
              private http: HttpClient
              ) { }

   sendMessage(message: Message) {
      console.log("sendingMessage:", message);
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

    createRoom(room: ChatRoom) {
      this.socket.emit('createRoom', room);
    }

    editRoom(room: ChatRoom) {
      this.socket.emit('editRoom', room);
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
      console.log("+pardonUser", userId, penaltyId);
      this.socket.emit('pardonUser', {userId: userId, penaltyId: penaltyId});
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

