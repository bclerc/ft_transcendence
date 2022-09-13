import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserI } from './models/user.models';
import { UserService } from './services/user/user.service';

@Injectable()
export class UserResolver implements Resolve<UserI[]> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable <UserI[]> {
    //console.log("solver : ",this.userService.getUserListSolve());
    return this.userService.getUserListSolve(); 
}
}