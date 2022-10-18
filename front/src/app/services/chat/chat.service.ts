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
              private http: HttpClient) { }

   sendMessage(message: Message) {
      this.socket.emit('message', message);
    }

    getMessages(room: ChatRoom): Observable<Message[]> {  
      return Observable.create((observer: any) => {
        this.socket.on('messages', (msgs: Message[]) => {
            observer.next(msgs);
        });
    });
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
     return  this.http.get<ChatRoom[]>('http://localhost:3000/api/v1/chat/rooms/public');
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

    joinRoom(room: ChatRoom) {
      this.socket.emit('joinRoom', room);
    }

    leaveRoom(room: ChatRoom) {
      this.socket.emit('leaveRoom', room);
    }

  }


