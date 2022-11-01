import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
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
	private userService: UserService) { }
	
	async ngOnInit() {
		// this.publicrooms
		// = await this.chatService.getPublicRooms();
		// this.rooms$ = await this.chatService.getRooms();
		this.userService.getLoggedUser().subscribe((user: UserI) => {
			this.actualUser = user;
		});

		// await this.rooms$.subscribe((rooms: ChatRoom[]) => {
		// 	if (this.selectedRoom.id) {
		// 		for (const room of rooms) {
		// 			if (room.id === this.selectedRoom.id) {
		// 				this.haveSelectedRoom = true;
		// 				this.selectedRoom = room;
		// 				return ;
		// 			}
		// 		}
		// 	}
		// this.selectedRoom = {};
		// this.haveSelectedRoom = false;
		// });
	}

	create() {
		if (this.form.valid) {
			this.chatService.createRoom(this.form.value);
			this.form.reset();
		}
	}

	addUser(user: any) {
    console.log("Action detected", user);
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

	

}