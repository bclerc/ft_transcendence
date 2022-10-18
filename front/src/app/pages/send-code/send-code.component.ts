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
    Code: new FormControl(null, [Validators.required]),
    });
    tokenString! : string;

  constructor(private fb: FormBuilder, private user : UserService, private token : TokenStorageService, private router : Router) { }


  ngOnInit(): void {
  }

  onSubmit(): void{
    if (this.FaForm.valid)
    {
      this.user.ValidateFaCode(this.FaForm.controls['Code'].getRawValue()).subscribe(
        (data : any) => {
          console.log("data =",data);
          //this.tokenString = data;
        },
        error => this.router.navigate(['error'])
        );
        //this.token.saveToken(this.tokenString);
        this.router.navigate([''])

    }

  }

}
