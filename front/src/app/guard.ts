import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from './services/auth/token.storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private token: TokenStorageService,
              private router: Router,
              private snackBar: MatSnackBar) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.token.getToken();
    if (token) {
      return true;
    } else {
      this.snackBar.open("Vous devez vous connecter", 'Undo', {
        duration: 3000
      })
      this.router.navigateByUrl('');
      return false;
    }
  }
}