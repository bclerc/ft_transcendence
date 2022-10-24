import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, observable, Subscription, tap } from 'rxjs';
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
  //user? : Observable<User>;
  constructor(private userService: UserService, private router: Router, private route : ActivatedRoute, private token : TokenStorageService) { }
  id! : number;
  subscription! : Subscription;
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
    this.id= Number( this.router.url.split('/')[2]);
    this.userService.changeUserList(this.userList);
    
    /*try {
      this.user = this.userService.getUserById(this.id);
    } catch (error) {
      this.router.navigate(['error'])
    }*/
    this.subscription = this.userService.getUserIdFromBack(this.id).subscribe(
      (data : any) => {
        console.log("data =",data);
        this.user = data;
      },
      error => this.router.navigate([''])
      );
      if (this.id === this.token.getId() )
        this.router.navigate(['/myprofile']);
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

  ngOnDestroy() : void
  {
    this.subscription.unsubscribe;
  }

}
