import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { UserI } from '../models/user.models';

import { ChatRoom } from '../services/chat/chatRoom.interface';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css']
})
export class ChatInfoComponent implements OnInit {

  @Input() room: ChatRoom = {};
  form: FormGroup = new FormGroup({
    users: new FormArray([], [Validators.required])
  });
  actualUser: UserI = {};
  constructor(private socket: Socket,
    private userService: UserService,
    private snackBar: MatSnackBar) { }

  
  ejectUser(user: UserI) {
    this.socket.emit('ejectRoom', { roomId: this.room.id, targetId: user.id });
    this.snackBar.open(`${user.intra_name} a été expulsé du salon`, 'OK', { duration: 3000 });
  }

  initUser(user: any) {
    return new FormControl({
      id: user.id,
      intra_name: user.intra_name,
      avatar_url: user.avatar_url,
      email: user.email
    });
  }

  addUser(userFormControl: FormControl) {
    this.users.push(userFormControl);
  }


  isAdministrator(user: UserI) {
    if (this.room.admins) {
      return this.room.admins.find(admin => admin.id === user.id);
    }
    return false;
  }

  promoteUser(user: UserI) {
    this.socket.emit('promoteUser', { roomId: this.room.id, targetId: user.id });
  }

  demoteUser(user: UserI) {
    this.socket.emit('demoteUser', { roomId: this.room.id, targetId: user.id });
  }

  removeUser(userId: any)
  {
    this.users.removeAt(this.users.value.findIndex((user: UserI) => user.id === userId));
  }


  async ngOnInit() {
  
    await this.userService.getLoggedUser().subscribe((user: UserI) => {
      this.actualUser = user;
    });
  }

  get users(): FormArray {
    return this.form.get('users') as FormArray;
  }

}
