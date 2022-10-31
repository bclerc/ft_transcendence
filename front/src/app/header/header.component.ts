import { Component, Inject, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../services/user/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  constructor(private token : TokenStorageService,
              private router : Router,
              public navbar: HeaderService,
              public socket: Socket)
              
              { }


  ngOnInit(): void {
    //this.navbar.show();
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


}
