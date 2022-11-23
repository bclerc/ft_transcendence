import { Component, Injectable, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetTokenComponent } from './pages/get-token/get-token.component';
import { AuthGuard } from './guard';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { PlayPongPagesComponent } from './pages/play-pong-pages/play-pong-pages.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { UnfoundPagesComponent } from './unfound-pages/unfound-pages.component';
import { SendCodeComponent } from './pages/send-code/send-code.component';
import { FriendsPageComponent } from './pages/friends-page/friends-page.component';
import { PlayComponent } from './pages/play-pong-pages/play/play.component';
import { LeaderbordComponent } from './pages/leaderbord/leaderbord.component';




const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'login/:id', component: GetTokenComponent},
  { path: 'code', component: SendCodeComponent},
  { path: 'game', component: PlayPongPagesComponent, canActivate: [AuthGuard] }, 
  { path: 'game/:id', component: PlayComponent, canActivate: [AuthGuard] }, 
  { path: 'chat', component: ChatPageComponent, canActivate: [AuthGuard]  },
  { path: 'leaderbord', component: LeaderbordComponent, canActivate: [AuthGuard]  },
  { path: 'myprofile', component: MyProfileComponent, canActivate: [AuthGuard]},
  { path: 'profile/:id', component: ProfilePageComponent, canActivate: [AuthGuard]},
  { path: '**', component: UnfoundPagesComponent },
];


@NgModule({
  imports: [RouterModule.forRoot
    (
      routes,
      { 
        useHash : true,
        onSameUrlNavigation: 'reload',
      }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
