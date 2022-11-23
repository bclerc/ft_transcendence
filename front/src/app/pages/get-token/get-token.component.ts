import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
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
  
  constructor ( 
                private router : Router,
                private token : TokenStorageService,
                private jwtHelper : JwtHelperService,
                private navbar: HeaderService,
                @Inject(Socket) private socket: Socket,
                private snackBar : MatSnackBar,
                private route : ActivatedRoute,
              ) {}

  tokenString! : string;
  
  ngOnInit(): void {  
    this.tokenString  = this.route.snapshot.params['id'];

    try {
      this.jwtHelper.decodeToken(this.tokenString);
      this.token.saveToken(this.tokenString);
      this.socket.disconnect();
      this.socket.ioSocket.io.opts.query = 'token=' + this.token.getToken();
      this.socket.connect();
      this.navbar.show();
      this.router.navigate(['/game']);
   } catch(Error) {
    this.snackBar.open("Merci de vous reconnectez", 'X', {
      duration: 3000,
    });
    this.router.navigate(['/']);
   }
  }
}
