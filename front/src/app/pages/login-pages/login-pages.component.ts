import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, Validators, ReactiveFormsModule, EmailValidator, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { RegisterReply } from 'src/app/models/register.reply';
import { UserService } from '../../services/user/user.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-login-pages',
  templateUrl: './login-pages.component.html',
  styleUrls: ['./login-pages.component.css']
})
export class LoginPagesComponent implements OnInit {


constructor(private userService: UserService, private fb: FormBuilder, private http: HttpClient ){ }

  
  loginForm: FormGroup = this.fb.group({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
    });
    


    /*loginForm: FormGroup = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
      });*/

      /*loginForm = this.fb.group({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required]),
        aliases: this.fb.array([
          this.fb.control('')
        ])
      });*/


      

  
  ngOnInit(): void {
    /*this.loginForm = this.fb.group({
      email: ['yolo'],
      password: ['yolo']
    });*/
    /*this.loginForm.patchValue({
      email: 'email',
      password: 'password'
    });*/
    //email: this.loginForm.setValue('email');
    //password: this.loginForm.setValue('password');
    //this.loginForm.setValue('');
  }

    onSubmit(): void {
      //this.mail = this.loginForm.value;
      console.log('donnee du fomulaire:', this.loginForm.value);
      //console.warn(this.loginForm.value);

      if (this.loginForm.valid)
      {
       // email: this.loginForm.get('email').value;
			 // password: this.loginForm.get('password').value;
      }
      else
      {
        return;
      }
      //mail = this.loginForm.get(this.loginForm.email);
    }

   
    
    
    loginvia42(): Observable<any>{
      console.log('loginvia42');
      return this.http.get<any>("http://localhost:3000/api/v1/auth/42");
      console.log('finished');
      //http://localhost:3000/api/v1/auth/42
    }
    /*get aliases() {
      return this.loginForm.get('aliases') as FormArray;
    }

    addAlias() {
      this.aliases.push(this.fb.control(''));
    }*/




}

/*loginForm: FormGroup = new FormGroup({
  email: new FormControl(null, [Validators.required, Validators.email]),
  password: new FormControl(null, [Validators.required])
  });*/





