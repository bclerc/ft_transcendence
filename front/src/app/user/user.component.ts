import { Component, Input, OnInit } from '@angular/core';
import { User, UserI } from '../models/user.models';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() user!: UserI;

  //currentuser: User;

  constructor(private userservice : UserService) 
  {

  }

  ngOnInit(): void {
    this.user = this.userservice.getUserById(1);
  }

}
