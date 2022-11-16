import { Component, Injectable, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetTokenComponent } from './pages/get-token/get-token.component';
import { AuthGuard } from './guard';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { PlayPongPagesComponent } from './pages/play-pong-pages/play-pong-pages.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { Activate2FaComponent } from './pages/activate2-fa/activate2-fa.component';
import { UnfoundPagesComponent } from './unfound-pages/unfound-pages.component';
import { SendCodeComponent } from './pages/send-code/send-code.component';
import { FriendsPageComponent } from './pages/friends-page/friends-page.component';




const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login/:id', component: GetTokenComponent},
  { path: 'code', component: SendCodeComponent},
  { path: 'playpong', component: PlayPongPagesComponent, canActivate: [AuthGuard] }, 
  { path: 'chat', component: ChatPageComponent, canActivate: [AuthGuard]  },
  { path: 'friends', component: FriendsPageComponent, canActivate: [AuthGuard]  },
  { path: 'myprofile', component: MyProfileComponent, canActivate: [AuthGuard]/*, resolve: { userList: UserResolver } */},
  // { path: 'modifymyprofile', component: ModifyMyProfileComponent, canActivate: [AuthGuard], resolve: { userList : UserResolver } },
  { path: 'modifymyprofile/activate2fa', component: Activate2FaComponent, canActivate: [AuthGuard]/*, resolve: { userList : UserResolver } */},
  { path: 'profile/:id', component: ProfilePageComponent, canActivate: [AuthGuard]/*, resolve: { userList : UserResolver } */},
  { path: '**', component: UnfoundPagesComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
