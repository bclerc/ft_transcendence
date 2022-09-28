import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidator } from '../urila/custom-validators';
import { UserService } from '../user.service';
import { tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

form: FormGroup = new FormGroup({
  email: new FormControl(null, [Validators.email, Validators.required]),
  displayname: new FormControl(null, [Validators.required]),
  password: new FormControl(null, [Validators.required])
});

  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  register() {
    if (this.form.valid) {
      this.userService.create(this.form.value).pipe(
        tap(() => this.router.navigate(['../login']))
      ).subscribe();
    }
  }


  get email(): FormControl
  {
    return this.form.get('email') as FormControl;
  }

  get displayname(): FormControl
  {
    return this.form.get('displayname') as FormControl;
  }

  get password(): FormControl
  {
    return this.form.get('password') as FormControl;
  }

  get passwordConfirm(): FormControl
  {
    return this.form.get('passwordConfirm') as FormControl;
  }

}
