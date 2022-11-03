import { Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Socket } from 'ngx-socket-io';
import { ConnectableObservable, Observable } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChatRoom, ChatRoomI } from 'src/app/services/chat/chatRoom.interface';
import { Message } from 'src/app/services/chat/message.interface';
import { UserService } from 'src/app/services/user/user.service';
import { PenaltyDialogComponent } from 'src/app/src/app/edit-room-chat/penalty-dialog/penalty-dialog.component';
import { PenaltyType } from 'src/app/src/app/edit-room-chat/penalty-dialog/penalty.interface';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss', './settings.component.css']
})

export class RoomComponent implements OnInit, OnChanges, OnDestroy {

  @Input() room: ChatRoom = {};
  @Input() user: UserI = {};
  @Input() friend: UserI = {};


  messages$: Observable<Message[]> = this.chatService.getMessages(this.room);

  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  form: FormGroup = new FormGroup({
    message: new FormControl(null, [Validators.required])
  });
  
  editform: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    public: new FormControl(false),
    password: new FormControl(null),
    users: new FormArray([], [Validators.required])
  });
  
  
  constructor(private chatService: ChatService,
    private userService: UserService,
    private socket: Socket,
    public dialog: MatDialog) { }
              
             
  openDialog(target: UserI, penalty: string): void {
    this.dialog.open(PenaltyDialogComponent, {
      data: {target: target, room: this.room, penalty: penalty}
    });
  }



  async sendMessage() {
    if (this.form.valid) {
      this.chatService.sendMessage({ 
        content: this.form.value.message,
        room: this.room,
        user: this.user,
       });
       this.form.reset();
    }
  }
          
  ngOnDestroy(): void {
   
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.room.id) {
      this.chatService.joinRoom(this.room);
      this.editform.patchValue({
        name: this.room.name,
        description: this.room.description,
        public: this.room.public,
        password: this.room.password,
        users: this.room.users,

      });
    }
  }
  
  ngOnInit(): void {
    this.messages$.subscribe((messages: Message[]) => {
      const element = document.getElementById('chat_box_body');

      if (element) {
        requestAnimationFrame(() => {
          element.scrollTop = element.scrollHeight;
        });
      }
    }
    );
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
  
  get message(): FormControl {
    return this.form.get('message') as FormControl;
  }
  
  edit(){
    const room: ChatRoom = {
       id: this.room.id,
       name: this.editform.value.name,
       description: this.editform.value.description,
       public: this.editform.value.public,
       password: this.editform.value.password? this.editform.value.password : null,
       users: this.editform.value.users
     }
     this.chatService.editRoom(room);
  }
  
  show: boolean = false;
  
  isAdministrator(user: UserI) {
    if (this.room.admins) {
      return this.room.admins.find(admin => admin.id === user.id);
    }
    return this.room.ownerId == user.id;
  }

  showParam() {
    this.show = true;
  }
  hideParam() {
    this.show = false;
  }

  ejectUser(user: UserI) {
    this.socket.emit('ejectRoom', { roomId: this.room.id, targetId: user.id });
  }
}

