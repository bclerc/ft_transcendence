import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { TokenStorageService } from 'src/app/services/auth/token.storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  connect : boolean = false;

  constructor(private token : TokenStorageService,
              private socket: Socket,
              private snackBar: MatSnackBar) { }       


  ngOnInit(): void {
    if (this.token.getToken())
      this.connect= true;

      this.socket.on('notification', (notif: string) => {
        this.snackBar.open(notif, 'OK',
        {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
  }

}
