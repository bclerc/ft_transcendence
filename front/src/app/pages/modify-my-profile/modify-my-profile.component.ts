import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable, Subscription } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-modify-my-profile',
  templateUrl: './modify-my-profile.component.html',
  styleUrls: ['./modify-my-profile.component.css']
})
export class ModifyMyProfileComponent implements OnInit {

  userList!: UserI[];
  userList2$!: Observable <UserI[]>;
  user! : UserI;
  id? : number | null;
  userLi!: Observable <UserI> | undefined;



  ChangeDisplaynameForm!: FormGroup;

  ChangeAvatar_UrlForm!: FormGroup;

  FaForm: FormGroup = this.fb.group({
    codeFa: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")])
                    });

  subscription! : Subscription;

  constructor(private fb: FormBuilder, private token : TokenStorageService, private userService: UserService, private jwtHelper : JwtHelperService, private route : ActivatedRoute, private router: Router
    , public currentUser : CurrentUserService) 
  {}
    
  

  ngOnInit(): void{
    this.userList2$ =  this.route.data.pipe(
      map(data => data['userList']));
      this.subscription = this.userList2$.subscribe(
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
    if (this.user)
    {
      this.ChangeDisplaynameForm = this.fb.group({
        displayname: new FormControl(this.user.displayname, [Validators.required]),
        });
      this.ChangeAvatar_UrlForm = this.fb.group({
        avatar_url: new FormControl(this.user.avatar_url, [Validators.required]),
        });
    }


    /*this.userLi = this.currentUser.getCurrentUser();
    if (this.userLi)
    {
      await this.userLi.subscribe(
      (data : any) => {
        //console.log("data =",data);
        this.user = data;
      },
      //error => this.router.navigate([''])
      );
      console.log("coucoucocuou,");
      // console.log(this.user.displayname);
        this.ChangeDisplaynameForm = this.fb.group({
          displayname: new FormControl(this.user.displayname, [Validators.required]),
          });
        this.ChangeAvatar_UrlForm = this.fb.group({
          avatar_url: new FormControl(this.user.avatar_url, [Validators.required]),
          });
    }*/

  }
  
  ngOnDestroy() : void
  {
    //this.subscription.unsubscribe;
  }

  /*await getInfo()
  {
    if (this.user)
    {
    this.ChangeDisplaynameForm = this.fb.group({
      displayname: new FormControl(this.user.displayname, [Validators.required]),
      });
    this.ChangeAvatar_UrlForm = this.fb.group({
      avatar_url: new FormControl(this.user.avatar_url, [Validators.required]),
      });
    }
  }*/
  ChangeDisplayName(): void {
    if (this.ChangeDisplaynameForm.valid)
    {
      this.user.displayname = this.ChangeDisplaynameForm.controls['displayname'].getRawValue();
      if (this.id)
        this.userService.ChangeDbInformation(this.user).subscribe(
          (data : any) => {
            console.log("changedb =",data);
            },
            //error => this.router.navigate([''])
          );
    }
  }


  DesactivateFa(): void {
    this.userService.DesactivateFacode().subscribe(
      (data : any) => {
         console.log("data =",data);
         location.reload();
        //this.ob = data;
      },
      //error => this.router.navigate([''])
      );
  }
  


}
