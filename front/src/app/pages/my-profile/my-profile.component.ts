import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable, Subscription } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute, private token : TokenStorageService, private jwtHelper: JwtHelperService, public userService : UserService, private router : Router) 
  {
 
  }
  
  tokenString? : string | null;
  id? : number | null ;
  user? : UserI;
  filtersLoaded?: Promise<boolean>;
  userList!: UserI[];
  userList2$!: Observable <UserI[]>;
  subscription!: Subscription;
  ngOnInit(): void {
    // console.log("start");

    this.userList2$ =  this.route.data.pipe(
      map(data => data['userList']));
      this.userList2$.subscribe(
        (data : any) => {
          // console.log("data =",data);
          this.userList = data;
        },
        error => this.router.navigate([''])
        );
      this.userService.changeUserList(this.userList);
      this.id = this.token.getId();
      if (this.id)
      {
        this.user = this.userService.getUserById(this.id);
      }
      // console.log("done");
    }

    ngOnDestroy() : void
    {
      this.subscription.unsubscribe;
    }
  }




