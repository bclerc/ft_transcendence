import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';

import { UserI } from 'src/app/models/user.models';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { UserService } from 'src/app/services/user/user.service';
import { ModifyMyProfileComponent } from '../modify-my-profile/modify-my-profile.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyProfileComponent implements OnInit {

  constructor ( public userService : UserService,
                private router : Router,
                private snackBar : MatSnackBar,
                public currentUser : CurrentUserService,
                private dialog: MatDialog,
              ) {}
  
  user? : UserI;
  friends! : UserI[];
  subscription!: Subscription;
  subscriptionFriend!: Subscription;

  async ngOnInit(){
        this.subscription = this.currentUser.getCurrentUser().subscribe(
        (data : any) => {
          // console.log("data =", data)
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
  
      this.subscriptionFriend =  this.userService.getFriends().subscribe(
        (data : any) => {
          this.friends = data;
        }
      );
    }

    ngOnDestroy() : void
    {
      this.subscription.unsubscribe;
      if (this.subscriptionFriend != undefined)
        this.subscriptionFriend.unsubscribe;
    }

    openDialogEditMyProfile() {
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = '90%';
      dialogConfig.width = '90%';
  
      dialogConfig.data = {
          user : this.user,
      };
  
      this.dialog.open(ModifyMyProfileComponent, dialogConfig);
  }
}
