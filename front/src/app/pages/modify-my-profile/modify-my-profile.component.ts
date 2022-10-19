import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
<<<<<<< HEAD
import { map, Observable } from 'rxjs';
=======
import { map, Observable, Subscription } from 'rxjs';
import { Secret } from 'src/app/models/secret.models';
>>>>>>> merge
import { UserI } from 'src/app/models/user.models';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-modify-my-profile',
  templateUrl: './modify-my-profile.component.html',
  styleUrls: ['./modify-my-profile.component.css']
})
export class ModifyMyProfileComponent implements OnInit {

  userList!: UserI[];
  userList2$!: Observable <UserI[]>;
<<<<<<< HEAD
  user! : UserI;
  id? : number | null;
  name? : string ;

      changeEmailForm: FormGroup = this.fb.group({
        email: new FormControl(null, [Validators.required, Validators.email]),
        });
      changeDisplaynameForm: FormGroup = this.fb.group({
          displayname: new FormControl(null, [Validators.required]),
          });
      changeAvatar_urlForm: FormGroup = this.fb.group({
        avatar_url: new FormControl(null, [Validators.required]),
            });

            ChangeForm!: FormGroup/* = this.fb.group({
              email: new FormControl(null, [Validators.required, Validators.email]),
              password: new FormControl(null, [Validators.required]),
              descritpion: new FormControl(null, [Validators.required]),
              displayname: new FormControl(null, [Validators.required]),
              avatar_url: new FormControl(null, [Validators.required]),
              });*/



  constructor(private fb: FormBuilder, private token : TokenStorageService, private userService: UserService, private jwtHelper : JwtHelperService, private route : ActivatedRoute, private router: Router ) 
  {

   
      }
=======
  Secret!: Secret;
  user! : UserI;
  id? : number | null;

  ChangeDisplaynameForm!: FormGroup;

  ChangeAvatar_UrlForm!: FormGroup 

  FaForm: FormGroup = this.fb.group({
    codeFa: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")])
                    });

  subscription! : Subscription;

  constructor(private fb: FormBuilder, private token : TokenStorageService, private userService: UserService, private jwtHelper : JwtHelperService, private route : ActivatedRoute, private router: Router ) 
  {}
>>>>>>> merge
    
  

  ngOnInit(): void {
    this.userList2$ =  this.route.data.pipe(
      map(data => data['userList']));
<<<<<<< HEAD
      this.userList2$.subscribe(
=======
      this.subscription = this.userList2$.subscribe(
>>>>>>> merge
        (data : any) => {
          // console.log("data =",data);
          this.userList = data;
        },
        error => this.router.navigate([''])
        );
<<<<<<< HEAD
      this.userService.changeUserList(this.userList);
      this.id = this.token.getId();
      if (this.id)
      {
        this.user = this.userService.getUserById(this.id);
      }
        if (this.user)
        {
          //this.name = JSON.parse(this.user.email)
          this.ChangeForm = this.fb.group({
            email: new FormControl(this.user.email, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
            displayname: new FormControl(this.user.displayname, [Validators.required]),
            avatar_url: new FormControl(this.user.avatar_url, [Validators.required]),
            });
        }
  }

  onSubmit(): void {
    if (this.ChangeForm.valid)
    {
      null;
    }
  }

  changeEmail(): void{

  }
  changeDisplayname(): void{

  }
  changeAvatar_url(): void{
=======
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
  }
  
  ngOnDestroy() : void
  {
    this.subscription.unsubscribe;
  }


  ChangeDisplayName(): void {
    if (this.ChangeDisplaynameForm.valid)
    {
      this.user.displayname = this.ChangeDisplaynameForm.controls['displayname'].getRawValue();
      if (this.id)
        this.userService.ChangeDbInformation(this.id, this.user).subscribe(
          (data : any) => {
            console.log("data =",data);
            },
            //error => this.router.navigate([''])
          );
    }
  }



  DesactivateFa(): void {
    this.userService.DesactivateFacode(this.FaForm.controls["codeFa"].getRawValue()).subscribe(
      (data : any) => {
         console.log("data =",data);
        //this.ob = data;
      },
      //error => this.router.navigate([''])
      );
  }
  

  ChangeAvatar_url(): void{
>>>>>>> merge

  }
}
