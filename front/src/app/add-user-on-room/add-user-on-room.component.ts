import { Component, ViewEncapsulation, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { UserI } from '../models/user.models';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-add-user-on-room',
  templateUrl: './add-user-on-room.component.html',
  styleUrls: ['./add-user-on-room.component.css']
})

export class AddUserOnRoomComponent implements OnInit {

  @Input() users: UserI[] = [];
  @Output() addUser: EventEmitter<UserI> = new EventEmitter<UserI>();
  @Output() removeuser: EventEmitter<UserI>= new EventEmitter<UserI>();


  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  searchUsername = new FormControl();
  filteredUsers: UserI[] = [];
  selectedUser: UserI = {};

  constructor (
                private userService: UserService,
              ) 
              {
                
                  //this.user = data.user; 
              }

  ngOnInit(): void {
    this.searchUsername.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((value) => {
          if (value !== '') {
            this.userService.FindByName(value).subscribe((users) => {
              this.filteredUsers = users;
            });
          }
        })
      ).subscribe();
  }


  addUserToForm() {
      this.addUser.emit(this.selectedUser);
      this.filteredUsers = [];
      this.selectedUser = {};
      this.searchUsername.setValue("");
  }


  removeUserFromForm(user: UserI) {
    this.removeuser.emit(user);

  }

  setSelectedUser(user: UserI) {
    this.selectedUser = user;
    this.addUser.emit(this.selectedUser);
    this.filteredUsers = [];
    this.selectedUser = {};
    this.searchUsername.setValue("");
  }

  displayFn(user: any ): string {
    return user && user.intra_name ? user.intra_name : '';
  }


}

