import { Component, OnInit, Output, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { UserService } from 'src/app/services/user/user.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-modify-my-profile',
  templateUrl: './modify-my-profile.component.html',
  styleUrls: ['./modify-my-profile.component.css']
})
export class ModifyMyProfileComponent implements OnInit {
  @Output() user! : UserI;

  // user! : UserI;
  ChangeDisplaynameForm!: FormGroup;
  ChangeAvatar_UrlForm!: FormGroup;
  FaForm: FormGroup = this.fb.group({
    codeFa: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")])
                    });


  constructor ( 
                private fb: FormBuilder,
                private token : TokenStorageService,
                private userService: UserService,
                private route : ActivatedRoute,
                private router: Router, 
                public currentUser : CurrentUserService,
                private snackBar : MatSnackBar,
                private dialogRef: MatDialogRef<ModifyMyProfileComponent>,
                @Inject(MAT_DIALOG_DATA) data : any
              ) 
              {
                this.user = data.user;
              }
    
  

  ngOnInit(): void{
      // console.log(this.user);
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
  }

  ChangeDisplayName(): void {
    if (this.ChangeDisplaynameForm.valid)
    {
      this.user.displayname = this.ChangeDisplaynameForm.controls['displayname'].getRawValue();
      this.userService.ChangeDbInformation(this.user).subscribe(
          (data : any) => 
          {
            this.snackBar.open("Changement de pseudo confirmé", 'Undo')
          },
          (error : any) => 
          {
            if (error.error.message === "displayname already used")
            {
              this.snackBar.open("Le pseudo est deja utilisé", 'Undo', 
              {
                duration: 3000
              })
            }
          }
        );
    }
  }


  DesactivateFa(): void {
    this.userService.DesactivateFacode().subscribe(
      (data : any) => {
        //  console.log("data =",data);
        //this.ob = data;
      },
      //error => this.router.navigate([''])
      );
  }

  
  close() {
    this.dialogRef.close();
}
show : Boolean = false;
showActivate2Fa(): void{
  this.show = true;
}

hideActivate2Fa(): void {
  this.show = false;
}
  ChangeAvatar_url(): void{
  }
}
