import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.models';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  UserList! : User[];
  
  constructor() { }

  ngOnInit(): void {
  }

}
