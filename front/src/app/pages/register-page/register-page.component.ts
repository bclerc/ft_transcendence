import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  constructor(/*private authService: AuthService*/ ) {}
  
  //@Input() user!: User;

  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    displayname: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
    });

  ngOnInit(): void {
  }
  onSubmit(): void {
     /*this.user.email = this.registerForm.get('email')!.value;
     this.user.username = this.registerForm.get('displayname')!.value;
		 this.user.password = this.registerForm.get('password')!.value;
     this.authService.register(this.user);*/
  }

}
