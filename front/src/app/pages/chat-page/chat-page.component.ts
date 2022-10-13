import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChatRoom } from 'src/app/services/chat/chatRoom.interface';
import { Message } from 'src/app/services/chat/message.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({

  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})

export class ChatPageComponent implements OnInit {

  selectedRoom: ChatRoom = {};
  rooms$: Observable<ChatRoom[]> = this.chatService.getRooms();
  messages$: Observable<Message[]> = this.chatService.getMessages(this.selectedRoom);
  actualUser: UserI = {};

  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    users: new FormArray([], [Validators.required])
  });

  constructor(private chatService: ChatService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getLoggedUser().subscribe((user: UserI) => {
      this.actualUser = user;
    }
    );
  }

  create() {
    if (this.form.valid) {
      this.chatService.createRoom(this.form.value);
      this.form.reset();
    }
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
    this.users.removeAt(this.users.value.findIndex((user: UserI) => user.id === userId));
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get users(): FormArray {
    return this.form.get('users') as FormArray;
  }

  onSelectedRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

}
