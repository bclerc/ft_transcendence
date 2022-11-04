import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../../header/header.component';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  loginPath = 'http://' + environment.host + '/api/v1/auth/42';
  
  constructor() { }

  ngOnInit(): void {
  }

}
