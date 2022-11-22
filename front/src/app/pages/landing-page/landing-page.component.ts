import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../../header/header.component';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  loginPath = 'http://' + environment.host + ':3000/api/v1/auth/42';
  paulPath = 'http://' + environment.host + ':3000/api/v1/auth/debug/paul';
  
  constructor (
                private token : TokenStorageService,
                private router : Router
              ) { }

  ngOnInit(): void {
    if (this.token.getToken())
      this.router.navigate(["game"])
  }

}
