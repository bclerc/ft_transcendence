import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(private jwtHelper: JwtHelperService) { }
  signOut(): void {
    window.localStorage.clear();
  }
  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }
  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
  public getId(): number | null{
    const tokenString = this.getToken();
    if (tokenString)
      return this.jwtHelper.decodeToken(tokenString).sub;
    return null;
  }
  public is2FaEnabled(): boolean{
    const tokenString = this.getToken();
    if (tokenString)
      return this.jwtHelper.decodeToken(tokenString).twoFactorEnabled;
    return false;
  }
  public removeToken(): void
  {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}
