import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, observable, Subscription, tap } from 'rxjs';
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
  user? : UserI;
  currentUser?: UserI;
  id! : number;
  subscription! : Subscription;
  subscription2! : Subscription;
  alreadyFriend : boolean = false;
  alreadyBlocked : boolean = false;
  
  constructor(private userService: UserService, private router: Router, private route : ActivatedRoute, private token : TokenStorageService
    ,public currentUserService : CurrentUserService) { }

  ngOnInit(): void {
    this.id= Number( this.router.url.split('/')[2]);
      this.searchFriend();
      this.subscription = this.userService.getUserIdFromBack(this.id).subscribe(
        (data : any) => {
          console.log("data =",data);
          this.user = data;
          if (data === null)
           this.router.navigate(['error']);
        },
        error => this.router.navigate(['error'])
        );
      if (this.id === this.token.getId() )
        this.router.navigate(['/myprofile']);
  }

  searchFriend(): void {
    this.subscription2 = this.currentUserService.getFriendFromBack().subscribe(
      (data : any) => {
        for (var i = 0; data[i];i++)
        {
          if (this.id === data[i].id)
          {
            this.alreadyFriend = true;
            break;
          }
        }
      });      
  }

  ngOnDestroy() : void
  {
    this.subscription.unsubscribe;
    this.subscription2.unsubscribe;
  }

  addFriend() : void
  {
    this.userService.sendRequest(this.id).subscribe(
      (data : any) =>{ console.log("friend request" , data)}
    );
  }

  removeFriend() : void
  {
    this.userService.removeFriend(this.id).subscribe(
      (data : any) =>{ console.log("friend request" , data)}
    );
  }

}
