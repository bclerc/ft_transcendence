import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { HeaderComponent } from './header/header.component';
import { LoginPagesComponent } from './pages/login-pages/login-pages.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user-list/user-list.component';
import { PlayPongPagesComponent } from './pages/play-pong-pages/play-pong-pages.component';
import { PlayRankedPongPagesComponent } from './pages/play-ranked-pong-pages/play-ranked-pong-pages.component';
import { PlayFunPongPagesComponent } from './pages/play-fun-pong-pages/play-fun-pong-pages.component';
//
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { HttpClientModule } from '@angular/common/http';
import { GetTokenComponent } from './get-token/get-token.component';
import { UnfoundPagesComponent } from './unfound-pages/unfound-pages.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { ModifyMyProfileComponent } from './pages/modify-my-profile/modify-my-profile.component';
import { UserService } from './services/user/user.service';
import { UserResolver } from './resolver';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
// import { PongService } from './pages/play-pong-pages/play-pong-pages.component';

const config: SocketIoConfig = { url: 'http://localhost:4242', options: {} };

export function tokenGetter() {
  return localStorage.getItem("auth-token");
}
@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    LoginPagesComponent,
    UserComponent,
    UserListComponent,
    PlayPongPagesComponent,
    PlayRankedPongPagesComponent,
    PlayFunPongPagesComponent,
    ChatPageComponent,
    RegisterPageComponent,
    ProfilePageComponent,
    GetTokenComponent,
    UnfoundPagesComponent,
    MyProfileComponent,
    ModifyMyProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000']
      }
    }),
    SocketIoModule.forRoot(config)
    //
  ],
  providers: [
    UserService,
    UserResolver,
    // PongService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}

