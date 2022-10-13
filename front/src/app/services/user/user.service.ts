import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { UserListComponent } from 'src/app/user-list/user-list.component';
import { __values } from 'tslib';
import { User, UserI } from '../../models/user.models';
import { TokenStorageService } from '../auth/token.storage';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class UserService {
    /*userMap? : Observable<Map<number, User>>;
    userList2!: User[];*/
    userList2$!: Observable <UserI[]>;
    userList!: UserI[];


      
    constructor(private route: ActivatedRoute ,private http : HttpClient, private token : TokenStorageService, private jwtService : JwtHelperService, private router : Router
        )
    {
      /*this.userList2$ =  this.route.data.pipe(
        map(data => data['userList']));
        this.userList2$.subscribe(
          (data : any) => {
            console.log("data =",data);
            this.userList = data;
          },
          error => this.router.navigate([''])
          );*/
       /*this.route.data.subscribe(
        (data : any) => {
          console.log("data usersevice = ", data);
          this.userList = data;
        },
        error => this.router.navigate([''])
        );*/

        /*this.getDataUserListFromBack().subscribe(
            (data : any) => {
              console.log(data);
              this.userList = data;
            },
            error => this.router.navigate([''])
            );*/
      //console.log("userlist = ", this.userList);

        //this.getDataUserListFromBack().subscribe(userList2 => this.userList2 = userList2);

        //this.userList2 = this.getDataUserListFromBack().subscribe(value => console.log(value));
        //console.log(this.userList2);

        /*this.getDataUserListFromBack().subscribe(data => {
            this.userList2 = data;
        });*/
        //console.log (this.userList[1]);
        // this.getDataUserListFromBack().subscribe(value => console.log(value));
        
        /*var datas = this.getDataUserListFromBack();
        for (var i = 0; i < datas(); i++)
        {

        }
        */
        /*datas.subscribe(value => console.log(`datas = ${value[1]}`));
        console.log("datas = ", datas);
        var yolo = this.getDataUserListFromBack().subscribe({next: value => {return value}});
        console.log("yolo = ", yolo);
        var abc = this.getDataUserListFromBack();
        abc.subscribe(value => console.log(`abc = ${value[1].email}`));
*/
        //for (var i = 0; i < value.length())
       // this.getDataUserListFromBack().pipe(first()).subscribe(users => this.userList[1] = users);
        //this.userList = this.getDataUserListFromBack().pipe;
    }
    ngOnInit(): void {
      //console.log("userlist = ", this.userList);

           /*  this.route.data.subscribe(
        (data : any) => {
          console.log(data);
          this.userList = data;
        },
        error => this.router.navigate([''])
        );*/
        /*this.getDataUserListFromBack().subscribe(
            (data : any) => {
              console.log(data);
              this.userList = data;
            },
            error => this.router.navigate([''])
            );*/
          
    }

    ngOnDestroy(): void{
      /*this.route.data.unsubscribe(

        );*/
        //console.log("coucou il faut me destroy");
    }

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
        /*for(let idx =0; idx; idx++) {
            console.log(`Element at index ${idx} is ${fruits[idx]}`);  
        }*/

     }
    
    /*options: {
        headers?: HttpHeaders | {[header: string]: string | string[]},
        observe?: 'body' | 'events' | 'response',
        params?: HttpParams|{[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>},
        reportProgress?: boolean,
        responseType?: 'arraybuffer'|'blob'|'json'|'text',
        withCredentials?: boolean,
      }*/
    /*getUserIdFromBack(id : number): Observable<User>
    {
        //var i =  "http://localhost:3000/api/v1/user/" + id;
        //id = 2;
        return this.http.get('/api/users/' + id).pipe(map((user : User) => user));
        

       // http://localhost:3000/api/v1/user/:id
    }*/

    /*async*/ getUserIdFromBack(id: number): /*Promise <*/Observable<UserI>/*>*/ {
        //return this.http.get("http://localhost:3000/api/v1/user/" + id, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()}).pipe(map((user:UserI) => user));
         return this.http.get<UserI>("http://localhost:3000/api/v1/user/" + id, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
        //return this.http.get<UserI>("http://localhost:3000/api/v1/user/" + id );

        //return this.http.get("http://localhost:3000/api/v1/user/" + id).pipe(map((user : UserI) => user));
        
      }
    getDataUserListFromBack(): Observable<UserI[]>
    {
       /* const headersg = new HttpHeaders({
            //'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1R3b0ZhY3RvckF1dGhlbnRpY2F0ZSI6ZmFsc2UsInN1YiI6MSwiaWF0IjoxNjYxMTc0MjEzLCJleHAiOjE2NjEyNjA2MTN9.Tk7ZhnoNOOZnnjWXH2YKbuk3X32Xwv-EGvrHNY2tWWw',
          })*/
        //.set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1R3b0ZhY3RvckF1dGhlbnRpY2F0ZSI6ZmFsc2UsInN1YiI6MSwiaWF0IjoxNjYxMTc0MjEzLCJleHAiOjE2NjEyNjA2MTN9.Tk7ZhnoNOOZnnjWXH2YKbuk3X32Xwv-EGvrHNY2tWWw')
        //.set('Access-Control-Allow-Origin', '*');
       //return this.http.get<UserListComponent>("http://localhost:3000/api/v1/user/", {headers: new HttpHeaders('Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1R3b0ZhY3RvckF1dGhlbnRpY2F0ZSI6ZmFsc2UsInN1YiI6MSwiaWF0IjoxNjYxMTc0MjEzLCJleHAiOjE2NjEyNjA2MTN9.Tk7ZhnoNOOZnnjWXH2YKbuk3X32Xwv-EGvrHNY2tWWw')});
        return this.http.get<User[]>("http://localhost:3000/api/v1/user/", {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
    }

    ChangeDbInformation(id: number, user : UserI): Observable<any>
    {
      //console.log("coucou");
       return this.http.put<Observable<any>>("http://localhost:3000/api/v1/user/" + id, user, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
    }

    ActivateFacode(code : number) : Observable<any>
    {
      return this.http.post<Observable<any>>("http://localhost:3000/api/v1/auth/2fa/enable",{"twoFactorAuthenticationCode" : "038712",}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
    }

    ValidateFaCode():Observable<any>
    {
      return this.http.post<Observable<any>>("http://localhost:3000/api/v1/auth/2fa",{"twoFactorAuthenticationCode" : "955186",}, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})});
    }

    FindByName(name : string): Observable<UserI[]>
    {
        return this.http.get<User[]>("http://localhost:3000/api/v1/user/search/" + name, {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.token.getToken()})})/*.pipe(catchError())*/;
    }
}
