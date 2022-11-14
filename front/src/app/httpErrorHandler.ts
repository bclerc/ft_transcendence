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

@Injectable(/*{
    providedIn: 'root'
  }*/)
export class HttpErrorInterceptor implements HttpInterceptor {
    
    constructor (
                  private snackBar : MatSnackBar,
                  private router : Router,
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
              this.snackBar.open("une connexion 2FA est demandée", 'Undo', {
                duration: 3000
              })
              errorMessage = error.error.message;
              this.router.navigate(['code'])
            }
            else if (error.status === 407 && error.error.message === "displayname already used")
            {
              errorMessage = error.error.message;
              this.snackBar.open("Le pseudo est deja utilisé", 'Undo', 
              {
                duration: 3000
              })
            }
            else
            {
              errorMessage = "An error occured";
              this.router.navigate([''])
            }
                    
            // console.log(errorMessage);
            return throwError(errorMessage);
                })
            )
    }
}