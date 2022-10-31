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
  //user? : Observable<User>;
  constructor(private userService: UserService, private router: Router, private route : ActivatedRoute, private token : TokenStorageService
    ,public currentUserService : CurrentUserService) { }

  /*ngOnInit(): void {

		this.authService.getUserId().pipe(
		  switchMap((idt: number) => this.userService.findOne(idt).pipe(
			tap((user) => {
			  this.user = this.userService.findOne(user.id);
			  this.history = this.historyService.findAllByUserId(user.id);
			  this.getImageFromService(user.id);
			})
		  ))
		).subscribe();
	  }	*/

  ngOnInit(): void {
    this.id= Number( this.router.url.split('/')[2]);

    //this.userService.changeUserList(this.userList);
    
    /*try {
      this.user = this.userService.getUserById(this.id);
    } catch (error) {
      this.router.navigate(['error'])
    }*/
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
      /*if (this.user === null)
          this.router.navigate(['error']);*/




    /*this.userList2$ =  this.route.data.pipe(
      map(data => data['userList']));
      this.subscription = this.userList2$.subscribe(
        (data : any) => {
          console.log("data =",data);
          this.userList = data;
        },
        error => this.router.navigate([''])
        );
        this.id= Number( this.router.url.split('/')[2]);
        this.userService.changeUserList(this.userList);
        
        try {
          this.user = this.userService.getUserById(this.id);
        } catch (error) {
          this.router.navigate(['error'])
        }
        if (this.id === this.token.getId() )
          this.router.navigate(['/myprofile'])*/
        /*if (this.user === null)
          this.router.navigate([''])*/
   

    

  }

  //yolo? : UserI[]; 
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
      
      //console.log("coucou = ", this.yolo);
      //if (this.yolo != undefined)
      //{
        //console.log("coucou532");
        /*for (var i = 0; this.yolo[i];i++);
        {
        
        }*/
      //}

     /*this.currentUserService.getCurrentUser().subscribe(
      (data : any) => {
        console.log("data currentuser =",data);
        this.currentUser = data;
      });
      var i = 0;
      console.log("coucou");
      if (this.currentUser?.friendOf)
      {
      console.log("coucou2");

        while (this.currentUser?.friendOf[i])
        {
          if (this.id === this.currentUser.friendOf[i].id)
          {
            this.alreadyFriend = true;
            console.log("bool = ", this.alreadyFriend);
            return;
          }
          i++;
        }
      }*/
      
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
