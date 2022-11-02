import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { UserI } from '../models/user.models';
import { ChatService } from '../services/chat/chat.service';
import { ChatRoom } from '../services/chat/chatRoom.interface';

@Component({
  selector: 'app-edit-room-chat',
  templateUrl: './edit-room-chat.component.html',
  styleUrls: ['./edit-room-chat.component.scss']
})
export class EditRoomChatComponent implements OnInit {


  @Input() room: ChatRoom = {};


  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    public: new FormControl(false),
    password: new FormControl(null),
    users: new FormArray([], [Validators.required])
  });

  constructor(private chatService: ChatService,
              private socket: Socket) { }


  edit(){

    const room: ChatRoom = {
      id: this.room.id,
      name: this.form.value.name,
      description: this.form.value.description,
      public: this.form.value.public,
      password: this.form.value.password,
      users: this.form.value.users
    }
    this.chatService.editRoom(room);;
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


  removeUser(userId: any) {
    this.users.removeAt(this.users.value.findIndex((user: UserI) => user.id === user.id));
    this.socket.emit('ejectRoom', { roomId: this.room.id, targetId: userId });

  }

  ngOnInit(): void {

    
    this.form.patchValue({
      name: this.room.name,
      description: this.room.description,
      public: this.room.public,
      password: this.room.password,
    })

    if (this.room.users) {
      for (const user of this.room.users) {
        this.users.push(this.initUser(user));
      }
    }
  }


  get mame(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get public(): FormControl {
    return this.form.get('public') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get users(): FormArray {
    return this.form.get('users') as FormArray;
  }

}
