import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { tokenGetter } from '../app.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  connect : boolean = false;

  constructor(private token : TokenStorageService, private router : Router) { }

  ngOnInit(): void {
    if (this.token.getToken())
      this.connect= true;

  }

  logOut() : void {
    this.token.removeToken();
    this.connect= false;
    this.router.navigate(['']);
  }

}
