import { Component } from '@angular/core';
import { TokenStorageService } from './services/auth/token.storage';
import { HeaderService } from './services/user/header.service';
//import { ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'transcendanceV1';
  constructor (public navbar : HeaderService, private token : TokenStorageService)
  {
    if (token.getToken())
      navbar.show();
  }
}
