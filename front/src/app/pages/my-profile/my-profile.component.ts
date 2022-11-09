import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    , public currentUser : CurrentUserService, private snackBar : MatSnackBar) 
  {
 
  }
  
  tokenString? : string | null;
  id? : number | null ;
  user? : UserI;
  filtersLoaded?: Promise<boolean>;
  userList!: UserI[];
  userList2$!: Observable <UserI[]>;
  subscription!: Subscription;
  friends = this.userService.getFriends();

  userLi!: Observable <UserI> | undefined;
  async ngOnInit(){
      this.userLi = this.currentUser.getCurrentUser();
      if (this.userLi)
      {
        this.subscription = this.userLi.subscribe(
        (data : any) => {
          console.log("data =", data)
          this.user = data;
        },
          (error : any) => 
          {
            if (error.status === 401 && error.error.message === "2FA_REQUIRED")
            {
              this.snackBar.open("une connexion 2FA est demandée", 'Undo', {
                duration: 3000
              })
              this.router.navigate(['code'])
            }
            else
            {
              this.router.navigate([''])
            }
          }
        );
      }
    }

    ngOnDestroy() : void
    {
      this.subscription.unsubscribe;
    }

    friend? : Array<UserI>;
    removeFriend(id : number | undefined) : void
    {
      var i = 0
      this.userService.removeFriend(id).subscribe(
      //   if (this.user && this.user.friends)
      //   {
      //     for (i = 0; this.user.friends[i] ;i++)
      //     {
      //       if (id === this.user.friends[i].id)
      //         this.user.friends.splice(i, 1)
      //     }
      //   }
      );
    }
  
    blockUser(id : number | undefined) : void
    {
      this.userService.blockUser(id).subscribe(

      )
    }
}




