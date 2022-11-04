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
import { EditDialogComponent } from 'src/app/src/app/edit-room-chat/edit-dialog/edit-dialog.component';
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
    
  constructor(private chatService: ChatService,
    private userService: UserService,
    private socket: Socket,
    public dialog: MatDialog) { }
              
             
  openDialog(target: UserI, penalty: string): void {
    this.dialog.open(EditDialogComponent, {
      data: this.room,
      width: '90%',
      height: '90%',
      panelClass: './settings.component.css'
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
  

  get message(): FormControl {
    return this.form.get('message') as FormControl;
  }

  showParam() {
    this.dialog.open(EditDialogComponent, {
      data: this.room,
      width: '90%',
      height: '90%',
    });
  }

  // ejectUser(user: UserI) {
  //   this.socket.emit('ejectRoom', { roomId: this.room.id, targetId: user.id });
  // }
}

