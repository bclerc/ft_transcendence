import { Component, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { User, UserI } from 'src/app/models/user.models';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  @Output() user! : UserI;
  // user? : UserI;
  currentUser?: UserI;
  id! : number;
  subscription! : Subscription;
  subscription2! : Subscription;
  subscription3! : Subscription;
  alreadyFriend : boolean = false;
  alreadyBlocked : boolean = false;
  
  constructor(private userService: UserService, private router: Router, private route : ActivatedRoute, private token : TokenStorageService
    ,public currentUserService : CurrentUserService, private snackBar : MatSnackBar) { }

  ngOnInit(): void {
    this.id= Number( this.router.url.split('/')[2]);
    
      this.searchFriend();
      this.subscription = this.userService.getUserIdFromBack(this.id).subscribe(
        (data : any) => {
          this.user = data;
        }
        );
      if (this.id === this.token.getId() )
        this.router.navigate(['/myprofile']);
  }

  searchFriend(): void {
     this.subscription2 = this.currentUserService.getCurrentUser().subscribe(
      (data : any) => {
        // console.log("current user" , data)
        for (var i = 0; data.friendOf[i];i++)
        {
          if (this.id === data.friendOf[i].id)
          {
            this.alreadyFriend = true;
            break;
          }
        }
        for (var i = 0; data.blockedUsers[i];i++)
        {
          if (this.id === data.blockedUsers[i].id)
          {
            this.alreadyBlocked = true;
            break;
          }
        }
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
    )
    
  }

  ngOnDestroy() : void
  {
    this.subscription.unsubscribe;
    this.subscription2.unsubscribe;
    // this.subscription3.unsubscribe;
  }

  addFriend() : void
  {
    this.userService.sendRequest(this.id).subscribe(
      (data : any) =>{
        this.alreadyFriend = true
        //  console.log("friend request" , data)
      }
    );
  }

  removeFriend() : void
  {
    this.userService.removeFriend(this.id).subscribe(
      (data : any) =>{
        this.alreadyFriend = false
        //  console.log("friend request" , data)
      }
    );
  }

  blockUser() : void
  {
    this.userService.blockUser(this.id).subscribe(
      (data : any) =>{
        this.alreadyBlocked= true
        //  console.log("block = " , data)
      }
    )
  }

  unblockUser() : void
  {
    this.userService.unBlockUser(this.id).subscribe(
      (data : any) =>{ 
        this.alreadyBlocked= false
        // console.log("unblock = " , data)
      }
    )
  }

}
