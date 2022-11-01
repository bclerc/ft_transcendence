
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
      this.socket.emit('message', message);
    }

    getMessages(room: ChatRoom): Observable<Message[]> {  
       return this.socket.fromEvent<Message[]>('messages')
    }

    getRooms(): Observable<ChatRoom[]> {
      return Observable.create((observer: any) => {
        this.socket.on('rooms', (rooms: ChatRoom[]) => {
          console.log(rooms);
          observer.next(rooms);
        });
      });
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

