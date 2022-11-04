import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subscription } from 'rxjs';

import { UserI } from 'src/app/models/user.models';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute, private token : TokenStorageService, private jwtHelper: JwtHelperService, public userService : UserService, private router : Router
    , public currentUser : CurrentUserService) 
  {
 
  }
  
  tokenString? : string | null;
  id? : number | null ;
  user? : UserI;
  filtersLoaded?: Promise<boolean>;
  userList!: UserI[];
  userList2$!: Observable <UserI[]>;
  subscription!: Subscription;

  userLi!: Observable <UserI> | undefined;
  async ngOnInit(){
      this.userLi = this.currentUser.getCurrentUser();
      if (this.userLi)
      {
        this.subscription = this.userLi.subscribe(
        (data : any) => {
          this.user = data;
        },
          (error : any) => 
          {
            if (error.status === 401 && error.error.message === "2FA_REQUIRED")
              this.router.navigate(['code'])
            else
              this.router.navigate([''])
          }
        );
      }
    }

    ngOnDestroy() : void
    {
      this.subscription.unsubscribe;
    } 
}




