import { Component, Inject, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { environment } from 'src/environments/environment';
import { CurrentUserService } from '../services/user/current_user.service';
import { HeaderService } from '../services/user/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  connect: boolean = false;
  newMessage: Observable<number> = this.socket.fromEvent<number>('newMessage');

  constructor(private token : TokenStorageService,
              private router : Router,
              public navbar: HeaderService,
              public currentuser: CurrentUserService,
              public socket: Socket)
              { }



  ngOnInit(): void {
    if (this.token.getToken())
      this.connect = true;
    this.needToDisplayNewMessage();
  }

  logOut() : void {
    this.token.removeToken();
    this.navbar.hide();
    this.router.navigate(['']);
    this.socket.emit('logout');
  }

  getEnvHost(){
    return environment.host;
    
  }


  needToDisplayNewMessage() : void {
    this.socket.emit('needMessagesNotSeen');
  }

}
