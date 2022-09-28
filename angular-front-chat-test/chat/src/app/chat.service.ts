import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// Websocket chat server to http://localhost3000:31 namespace chat
export class ChatService {
  constructor(private socket: Socket, private snackBar: MatSnackBar) { }
  
  
  //get event message
  public getMessages = () => {
    return Observable.create((observer: any) => {
        this.socket.on('message', (message: string) => {
            observer.next(message);
        });
    });
}
  //send message to server
  sendMessage(message: string) {
    this.socket.emit('message', message);
  }
  
  
  //get event connected
  getConnected() {

    this.socket.on('message', (data: any) => {
      this.snackBar.open(data, 'OK', { duration: 2000 })
    });
      
    const eventconnected = this.socket.fromEvent('connected');
    console.log("Connection receiveid");
    if (eventconnected  ) {
      console.log(eventconnected);
      this.snackBar.open("new user ?;", 'Close');
      return eventconnected;
    }
    return eventconnected;
    
  }
}