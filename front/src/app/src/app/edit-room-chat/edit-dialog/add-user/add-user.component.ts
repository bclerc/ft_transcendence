import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { ChatRoomI } from 'src/app/services/chat/chatRoom.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  constructor (
                @Inject(MAT_DIALOG_DATA) private data: ChatRoomI,
                private matDialogRef: MatDialogRef<AddUserComponent>,
                private socket: Socket,
              ) { }

  ngOnInit(): void {
  }

  async addUser(event: any)  {
    this.socket.emit('addUserToRoom', {roomId: this.data.id, userId: event.id});
    this.matDialogRef.close();
  }

  /*async updateInfo() {
    this.friends = this.userService.getFriends();
    this.pandingFriends = this.userService.getFriendRequests();
  }*/


}
