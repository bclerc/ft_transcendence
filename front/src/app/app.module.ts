import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';

import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginPagesComponent } from './pages/login-pages/login-pages.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user-list/user-list.component';
import { PlayPongPagesComponent } from './pages/play-pong-pages/play-pong-pages.component';
import { PlayRankedPongPagesComponent } from './pages/play-ranked-pong-pages/play-ranked-pong-pages.component';
import { PlayFunPongPagesComponent } from './pages/play-fun-pong-pages/play-fun-pong-pages.component';

import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { GetTokenComponent } from './get-token/get-token.component';
import { UnfoundPagesComponent } from './unfound-pages/unfound-pages.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { HttpClientModule } from '@angular/common/http';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { ModifyMyProfileComponent } from './pages/modify-my-profile/modify-my-profile.component';
import { UserService } from './services/user/user.service';
import { UserResolver } from './resolver';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { MatTabsModule} from '@angular/material/tabs';
import { MatCardModule} from '@angular/material/card';
import { MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UserselectComponent } from './userselect/userselect.component';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RoomComponent } from './pages/chat-page/room/room.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { ChatInfoComponent } from './chat-info/chat-info.component';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';
import { EditRoomChatComponent } from './edit-room-chat/edit-room-chat.component';
import { SendCodeComponent } from './pages/send-code/send-code.component';
import { Activate2FaComponent } from './pages/activate2-fa/activate2-fa.component';

const config: SocketIoConfig = {
  url: 'http://localhost:81', options: {
    query: {
      token: sessionStorage.getItem('auth-token')
    }
  }
};

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
    HeaderComponent,
    ProfilePageComponent,
    MyProfileComponent,
    ModifyMyProfileComponent,
    SendCodeComponent,
    Activate2FaComponent,
    ChatPageComponent,
    UserselectComponent,
    RoomComponent,
    ChatInfoComponent,
    EditRoomChatComponent,
    SendCodeComponent,
    Activate2FaComponent,
    ChatPageComponent,
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

    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSnackBarModule,
    MatGridListModule,
    MatTableModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatBadgeModule,
    CommonModule,
    SocketIoModule,
  ],
  providers: [    UserService,
    UserResolver],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}

