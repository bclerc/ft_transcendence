import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/auth/token.storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  connect : boolean = false;

  constructor(private token : TokenStorageService) { }

  ngOnInit(): void {
    if (this.token.getToken())
      this.connect= true;

  }

}
