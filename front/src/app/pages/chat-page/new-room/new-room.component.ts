import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatLegacySelectionListChange as MatSelectionListChange } from '@angular/material/legacy-list';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { ChatMobileService } from 'src/app/services/chat-mobile.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChatRoom, ChatRoomI } from 'src/app/services/chat/chatRoom.interface';
import { Message } from 'src/app/services/chat/message.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({
selector: 'app-new-room',
templateUrl: './new-room.component.html',
styleUrls: ['./new-room.component.css']
})

export class NewRoomComponent implements OnInit {
	@Input() chatMobileService! : ChatMobileService ;

	selectedRoom: ChatRoom = {};
	isAdmin: boolean = false;
	haveSelectedRoom: boolean = false;
	rooms$: Observable<ChatRoom[]> = this.chatService.getRooms();
	messages$: Observable<Message[]> = this.chatService.getMessages(this.selectedRoom);
	publicrooms: Observable<ChatRoom[]> = this.chatService.getPublicRooms();
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
		// public chatMobileService : ChatMobileService,
	private userService: UserService) { }
	
	async ngOnInit() {
		this.userService.getLoggedUser().subscribe((user: UserI) => {
			this.actualUser = user;
		});

	}

	create() {
		if (this.form.valid) {
			this.chatService.createRoom(this.form.value);
			this.form.setValue({
        name: null,
        description: null,
        public: false,
        password: null,
        users: []
        // BUGGEEEEEEEEEEEEEEEEE
      });
		}
	}

	addUser(user: any) {
		this.users.push(new FormControl({
			id: user.id,
			intra_name: user.intra_name,
			avatar_url: user.avatar_url,
			email: user.email
		}));
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

	closeNewRoom() : void{
		this.chatMobileService.hideNewRoom();
	}

}