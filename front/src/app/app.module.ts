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
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserselectComponent } from './userselect/userselect.component';
import { CommonModule } from '@angular/common';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { RoomComponent } from './pages/chat-page/room/room.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChatInfoComponent } from './chat-info/chat-info.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { EditRoomChatComponent } from './edit-room-chat/edit-room-chat.component';
import { SendCodeComponent } from './pages/send-code/send-code.component';
import { FriendsPageComponent } from './pages/friends-page/friends-page.component';
import { environment } from 'src/environments/environment';
import { HeaderService } from './services/user/header.service';
import { CurrentUserService } from './services/user/current_user.service';
import { FileUploaderComponent } from './pages/modify-my-profile/file-uploader/file-uploader.component';
import { NewRoomComponent } from './pages/chat-page/new-room/new-room.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { PenaltyDialogComponent } from './src/app/edit-room-chat/penalty-dialog/penalty-dialog.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { EditDialogComponent } from './src/app/edit-room-chat/edit-dialog/edit-dialog.component';
import { ListUserBlockedComponent } from './pages/modify-my-profile/list-user-blocked/list-user-blocked.component';
import { ListMyFriendComponent } from './pages/my-profile/list-my-friend/list-my-friend.component';
import { ListMatchHistoryComponent } from './pages/my-profile/list-match-history/list-match-history.component'; 
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { HttpErrorInterceptor } from './httpErrorHandler';
import { BurgerMenuService } from './services/burger-menu.service';
import { PlayComponent } from './pages/play-pong-pages/play/play.component';
import { LeaderbordComponent } from './pages/leaderbord/leaderbord.component';
import { Activate2FaComponent } from './pages/modify-my-profile/activate2-fa/activate2-fa.component'
import { FooterComponent } from './footer/footer.component';
import { AddFriendListComponent } from './pages/my-profile/add-friend-list/add-friend-list.component';
import { InviteDialogComponent } from './pages/play-pong-pages/invite-dialog/invite-dialog.component';
import { AddUserOnRoomComponent } from './add-user-on-room/add-user-on-room.component';

const config: SocketIoConfig = {
  url: 'http://'+ environment.host +':8181', options: {
    query: {
      token: sessionStorage.getItem('auth-token')
    }
  },
};

export function tokenGetter() {
  return sessionStorage.getItem("auth-token");
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
    LeaderbordComponent,
    AddUserOnRoomComponent,
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

