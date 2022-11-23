import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-send-code',
  templateUrl: './send-code.component.html',
  styleUrls: ['./send-code.component.css']
})
export class SendCodeComponent implements OnInit {
  FaForm: FormGroup = this.fb.group({
    Code: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")]),
    });
    tokenString! : string;

  constructor ( 
                private fb: FormBuilder,
                private user : UserService,
                private token : TokenStorageService,
                private router : Router
              ) { }


  ngOnInit(): void {
  }

  async onSubmit(){
    if (this.FaForm.valid)
    {
      await this.user.ValidateFaCode(this.FaForm.controls['Code'].getRawValue()).subscribe(
        (data : any) => {
          this.token.saveToken(data.access_token);
          this.router.navigate(["myprofile"]);
          //location.reload();
          //this.tokenString = data;
        },
        );
        

        //this.token.saveToken(this.tokenString);
        //location.reload()

    }

  }

}
