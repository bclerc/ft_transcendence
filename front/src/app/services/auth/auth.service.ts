import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { UserService } from "../user/user.service";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from "src/app/models/user.models";
import { RegisterReply } from "src/app/models/register.reply";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    constructor(private http: HttpClient,
                private userService: UserService) { }
        
    /*login(): Observable<User>{
        return this.http.post<>;
    }*/

    /*login(): Observable<User>
    {
      return this.http.post<>;
    }*/
    
    /*register(user: User): Observable<RegisterReply>
    {
        return this.http.post<RegisterReply>('http://" + process.env.HOST  + ":3000/api/v1/user/', user).pipe();
    }*/
  }