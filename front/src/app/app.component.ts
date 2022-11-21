import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { TokenStorageService } from './services/auth/token.storage';
import { BurgerMenuService } from './services/burger-menu.service';
import { HeaderService } from './services/user/header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'transcendanceV1';
  

  constructor(
              private socket: Socket,
              private snackBar: MatSnackBar,
              public navbar : HeaderService,
              public burgerMenu : BurgerMenuService,
              private token : TokenStorageService,
              private changeDetector: ChangeDetectorRef,) { 
                if (token.getToken())
                navbar.show();
              }   

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

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

}
