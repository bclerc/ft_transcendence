import { Component, ViewEncapsulation, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FriendsRequestAction } from 'src/app/models/friends/friendsrequest.enum';
import { UserI } from 'src/app/models/user.models';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { UserService } from 'src/app/services/user/user.service';
import { ModifyMyProfileComponent } from '../modify-my-profile/modify-my-profile.component';
import { AddFriendListComponent } from './add-friend-list/add-friend-list.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyProfileComponent implements OnInit {
  @Output() user! : any;
  @Output() friends! : UserI[];
  @Output() id! : number;

  constructor ( 
                public userService : UserService,
                private router : Router,
                private snackBar : MatSnackBar,
                public currentUser : CurrentUserService,
                private dialog: MatDialog,
              ) {}
  
  subscription!: Subscription;
  subscriptionFriend!: Subscription;
  pandingFriends = this.userService.getFriendRequests() ;


  async ngOnInit(){
        this.subscription = this.currentUser.getCurrentUser().subscribe(
        (data : any) => {
          this.user = data;
        },
        );
  
      this.subscriptionFriend =  this.userService.getFriends().subscribe(
        (data : any) => {
          this.friends = data;
        }
      )
      

    }

    ngOnDestroy() : void
    {
      this.subscription.unsubscribe;
      if (this.subscriptionFriend != undefined)
        this.subscriptionFriend.unsubscribe;
    }

    openDialogEditMyProfile() {
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.autoFocus = true;
      dialogConfig.height = '90%';
      dialogConfig.width = '90%';
  
      dialogConfig.data = {
          user : this.user,
      };
  
      this.dialog.open(ModifyMyProfileComponent, dialogConfig);
  }



  async respond(requestId: number, response: boolean) {
    this.userService.respondFriendRequest(requestId,
          response ? FriendsRequestAction.ACCEPTED : FriendsRequestAction.DECLINED).subscribe(
            (res: any) => {
              // console.log(res);
              this.updateInfo();
            }
          )


          ;
  }

  async updateInfo() {
    // this.friends = this.userService.getFriends();
    this.pandingFriends = this.userService.getFriendRequests();
    if (this.subscriptionFriend != undefined)
    this.subscriptionFriend.unsubscribe;
    this.subscriptionFriend =  this.userService.getFriends().subscribe(
      (data : any) => {

        this.friends = data;
      }
    )
  }

}
