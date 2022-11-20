import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { UserI } from 'src/app/models/user.models';
import { InviteDialogComponent } from 'src/app/pages/play-pong-pages/invite-dialog/invite-dialog.component';

export interface InvitedGameI {
  gameId: any,               // Create interface for this
  inviter_name: string,
}

@Injectable()
export class HeaderService  {
  visible: boolean;

  
  constructor(
    private socket: Socket,
    private router: Router,
    private dialog: MatDialog,
  ) { 
  
    this.socket.on('redirectGame', (gameId: number) => {
      this.redirectToGame(gameId);
    });
    
    this.socket.on('invited', (data: InvitedGameI) => {
      this.dialog.open(InviteDialogComponent, {
        data: data
      });
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