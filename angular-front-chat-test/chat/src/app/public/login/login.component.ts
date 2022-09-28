import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, SelectMultipleControlValueAccessor, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) { }
  
  login() {
    this.authService.login({
      email: this.email.value,
      password: this.password.value
    }).pipe(
      tap(() => this.router.navigate(['../../private/dashboard']))
    ).subscribe()
  }
  
  async login42() {
    window.location.href = 'http://localhost:3000/api/v1/auth/42'; 
  }

  async marcus42() {
    window.location.href = 'http://localhost:3000/api/v1/auth/debug/marcus'; 
  }
  
  ngOnInit(): void {
  }
  get email(): FormControl
  {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl
  {
    return this.form.get('password') as FormControl;
  }
}
