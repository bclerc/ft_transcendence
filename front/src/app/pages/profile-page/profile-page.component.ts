import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
<<<<<<< HEAD
import { map, Observable, observable, tap } from 'rxjs';
=======
import { map, Observable, observable, Subscription, tap } from 'rxjs';
>>>>>>> merge
import { User, UserI } from 'src/app/models/user.models';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user2! : UserI;
  user? : UserI;
<<<<<<< HEAD
  //user? : Observable<User>;
  constructor(private userService: UserService, private router: Router, private route : ActivatedRoute) { }
  id! : number;
  imageUrl? : string;
=======
  currentProfile? : Boolean;
  //user? : Observable<User>;
  constructor(private userService: UserService, private router: Router, private route : ActivatedRoute, private token : TokenStorageService) { }
  id! : number;
  subscription! : Subscription;
>>>>>>> merge
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
    userList!: UserI[];
    userList2$!: Observable <UserI[]>;

  ngOnInit(): void {
<<<<<<< HEAD

    this.userList2$ =  this.route.data.pipe(
      map(data => data['userList']));
      this.userList2$.subscribe(
=======
    this.currentProfile = false;
    this.userList2$ =  this.route.data.pipe(
      map(data => data['userList']));
      this.subscription = this.userList2$.subscribe(
>>>>>>> merge
        (data : any) => {
          console.log("data =",data);
          this.userList = data;
        },
        error => this.router.navigate([''])
        );
        this.id= Number( this.router.url.split('/')[2]);
        this.userService.changeUserList(this.userList);
<<<<<<< HEAD
        this.user = this.userService.getUserById(this.id);
=======
        
        try {
          this.user = this.userService.getUserById(this.id);
        } catch (error) {
          this.router.navigate(['error'])
        }
        if (this.id === this.token.getId() )
          this.currentProfile = true;
        /*if (this.user === null)
          this.router.navigate([''])*/
>>>>>>> merge
   

    

  }

<<<<<<< HEAD
=======
  ngOnDestroy() : void
  {
    this.subscription.unsubscribe;
  }

>>>>>>> merge
}
