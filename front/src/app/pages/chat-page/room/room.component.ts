import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { ChatMobileService } from 'src/app/services/chat-mobile.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChatRoom } from 'src/app/services/chat/chatRoom.interface';
import { Message } from 'src/app/services/chat/message.interface';
import { UserService } from 'src/app/services/user/user.service';
import { EditDialogComponent } from 'src/app/src/app/edit-room-chat/edit-dialog/edit-dialog.component';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})

export class RoomComponent implements OnInit, OnChanges, OnDestroy {

  @Input() room: ChatRoom = {};
  @Input() user: UserI = {};
  @Input() friend: UserI = {};
  @Input() chatMobileService! : ChatMobileService ;



  messages$: Observable<Message[]> = this.chatService.getMessages(this.room);
  dialogRef: any;
  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  form: FormGroup = new FormGroup({
    message: new FormControl(null, [Validators.required])
  });
    
  constructor(private chatService: ChatService,
    private userService: UserService,
    private socket: Socket,
    public dialog: MatDialog,
    // public chatMobileService : ChatMobileService,
    private router : Router) { }
              
             
  openDialog(target: UserI, penalty: string): void {
    this.dialogRef = this.dialog.open(EditDialogComponent, {
      data: this.room,
      width: '90%',
      height: '90%',
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

    // check

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
      data: {
        user: this.user,
        room: this.room,
      },
      width: '90%',
      height: '90%',
    });
  }

  closeRoom() : void{
		console.log("cjscj", this.chatMobileService.room);
		this.chatMobileService.hideRoom();
		console.log("cjscj", this.chatMobileService.room);
	}
  // ejectUser(user: UserI) {
  //   this.socket.emit('ejectRoom', { roomId: this.room.id, targetId: user.id });
  // }
}

