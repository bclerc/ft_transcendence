import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
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
import { SendCodeComponent } from './pages/send-code/send-code.component';
import { Activate2FaComponent } from './pages/activate2-fa/activate2-fa.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';

export function tokenGetter() {
  return localStorage.getItem("auth-token");
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfilePageComponent,
    MyProfileComponent,
    ModifyMyProfileComponent,
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
    BrowserAnimationsModule,
    //
  ],
  providers: [    UserService,
    UserResolver],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}

