import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class HeaderService {
  visible: boolean;



  
  constructor(
    private socket: Socket,
    private router: Router
  ) { 
  
    this.socket.on('redirectGame', (gameId: number) => {
      this.redirectToGame(gameId);
    });
    this.visible = false; 
  }

  hide() { this.visible = false; }

  show() { this.visible = true; }

  toggle() { this.visible = !this.visible; }

  redirectToGame(gameId: number) {
    this.router.navigate(['/game/', gameId]);
  }


}