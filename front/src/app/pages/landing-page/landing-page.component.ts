import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  loginPath = environment.host + '/v1/api/auth/login/42';
  
  constructor() { }

  ngOnInit(): void {
  }

}
