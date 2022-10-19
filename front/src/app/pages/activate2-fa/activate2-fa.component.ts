import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Secret } from 'src/app/models/secret.models';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-activate2-fa',
  templateUrl: './activate2-fa.component.html',
  styleUrls: ['./activate2-fa.component.css']
})
export class Activate2FaComponent implements OnInit {

  Secret!: Secret;
  FaForm: FormGroup = this.fb.group({
    codeFa: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")]),
        });
  subscription! : Subscription;

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.subscription =this.userService.GetSecretFa().subscribe(
      (data : any) => {
        this.Secret = data;
      },
      );
  }

  ngOnDestroy() : void
  {
    this.subscription.unsubscribe;
  }

  ActivateFa(): void {
    if (this.FaForm.valid)
    {
      // this.userService.ActivateFacode(this.FaForm.controls["codeFa"].getRawValue());
      this.userService.ActivateFacode(this.FaForm.controls["codeFa"].getRawValue()).subscribe
      (
        (data : any) => {
           console.log("data =",data);
        },
        );
    }
  }

  RegenerateSecret(): void {
    this.userService.RegenerateSecretFa().subscribe(
      (data : any) => {
         console.log("data =",data);
        //this.ob = data;
      },
      //error => this.router.navigate([''])
      );
  }

}
