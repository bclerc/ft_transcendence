import { Component, Inject, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { TokenStorageService } from '../../services/auth/token.storage';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HeaderService } from 'src/app/services/user/header.service';

@Component({
  selector: 'app-get-token',
  templateUrl: './get-token.component.html',
  styleUrls: ['./get-token.component.css']
})
export class GetTokenComponent implements OnInit {
  
  constructor(private router : Router, private token : TokenStorageService, private jwtHelper : JwtHelperService, public navbar : HeaderService/*, private loggedin : IsLoggedIn*/) { }
  tokenString! : string;
  
  ngOnInit(): void {
    
    this.tokenString = this.router.url.split('/')[2];
    this.token.saveToken(this.tokenString);
    this.navbar.show();
    //console.log("this.tokenString")
   // console.log("id = ", this.jwtHelper.decodeToken(this.tokenString).sub);
    //console.log(this.tokenString);
    //this.loggedin.isUserLoggedIn.next(true);
    this.router.navigate(['']);
  }

  

  /*response: function(res) {
    if(res.config.url.indexOf(API) === 0 && res.data.token) {
      auth.saveToken(res.data.token);
    }
  
    return res;
  }*/



}
