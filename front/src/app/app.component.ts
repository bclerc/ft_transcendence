import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
//import { ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'transcendanceV1';
  

  constructor(
              private socket: Socket,
              private snackBar: MatSnackBar) { }   

  ngOnInit(): void {
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
