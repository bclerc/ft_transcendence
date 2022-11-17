import { isPlatformServer, } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { FriendsRequestAction } from 'src/app/models/friends/friendsrequest.enum';
import { Secret } from 'src/app/models/secret.models';
import { environment } from 'src/environments/environment';
import { __values } from 'tslib';
import { User, UserI } from '../../models/user.models';
import { TokenStorageService } from '../auth/token.storage';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class UserService {
  userList!: UserI[];

  private backUrl = 'http://'+ environment.host +':3000/api/v1/';

  constructor ( private route: ActivatedRoute,
                private http : HttpClient,
                private token : TokenStorageService,
                private jwtService : JwtHelperService,
                private router : Router,
                @Inject(PLATFORM_ID) private platformId: any,
                @Optional() @Inject(Request) private request: any
              )
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
      return this.http.get<UserI>(this.backUrl + "user/me", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
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
    return this.http.get<UserI | undefined>(this.backUrl + "user/" + id, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  getDataUserListFromBack(): Observable<UserI[]>
  {
    return this.http.get<User[]>(this.backUrl + "user/", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  ChangeDbInformation(user : UserI): Observable<any>
  {
    return this.http.put<Observable<any>>(this.backUrl + "user", user, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  ActivateFacode(code : string) : Observable<any>
  {
    return this.http.post<Observable<any>>(this.backUrl + "auth/2fa/enable",{"twoFactorAuthenticationCode" : code}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  DesactivateFacode() : Observable<any>
  {
    return this.http.get<Observable<any>>(this.backUrl + "auth/2fa/disable", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  ValidateFaCode(code : number):Observable<any>
  {
    return this.http.post<Observable<any>>(this.backUrl + "auth/2fa",{"twoFactorAuthenticationCode" : code}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  GetSecretFa(): Observable<Secret>
  {
    return this.http.get<Secret>(this.backUrl + "auth/2fa/secret", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  RegenerateSecretFa(): Observable<Secret>
  {
    return this.http.post<Secret>(this.backUrl + "auth/2fa/reset", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
  }

  FindByName(name : string): Observable<UserI[]>
  {
      return this.http.get<UserI[]>(this.backUrl + "user/search/" + name, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  getFriends(): Observable<UserI[]>
  {
      return this.http.get<UserI[]>(this.backUrl + "user/friends/get", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  getFriendRequests(): Observable<any[]>
  {
      return this.http.get<any>(this.backUrl + "user/friends/panding", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  acceptFriendRequest(id: number)
  {
    return this.http.get(this.backUrl + "user/friends/accept/" + id, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  declineFriendRequest(id: number)
  {
    return this.http.get(this.backUrl + "user/friends/decline/" + id, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  removeFriend(userId: any)
  {
    return this.http.get(this.backUrl + "user/friends/remove/" + userId, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;

  }

  respondFriendRequest(requestId: number, accept: FriendsRequestAction)
  {
    return this.http.post(this.backUrl + "user/friends", {requestId: requestId, action: accept}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  sendRequest(userId: number)
  {
    return this.http.post(this.backUrl + "user/friends/request", {toId: userId}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  uploadAvatar(avatar : any)
  {
    return this.http.post(this.backUrl + "user/avatar", avatar ,{headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  blockUser(Id: any)
  {
    return this.http.post(this.backUrl + "user/block/" + Id,  null, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  unBlockUser(Id: any)
  {
    return this.http.post(this.backUrl + "user/unblock/" + Id, null ,{headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

  isUserAuthentificated() : Observable<boolean>
  {
    return this.http.get<boolean>(this.backUrl + "user/good" , {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
  }

}