import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { PlayPongPagesComponent } from './pages/play-pong-pages/play-pong-pages.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { ModifyMyProfileComponent } from './pages/modify-my-profile/modify-my-profile.component';
import { UserService } from './services/user/user.service';
import { UserResolver } from './resolver';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserselectComponent } from './userselect/userselect.component';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './pages/chat-page/room/room.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChatInfoComponent } from './chat-info/chat-info.component';
import { MatBadgeModule } from '@angular/material/badge';
import { EditRoomChatComponent } from './edit-room-chat/edit-room-chat.component';
import { SendCodeComponent } from './pages/send-code/send-code.component';
import { FriendsPageComponent } from './pages/friends-page/friends-page.component';
import { environment } from 'src/environments/environment';
import { HeaderService } from './services/user/header.service';
import { CurrentUserService } from './services/user/current_user.service';
import { FileUploaderComponent } from './pages/modify-my-profile/file-uploader/file-uploader.component';
import { NewRoomComponent } from './pages/chat-page/new-room/new-room.component';
import { EditDialogComponent } from './pages/chat-page/edit-dialog/edit-dialog.component';
import { ListUserBlockedComponent } from './pages/modify-my-profile/list-user-blocked/list-user-blocked.component';
import { ListMyFriendComponent } from './pages/my-profile/list-my-friend/list-my-friend.component';
import { ListMatchHistoryComponent } from './pages/my-profile/list-match-history/list-match-history.component';
import { HttpErrorInterceptor } from './httpErrorHandler';
import { BurgerMenuService } from './services/burger-menu.service';
import { PlayComponent } from './pages/play-pong-pages/play/play.component';
import { LeaderbordComponent } from './pages/leaderbord/leaderbord.component';
import { Activate2FaComponent } from './pages/modify-my-profile/activate2-fa/activate2-fa.component'
import { FooterComponent } from './footer/footer.component';
import { AddFriendListComponent } from './pages/my-profile/add-friend-list/add-friend-list.component';
import { InviteDialogComponent } from './pages/play-pong-pages/invite-dialog/invite-dialog.component';
import { ChatMobileService } from './services/chat-mobile.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { AddUserComponent } from './pages/chat-page/edit-dialog/add-user/add-user.component';
import { PenaltyDialogComponent } from './pages/chat-page/penalty-dialog/penalty-dialog.component';

const config: SocketIoConfig = {
  url: 'http://'+ environment.host +':8181', options: {
    query: {
      token: localStorage.getItem('auth-token')
    }
  },
};

export function tokenGetter() {
  return localStorage.getItem("auth-token");
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlayPongPagesComponent,
    ProfilePageComponent,
    MyProfileComponent,
    ModifyMyProfileComponent,
    UserselectComponent,
    RoomComponent,
    ChatInfoComponent,
    EditRoomChatComponent,
    SendCodeComponent,
    Activate2FaComponent,
    ChatPageComponent,
    FriendsPageComponent,
    FileUploaderComponent,
    NewRoomComponent,
    PenaltyDialogComponent,
    EditDialogComponent,
    ListUserBlockedComponent,
    ListMyFriendComponent,
    ListMatchHistoryComponent,
    PlayComponent,
    FooterComponent,
    LeaderbordComponent,
    AddFriendListComponent,
    InviteDialogComponent,
    AddUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.host + ':3000']
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
    MatSelectModule,
    MatDialogModule,
    CommonModule,
    SocketIoModule,
    MatMenuModule,
  ],
  providers:
  [    
    UserService,
    UserResolver,
    HeaderService,
    BurgerMenuService,
    CurrentUserService,
    ChatMobileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}

