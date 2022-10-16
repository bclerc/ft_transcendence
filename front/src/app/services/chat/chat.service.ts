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
              private snackBar: MatSnackBar) { }

    sendMessage(message: Message) {
      this.socket.emit('message', message);
    }

    getMessages(room: ChatRoom): Observable<Message[]> {  
      return Observable.create((observer: any) => {
        this.socket.on('messages', (msgs: Message[]) => {
            console.log(msgs);
          // const audio = new Audio();
          // audio.src = 'assets/sounds/wizz.mp3';
          // audio.load();
          // audio.play();

            observer.next(msgs);
        });
    });
    }
    

    getRooms(): Observable<ChatRoom[]> {
      return this.socket.fromEvent<ChatRoom[]>('rooms');
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


