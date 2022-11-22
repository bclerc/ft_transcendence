import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { environment } from 'src/environments/environment';
import { BurgerMenuService } from '../services/burger-menu.service';
import { CurrentUserService } from '../services/user/current_user.service';
import { HeaderService } from '../services/user/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  connect: boolean = false;
  crash: boolean = false;
  newMessage: Observable<number> = this.socket.fromEvent<number>('newMessage');

  constructor(private token : TokenStorageService,
              private router : Router,
              public navbar: HeaderService,
              public burgerMenu : BurgerMenuService,
              public currentuser: CurrentUserService,
              public snackBar: MatSnackBar,
              public socket: Socket)
              { }



  ngOnInit(): void {
    if (this.token.getToken())
      this.connect = true;
    this.needToDisplayNewMessage();

    // if the server is down, we display a message
    this.socket.on('connect_error', (error: any) => {
      this.crash = true;
      this.snackBar.open("La connection au serveur a été perdue", "Fermer", {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });

    // if the server is re connected, we display a message
    this.socket.on('connect', () => {
     if (this.crash) 
      window.location.reload();
  });

  }

  logOut() : void {
    this.token.removeToken();
    this.navbar.hide();
    this.burgerMenu.show();
    this.router.navigate(['']);
    this.socket.emit('logout');
  }

  getEnvHost(){
    return environment.host;
  }


  needToDisplayNewMessage() : void {
    this.socket.emit('needMessagesNotSeen');
  }

  burgerMenuShow() : void {
    this.burgerMenu.show();
  }

  burgerMenuHide() : void {
    this.burgerMenu.hide();
  }

}
