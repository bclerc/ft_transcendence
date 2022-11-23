import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { ChatMobileService } from 'src/app/services/chat-mobile.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChatRoom } from 'src/app/services/chat/chatRoom.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ChatPageComponent implements OnInit {

	selectedRoom: ChatRoom = {};
	isAdmin: boolean = false;
	haveSelectedRoom: boolean = false;

	rooms$: Observable<ChatRoom[]> = this.chatService.getRooms();
  dmRooms$: Observable<ChatRoom[]> = this.chatService.getDmRooms();
	publicrooms: Observable<ChatRoom[]> = this.chatService.getPublicRooms();

  haveNewMessage: boolean = false;
  haveNewDm: boolean = false;
	selected = new FormControl(0);
	actualUser: UserI = {};

	form: FormGroup = new FormGroup({
	name: new FormControl(null, [Validators.required]),
	description: new FormControl(null),
	public: new FormControl(false),
	password: new FormControl(null),
	users: new FormArray([], [Validators.required])
	});

	constructor(private chatService: ChatService,
	private userService: UserService,
	private socket: Socket,
	private router: Router,
	public chatMobileService : ChatMobileService
	) { }

	async ngOnInit() {
		await this.userService.getLoggedUser().subscribe(
			(data : any) => {
			  this.actualUser = data;
			},
			);
      
		await this.rooms$.subscribe((rooms: ChatRoom[]) => {
      let roomChanged, roomSeen: boolean = false;
				for (const room of rooms) {
          if (!room.seen && room.id !== this.selectedRoom.id) 
            roomSeen = true;
        }
        if (this.selectedRoom && this.selectedRoom.type != 'DM') {
          rooms.forEach((room: ChatRoom) => {
              if (room.id === this.selectedRoom.id) {
                 this.selectedRoom = room;
                 this.haveSelectedRoom = true; 
                  roomChanged = true;
              }
          });
          if (!roomChanged) {
            this.haveSelectedRoom = false;
            this.selectedRoom = {};
          }
      }

       this.haveNewMessage = roomSeen;
		});

    await this.dmRooms$.subscribe((rooms: ChatRoom[]) => {
      let roomChanged, roomSeen: boolean = false;
        for (const room of rooms) {
          if (!room.seen && room.id !== this.selectedRoom.id) 
            roomSeen = true;
        }
       this.haveNewDm = roomSeen;
    });

    this.chatService.needRooms();
    this.chatService.needPublicRooms();
    this.chatService.needDmRooms();
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

	async leaveRoom(room: ChatRoom)
	{
		this.chatService.leaveRoom(room);
		this.rooms$ = await this.chatService.getRooms();
		this.haveSelectedRoom = false;
		this.selectedRoom = {};
	}

	async joinRoom(room: ChatRoom, pass?: boolean)
	{
		let password = null;

		if (pass) {
		password = prompt(room.name + '\nest protégé par un mot de passe, veuillez le saisir');
		}
		this.chatService.subscribeRoom(room, password);
		this.rooms$ = await this.chatService.getRooms();

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

	get public(): FormControl {
		return this.form.get('public') as FormControl;
	}

	get password(): FormControl {
		return this.form.get('password') as FormControl;
	}

	onSelectedRoom(event: MatSelectionListChange) {
		this.selectedRoom = event.source.selectedOptions.selected[0].value;
		this.haveSelectedRoom = true;
		if (this.selectedRoom && this.selectedRoom.admins) {
			for (const user of this.selectedRoom.admins) {
				if (user.id === this.actualUser.id) {
				this.isAdmin = true;
				return ;
				}
			}
		}
		this.isAdmin = false;
	}

	selectRoom(room: ChatRoom) {
		this.selectedRoom=room;
		this.newRoom = false;
		this.chatMobileService.showRoom();
	}

	newRoom: boolean = true;
	async NewRoom() {
      if (this.newRoom) {
        this.newRoom = true;
      } else {
        this.chatService.needPublicRooms();
        this.newRoom = true;
      }

		this.chatMobileService.showNewRoom();
    }

  friend(chatRoom: ChatRoom): UserI {
    let friend: UserI;
    if (chatRoom.users && chatRoom.users.length > 0) {
      for (const user of chatRoom.users) {
        if (user.id !== this.actualUser.id) {
          friend = user;
          return friend;
        }
      }
    }
    return this.actualUser;
  }

  async haveFriends(): Promise<boolean> {
      return false;
  }


}
