import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { FriendsRequestAction } from 'src/app/models/friends/friendsrequest.enum';
import { Secret } from 'src/app/models/secret.models';
import { UserListComponent } from 'src/app/user-list/user-list.component';
import { environment } from 'src/environments/environment';
import { __values } from 'tslib';
import { User, UserI } from '../../models/user.models';
import { TokenStorageService } from '../auth/token.storage';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class UserService {
  userList!: UserI[];
  private backUrl = 'http://localhost:3000/api/v1/';
      
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
      return this.http.get<UserI>("http://"+ environment.host +":3000/api/v1/user/me", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
    }
    throw new Error('No token');
  }

  changeUserList(tab: UserI[]): void
  {
    this.userList = tab;
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

  
  getUserIdFromBack(id: number): Observable<UserI | undefined>
  {
    return this.http.get<UserI | undefined>("http://"+ environment.host +":3000/api/v1/user/" + id, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  getDataUserListFromBack(): Observable<UserI[]>
  {
    return this.http.get<User[]>("http://"+ environment.host +":3000/api/v1/user/", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  ChangeDbInformation(id: number, user : UserI): Observable<any>
  {
    return this.http.put<Observable<any>>("http://"+ environment.host +":3000/api/v1/user/" + id, user, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  ActivateFacode(code : string) : Observable<any>
  {
    return this.http.post<Observable<any>>("http://"+ environment.host +":3000/api/v1/auth/2fa/enable3",{"twoFactorAuthenticationCode" : code}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  DesactivateFacode(code : string) : Observable<any>
  {
    return this.http.get<Observable<any>>("http://"+ environment.host +":3000/api/v1/auth/2fa/disable", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  ValidateFaCode(code : number):Observable<any>
  {
    return this.http.post<Observable<any>>("http://"+ environment.host +":3000/api/v1/auth/2fa",{"twoFactorAuthenticationCode" : code}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  GetSecretFa(): Observable<Secret>
  {
    return this.http.get<Secret>("http://"+ environment.host +":3000/api/v1/auth/2fa/secret", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  RegenerateSecretFa(): Observable<Secret>
  {
    return this.http.post<Secret>("http://"+ environment.host +":3000/api/v1/auth/2fa/reset", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  FindByName(name : string): Observable<UserI[]>
  {
      return this.http.get<UserI[]>("http://"+ environment.host +":3000/api/v1/user/search/" + name, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  getFriends(): Observable<UserI[]>
  {
      return this.http.get<UserI[]>("http://"+ environment.host +":3000/api/v1/user/friends/get", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  getFriendRequests(): Observable<any[]>
  {
      return this.http.get<any>("http://"+ environment.host +":3000/api/v1/user/friends/panding", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  acceptFriendRequest(id: number)
  {
    return this.http.get("http://"+ environment.host +":3000/api/v1/user/friends/accept/" + id, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  declineFriendRequest(id: number)
  {
    return this.http.get("http://"+ environment.host +":3000/api/v1/user/friends/decline/" + id, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  removeFriend(userId: number)
  {
    return this.http.get("http://"+ environment.host +":3000/api/v1/user/friends/remove/" + userId, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;

  }

  respondFriendRequest(requestId: number, accept: FriendsRequestAction)
  {
    return this.http.post("http://"+ environment.host +":3000/api/v1/user/friends", {requestId: requestId, action: accept}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  sendRequest(userId: number)
  {
    return this.http.post("http://"+ environment.host +":3000/api/v1/user/friends/request", {toId: userId}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  
}