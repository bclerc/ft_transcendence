import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Secret } from 'src/app/models/secret.models';
import { UserListComponent } from 'src/app/user-list/user-list.component';
import { __values } from 'tslib';
import { User, UserI } from '../../models/user.models';
import { TokenStorageService } from '../auth/token.storage';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class UserService {
  userList!: UserI[];
      
  constructor(private route: ActivatedRoute ,private http : HttpClient, private token : TokenStorageService, private jwtService : JwtHelperService, private router : Router)
  {}

  ngOnInit(): void 
  {}

  getLoggedUser(): Observable<UserI>
  {
    const token = this.token.getToken();
    if (token)
    {
      const decodedToken = this.jwtService.decodeToken(token);
      const userId = decodedToken.userId;
      return this.http.get<UserI>("http://localhost:3000/api/v1/user/me", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
    }
    throw new Error('No token');
  }

  changeUserList(tab: UserI[]): void
  {
    this.userList= tab;
  }

  getUserList():  UserI[] 
  {
    return this.userList;    
  }

  getUserListSolve():  Observable<UserI[]> 
  {
    return this.getDataUserListFromBack();
  }

  getUserById(id: number): UserI
  {
    var i = 0;
    while (this.userList[i])
    {
      if (id === this.userList[i].id )
        return this.userList[i];
      i++;
    }
    throw new Error('User not found!');
  }

  getUserIdFromBack(id: number): Observable<UserI>
  {
    return this.http.get<UserI>("http://localhost:3000/api/v1/user/" + id, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  getDataUserListFromBack(): Observable<UserI[]>
  {
    return this.http.get<User[]>("http://localhost:3000/api/v1/user/", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  ChangeDbInformation(id: number, user : UserI): Observable<any>
  {
    return this.http.put<Observable<any>>("http://localhost:3000/api/v1/user/" + id, user, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  ActivateFacode(code : string) : Observable<any>
  {
    return this.http.post<Observable<any>>("http://localhost:3000/api/v1/auth/2fa/enable3",{"twoFactorAuthenticationCode" : code}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  DesactivateFacode(code : string) : Observable<any>
  {
    return this.http.get<Observable<any>>("http://localhost:3000/api/v1/auth/2fa/disable", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  ValidateFaCode(code : number):Observable<any>
  {
    return this.http.post<Observable<any>>("http://localhost:3000/api/v1/auth/2fa",{"twoFactorAuthenticationCode" : code}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  GetSecretFa(): Observable<Secret>
  {
    return this.http.get<Secret>("http://localhost:3000/api/v1/auth/2fa/secret", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  RegenerateSecretFa(): Observable<Secret>
  {
    return this.http.post<Secret>("http://localhost:3000/api/v1/auth/2fa/reset", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }
}
