import { Component, Injectable, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetTokenComponent } from './get-token/get-token.component';
import { AuthGuard } from './guard';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPagesComponent } from './pages/login-pages/login-pages.component';
import { ModifyMyProfileComponent } from './pages/modify-my-profile/modify-my-profile.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { PlayFunPongPagesComponent } from './pages/play-fun-pong-pages/play-fun-pong-pages.component';
import { PlayPongPagesComponent } from './pages/play-pong-pages/play-pong-pages.component';
import { PlayRankedPongPagesComponent } from './pages/play-ranked-pong-pages/play-ranked-pong-pages.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UserResolver } from './resolver';
import { UnfoundPagesComponent } from './unfound-pages/unfound-pages.component';




const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginPagesComponent },
  { path: 'register', component: RegisterPageComponent },
  //{ path: 'myprofile', component: ProfilePageComponent },
  { path: 'login/:id', component: GetTokenComponent},
  { path: 'playpong', component: PlayPongPagesComponent, canActivate: [AuthGuard] }, 
  { path: 'playpong/ranked', component: PlayRankedPongPagesComponent, canActivate: [AuthGuard]  },
  { path: 'playpong/fun', component: PlayFunPongPagesComponent, canActivate: [AuthGuard]  },
  { path: 'chat', component: ChatPageComponent, canActivate: [AuthGuard]  },
  { path: 'myprofile', component: MyProfileComponent, canActivate: [AuthGuard], resolve: { userList: UserResolver } },
  { path: 'modifymyprofile', component: ModifyMyProfileComponent, canActivate: [AuthGuard], resolve: { userList : UserResolver } },
  { path: 'profile/:id', component: ProfilePageComponent, canActivate: [AuthGuard], resolve: { userList : UserResolver } },
  { path: '**', component: UnfoundPagesComponent },

  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
