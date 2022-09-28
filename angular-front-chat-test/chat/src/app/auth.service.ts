import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { UserI } from './model/user.interface';
import { catchError, tap } from 'rxjs/operators';

export interface LoginResponseI {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  login(user: any): Observable<LoginResponseI> {
    return this.http.post<LoginResponseI>('http://localhost:3000/api/v1/auth/login', user).pipe(
      tap((res: LoginResponseI) => localStorage.setItem('trans', res.access_token)),
      tap(() => this.snackbar.open('Login Successfull', 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      })),
      catchError(e => {
        this.snackbar.open(`Login failed: ${e.error.message}`, 'Close', {
          duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
        })
        return throwError(e);
      })
    );
    }

  // Auth with 42 api
  // Open a pop-pup with the url http://localhost:3000/api/v1/auth/42
  // wait for the user to login on signin.42.fr and get the token from 
  // the url http://localhost:3000/api/v1/auth/42/callback
  // save the token in localStorage
  // close pop-up

  login42() {
    
  }}