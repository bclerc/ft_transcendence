import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorageService } from './services/auth/token.storage';
import { UserService } from './services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor ( 
                private token: TokenStorageService,
                private router: Router,
                private snackBar: MatSnackBar,
                private userService : UserService,
                private jwt : JwtHelperService,
              ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.token.getToken();
    this.userService.isUserAuthentificated().subscribe(
      (data : any) =>{
      }
    )
    if (token)
    {
        if (this.jwt.isTokenExpired(token))
        {
          this.token.removeToken();
          this.snackBar.open("Le token est périmée", 'Undo', {
          duration: 3000
        })
          return false;
        }
        return  true
    }
    else
    {
      this.token.removeToken();
      this.snackBar.open("Vous devez vous connecter", 'Undo', {
        duration: 3000
      })
      return false;
    }
  }

}

