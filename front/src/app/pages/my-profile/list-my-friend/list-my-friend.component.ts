import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { UserI } from 'src/app/models/user.models';
import { UserService } from 'src/app/services/user/user.service';
import { AddFriendListComponent } from '../add-friend-list/add-friend-list.component';

@Component({
  selector: 'app-list-my-friend',
  templateUrl: './list-my-friend.component.html',
  styleUrls: ['./list-my-friend.component.css']
})
export class ListMyFriendComponent {

  @Input() user! : UserI
  @Input()friends! : UserI[];

  constructor (  
                public userService : UserService,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private socket: Socket
              ) {}

  
  subscriptionFriend!: Subscription;

    removeFriend(id : number | undefined) : void
    {
      this.userService.removeFriend(id).subscribe(
        (data : any) =>
        {
        if (this.friends)
        {
          for (var i = 0; this.friends[i] ;i++)
          {
            if (id === this.friends[i].id)
            {
              this.friends.splice(i, 1);
              break;
            }
          }
        }
      }
      );
    }
  
    blockUser(id : number | undefined) : void
    {
      this.userService.blockUser(id).subscribe(
        (data : any) =>
        {
        if (this.friends)
        {
          for (var i = 0; this.friends[i] ;i++)
          {
            if (id === this.friends[i].id)
            {
              if (this.user.blockedUsers)
                this.user.blockedUsers.push(this.friends[i]);
              this.friends.splice(i, 1);
              break;
            }
          }
        }
      }
      )
    }

    openDialogAddFriend() {
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.autoFocus = true;
      // dialogConfig.height = '20%';
      // dialogConfig.width = '40%';
  
      dialogConfig.data = {
          user : this.user,
      };
  
      this.dialog.open(AddFriendListComponent, dialogConfig);
  }

  async inviteToPlay(user: UserI)
  {
    if (user)
    {
      switch (user.state) {
        case "OFFLINE":
          this.snackBar.open(user.displayname + " n'est pas en ligne!", "X", {
            duration: 2000,
          });
        break;
        case "INGAME":
          this.snackBar.open(user.displayname + " est déjà en partie !", "X", {
          duration: 2000,
        });
        break;
        default:
          this.socket.emit('inviteUser', user.id);
    }
  }
}

}
