import { EnvironmentInjector, Injectable } from "@angular/core";
import { UserI } from "src/app/models/user.models";
import { TokenStorageService } from "../auth/token.storage";
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable()
export class CurrentUserService {
    user! : Observable<UserI>;
    subscription!: Subscription;
    private backUrl = 'http://' + environment.host + ':3000/api/v1/';

    constructor(private token : TokenStorageService, private http : HttpClient)
    {
        if (this.token.getToken())
        {
                this.user = this.getCurrentUserFromBack();
        }
    }

    initOrActualizeConnection(): void
    {
        if (this.token.getToken())
        {
                this.user = this.getCurrentUserFromBack();
        }
    }

    getCurrentUser(): Observable<UserI> | undefined
    {
        return this.user;
    }

    getCurrentUserFromBack(): Observable<UserI>
    {
      return this.http.get<UserI>(this.backUrl + "user/me", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
    }
}