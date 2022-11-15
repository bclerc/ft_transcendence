import { Component, Inject, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ChatRoom, ChatRoomI, EditRoomI } from 'src/app/services/chat/chatRoom.interface';
import { Message } from 'src/app/services/chat/message.interface';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { UserService } from 'src/app/services/user/user.service';
import { PenaltyDialogComponent } from '../penalty-dialog/penalty-dialog.component';
import { newPenalty } from '../penalty-dialog/penalty.interface';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  editform: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    public: new FormControl(false),
    password: new FormControl(null),
    users: new FormArray([], [Validators.required])
  });
  
  user: UserI;
  room: ChatRoomI;
  userIsAdmin: boolean = false;

  constructor(private chatService: ChatService,
    @Inject(MAT_DIALOG_DATA) public data:  EditRoomI,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    private userService: UserService,
    private currentUser: CurrentUserService,
    private snack: MatSnackBar,
    private socket: Socket,
    public dialog: MatDialog) { 
        this.user = data.user;
        this.room = data.room;
        this.room.users.find((user) => {
          if (user.id == this.user.id) {
            this.userIsAdmin = true
          }
        });
    }
              
             
  openDialog(target: UserI, penalty: string): void {
    this.dialog.open(PenaltyDialogComponent, {
      data: {target: target, room: this.room, penalty: penalty}
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
        
  
  async ngOnInit() {
    this.editform.setValue({
      name: this.room.name,
      description: this.room.description,
      public: this.room.public,
      password: null,
      users: this.room.users,
    });

  }

  sendRequest(userId: number | undefined)
  {
    if (userId) {
      this.userService.sendRequest(userId).subscribe( (res: any) => {
        if (res.state == "success") {
          this.snack.open("Votre demande a bien été envoyée", "OK", {duration: 2000});
          this.dialogRef.close();
        } else {
          this.snack.open("Une erreur est survenue: " + res.message, "OK", {duration: 2000});
        }
      });
    }
  }
  
  blockUser(userId: number | undefined, block: boolean)
  {
    if (userId)
    {
      this.chatService.blockUser(userId, block);
      this.dialogRef.close();
    }
  }

  promoteUser(userId: number | undefined) {
    if (userId && this.room && this.room.id) 
      this.chatService.promoteUser(userId, this.room.id);
      this.dialogRef.close();  
   }

  demoteUser(userId: number | undefined) {
    if (userId && this.room && this.room.id) 
      this.chatService.demoteUser(userId, this.room.id);
    this.dialogRef.close();  
  }

  isMute(userId: number | undefined): boolean
  {
    if (userId && this.room.penalities) {
        for (let penalty of this.room.penalities) {
          if (penalty.user.id == userId && penalty.type == "MUTE")
            return true;
        };
    }
    return false;
  }


  isBan(userId: number | undefined): boolean
  {
    if (userId && this.room.penalities) {
        for (let penalty of this.room.penalities) {
          if (penalty.user.id == userId && penalty.type == "BAN")
            return true;
        };
    }
    return false;
  }

  unBan(userId: number | undefined)
  {
    if (userId && this.room.penalities) {
      for (let penalty of this.room.penalities) {
        if (penalty.user.id == userId && penalty.type == "BAN")
        {
          this.chatService.pardonUser(userId, penalty.id);
          this.dialogRef.close();
        }
      };
    }
  }

  unMute(userId: number | undefined)
  {
    if (userId && this.room.penalities) {
      for (let penalty of this.room.penalities) {
        if (penalty.user.id == userId && penalty.type == "MUTE")
        {
          this.chatService.pardonUser(userId, penalty.id);
          this.dialogRef.close();
        }
      };
    }
  }

  get mame(): FormControl {
    return this.editform.get('name') as FormControl;
  }
  
  get description(): FormControl {
    return this.editform.get('description') as FormControl;
  }
  
  get public(): FormControl {
    return this.editform.get('public') as FormControl;
  }
  
  get password(): FormControl {
    return this.editform.get('password') as FormControl;
  }
  
  get users(): FormArray {
    return this.editform.get('users') as FormArray;
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
     this.dialog.closeAll();
     this.chatService.editRoom(room);
  }

  
  show: boolean = false;
  
  isAdministrator(user: UserI) {
    if (!user)
      return false;
    if (user.id == this.room.ownerId)
      return true;
    if (this.room.admins) {
      return this.room.admins.find(admin => admin.id === user.id);
    }
    return false;
  }


  leaveRoom() {
    this.chatService.leaveRoom(this.room)
    this.dialogRef.close();
  }

  deleteRoom() {
    this.chatService.deleteRoom(this.room)
    this.dialogRef.close();
  }
  
  ejectUser(user: UserI) {
    if (this.room.ownerId != user.id) {
      this.socket.emit('ejectRoom', { roomId: this.room.id, targetId: user.id });
      this.room.users = this.room.users.filter(u => u.id !== user.id);
    }
  }
  
}


