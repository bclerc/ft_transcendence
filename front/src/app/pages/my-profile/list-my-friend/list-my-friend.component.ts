import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';

import { UserI } from 'src/app/models/user.models';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-list-my-friend',
  templateUrl: './list-my-friend.component.html',
  styleUrls: ['./list-my-friend.component.css']
})
export class ListMyFriendComponent implements OnInit {

  constructor(private route: ActivatedRoute, private token : TokenStorageService, private jwtHelper: JwtHelperService, public userService : UserService, private router : Router
    , public currentUser : CurrentUserService, private snackBar : MatSnackBar) 
  {
 
  }

  friends! : UserI[];
  subscriptionFriend!: Subscription;

  ngOnInit(): void {
    this.subscriptionFriend =  this.userService.getFriends().subscribe(
      (data : any) => {
        this.friends = data;
      }
    );
  }

  ngOnDestroy() : void
    {
      if (this.subscriptionFriend != undefined)
        this.subscriptionFriend.unsubscribe;
    }

    // removeFriend(id : number | undefined) : void
    // {
    //   this.userService.removeFriend(id).subscribe(
    //     (data : any) =>
    //     {
    //     if (this.user && this.friends)
    //     {
    //       for (var i = 0; this.friends[i] ;i++)
    //       {
    //         if (id === this.friends[i].id)
    //         {
    //           this.friends.splice(i, 1);
    //           break;
    //         }
    //       }
    //     }
    //   }
    //   );
    // }
  
    // blockUser(id : number | undefined) : void
    // {
    //   this.userService.blockUser(id).subscribe(
    //     (data : any) =>
    //     {
    //     if (this.user && this.friends)
    //     {
    //       for (var i = 0; this.friends[i] ;i++)
    //       {
    //         if (id === this.friends[i].id)
    //         {
    //           this.friends.splice(i, 1);
    //           break;
    //         }
    //       }
    //     }
    //   }
    //   )
    // }

}