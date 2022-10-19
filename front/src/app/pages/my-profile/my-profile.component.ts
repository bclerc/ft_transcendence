import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
<<<<<<< HEAD
import { map, Observable } from 'rxjs';
=======
import { map, Observable, Subscription } from 'rxjs';
>>>>>>> merge
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
<<<<<<< HEAD

=======
  subscription!: Subscription;
>>>>>>> merge
  ngOnInit(): void {
    // console.log("start");

    this.userList2$ =  this.route.data.pipe(
      map(data => data['userList']));
<<<<<<< HEAD
      this.userList2$.subscribe(
        (data : any) => {
          // console.log("data =",data);
=======
       this.subscription = this.userList2$.subscribe(
        (data : any) => {
          console.log("data =",data);
>>>>>>> merge
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
<<<<<<< HEAD
      
=======
      this.subscription.unsubscribe;
>>>>>>> merge
    }
  }




