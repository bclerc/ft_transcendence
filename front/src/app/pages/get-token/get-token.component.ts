import { Component, Inject, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { TokenStorageService } from '../../services/auth/token.storage';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HeaderService } from 'src/app/services/user/header.service';
import { Socket } from 'ngx-socket-io';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-get-token',
  templateUrl: './get-token.component.html',
  styleUrls: ['./get-token.component.css']
})
export class GetTokenComponent implements OnInit {
  
  constructor(private router : Router, private token : TokenStorageService,
    private jwtHelper : JwtHelperService,
    private navbar: HeaderService,
    @Inject(Socket) private socket: Socket,
    private snackBar : MatSnackBar) { }
  tokenString! : string;
  
  ngOnInit(): void {  
    
    this.tokenString = this.router.url.split('/')[2];

    try {
      this.jwtHelper.decodeToken(this.tokenString);
      this.token.saveToken(this.tokenString);
      this.socket.disconnect();
      this.socket.ioSocket.io.opts.query = 'token=' + this.token.getToken();
      this.socket.connect();
      this.navbar.show();
      this.router.navigate(['/chat']);
   } catch(Error) {
     //console.log("error");
    this.snackBar.open("Le token est invalide", 'Undo', {
      duration: 3000
    });
    this.router.navigate(['/']);
   }

    //console.log("this.tokenString")
   // console.log("id = ", this.jwtHelper.decodeToken(this.tokenString).sub);
    //console.log(this.tokenString);
    //this.loggedin.isUserLoggedIn.next(true);
    
  }

  

  /*response: function(res) {
    if(res.config.url.indexOf(API) === 0 && res.data.token) {
      auth.saveToken(res.data.token);
    }
  
    return res;
  }*/



}
