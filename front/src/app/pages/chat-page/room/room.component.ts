import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ConnectableObservable, Observable } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChatRoom, ChatRoomI } from 'src/app/services/chat/chatRoom.interface';
import { Message } from 'src/app/services/chat/message.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})

export class RoomComponent implements OnInit, OnChanges, OnDestroy {

  @Input() room: ChatRoom = {};
  @Input() user: UserI = {};

  messages: Observable<Message[]> = this.chatService.getMessages(this.room);
  chatMessage: FormControl = new FormControl(null, [Validators.required]);
  // get logged user from observable
  
  constructor(private chatService: ChatService,
    private userService: UserService) { 
              }
              
              
              
              ngOnDestroy(): void {
                throw new Error('Method not implemented.');
              }
              
              ngOnChanges(changes: SimpleChanges): void {
                if (this.room.id) {
                  this.chatService.joinRoom(this.room);
                }
              }
              
              ngOnInit(): void {
              }
              
            }
            