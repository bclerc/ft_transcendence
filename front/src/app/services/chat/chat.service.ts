import { Injectable } from '@angular/core';
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
              private snackBar: MatSnackBar) { }

    sendMessage(message: Message) {
      this.socket.emit('message', message);
    }

    getMessages(room: ChatRoom): Observable<Message[]> {  
      return this.socket.fromEvent<Message[]>(`messages`);
    }
    

    getRooms(): Observable<ChatRoom[]> {
      return Observable.create((observer: any) => {
        this.socket.on('rooms', (rooms: ChatRoom[]) => {
          observer.next(rooms);
        });
    });
     
    }
    
    createRoom(room: ChatRoom) {
      this.socket.emit('createRoom', room);
    }

    joinRoom(room: ChatRoom) {
      this.socket.emit('joinRoom', room);
    }

    leaveRoom(room: ChatRoom) {
      this.socket.emit('leaveRoom', room);
    }

  }


