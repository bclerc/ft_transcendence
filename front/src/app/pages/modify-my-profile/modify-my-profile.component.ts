import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable, Subscription } from 'rxjs';
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
  ob!: Observable<any>;
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
              FaForm: FormGroup = this.fb.group({
                codeFa: new FormControl(null, [Validators.required]),
                    });
              subscription! : Subscription;




  constructor(private fb: FormBuilder, private token : TokenStorageService, private userService: UserService, private jwtHelper : JwtHelperService, private route : ActivatedRoute, private router: Router ) 
  {

   
      }
    
  

  ngOnInit(): void {
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
          //this.name = JSON.parse(this.user.email)
          this.ChangeForm = this.fb.group({
            email: new FormControl(this.user.email, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required]),
            description: new FormControl(this.user.description, [Validators.required]),
            displayname: new FormControl(this.user.displayname, [Validators.required]),
            avatar_url: new FormControl(this.user.avatar_url, [Validators.required]),
            });
        }
        /*if (this.id)
          this.userService.ChangeDbInformation(this.id).subscribe(
            (data : any) => {
              console.log("data =",data);
             //this.ob = data;
           },
          )
          this.userService.ValidateFaCode().subscribe
          (
            (data : any) => {
               console.log("data =",data);
              //this.ob = data;
            },
            //error => this.router.navigate([''])
            );*/
            /*console.log("coucuou");
          this.userService.ActivateFacode(1234123412341234).subscribe
          (
            (data : any) => {
               console.log("data =",data);
              //this.ob = data;
            },
            //error => this.router.navigate([''])
            );
          console.log("null");*/
  }
  
  ngOnDestroy() : void
  {
    this.subscription.unsubscribe;
  }


  onSubmit(): void {
    if (this.ChangeForm.valid)
    {
      //var yolo = this.ChangeForm.controls['displayname'];
      //if (yolo)
        this.user.displayname = this.ChangeForm.controls['displayname'].getRawValue();
        this.user.email = this.ChangeForm.controls['email'].getRawValue();
        this.user.description = this.ChangeForm.controls['description'].getRawValue();
        if (this.id)
          this.userService.ChangeDbInformation(this.id, this.user).subscribe
          (
            (data : any) => {
               console.log("data =",data);
              //this.ob = data;
            },
            //error => this.router.navigate([''])
            );
    }
  }

  ActivateFa(): void {
    if (this.FaForm.valid)
    {
      this.userService.ActivateFacode(this.FaForm.controls["codeFa"].getRawValue()).subscribe
      (
        (data : any) => {
           console.log("data =",data);
          //this.ob = data;
        },
        //error => this.router.navigate([''])
        );
    }
  }
  

  changeEmail(): void{

  }
  changeDisplayname(): void{

  }
  changeAvatar_url(): void{

  }
}
