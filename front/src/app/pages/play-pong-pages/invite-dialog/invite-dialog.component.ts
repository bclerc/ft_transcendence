import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Socket } from 'ngx-socket-io';
import { InvitedGameI } from 'src/app/services/user/header.service';

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.css']
})
export class InviteDialogComponent implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: InvitedGameI,
                             private _dialogRef: MatDialogRef<InviteDialogComponent>,
                             private socket: Socket,
  ) { }

  ngOnInit(): void {
  }

  action(accepted: boolean) {
    this.socket.emit('responseInvite', {
      accepted: accepted,
      gameId: this.data.gameId
    });
    this._dialogRef.close();
    }

}



