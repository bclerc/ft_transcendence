import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HeaderService } from './services/user/header.service';

@Injectable(/*{
    providedIn: 'root'
  }*/)
export class HttpErrorInterceptor implements HttpInterceptor {
    
    constructor (
                  private snackBar : MatSnackBar,
                  private router : Router,
                  public  navbar : HeaderService
                ) {}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(2),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';

            if (error.status === 401 && error.error.message === "2FA_REQUIRED")
            {
              this.snackBar.open("une connexion 2FA est demandée", 'X', {
                duration: 3000
              })
              errorMessage = error.error.message;
              this.router.navigate(['code'])
            }
            else if (error.status === 409 && error.error.message === "displayname already used")
            {
              errorMessage = error.error.message;
              this.snackBar.open("Le pseudo est deja utilisé", 'X', 
              {
                duration: 3000
              })
            }
            else if (error.status === 401 && error.error.message === "Invalid 2FA code"){
              errorMessage = error.error.message;
              this.snackBar.open("Invalid 2FA code", 'X', 
              {
                duration: 3000
              })
            }
            else if (error.status === 401 && error.error.message === "Wrong authentication code"){
              errorMessage = error.error.message;
              this.snackBar.open("Wrong authentication code", 'X', 
              {
                duration: 3000
              })
            }
            else if (error.status === 401)
            {              
              errorMessage = error.error.message;
              this.snackBar.open("Vous devez connectez", 'X', 
              {
                duration: 3000
              })
              this.navbar.hide();
              this.router.navigate([''])
            }
            else
            {
              errorMessage = error.error.message;
            }
          return throwError(errorMessage);
                })
            )
    }
}