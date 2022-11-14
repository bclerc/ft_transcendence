import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorageService } from './services/auth/token.storage';
import { UserService } from './services/user/user.service';
import { User } from './models/user.models';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor (
//                 private token: TokenStorageService,
//                 private router: Router,
//                 private snackBar: MatSnackBar,
//                 private userService : UserService,
//                 private jwt : JwtHelperService,
//                 // public  navbar : 
//               ) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     const token = this.token.getToken();
//     this.userService.isUserAuthentificated().pipe();
//     if (token && this.jwt.decodeToken(token)) {
//       return true;
//     } else {
//       this.snackBar.open("Vous devez vous connecter", 'Undo', {
//         duration: 3000
//       })
//       this.router.navigateByUrl('');
//       return false;
//     }
//   }
// }

// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';


@Injectable({
 providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

 constructor  ( 
                private userService: UserService,
                private router: Router
              ) { }

 public canActivate(): Observable<boolean> {
   return this.userService.isUserAuthentificated().pipe(map(isAuth => {
     if (!isAuth) {
      //  this.userService.setRedirectUrl(this.router.url);
      // this.router.navigate(['']);
     }
     return isAuth;
   }));
 }
}