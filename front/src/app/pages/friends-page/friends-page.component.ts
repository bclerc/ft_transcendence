import { Component, OnInit } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Socket } from 'ngx-socket-io';
import { FriendsRequestAction } from 'src/app/models/friends/friendsrequest.enum';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent implements OnInit {


  friends = this.userService.getFriends();
  pandingFriends = this.userService.getFriendRequests();

  constructor(
        private readonly socket: Socket,
        private readonly snackBar: MatSnackBar,
        private readonly userService: UserService,
        ) { }


  ngOnInit(): void {
    this.friends.subscribe(
      (res: any) => {
        console.log(res);
      }
    )

  }

 async addFriend(friendId: any) {
    await this.userService.sendRequest(friendId.id).subscribe(
      (res: any) => {
        this.updateInfo();
      }
    );
  }

  async removeFriend(friendId: any) {
    await this.userService.removeFriend(friendId).subscribe(
      (res: any) => {
        console.log(res);
        this.updateInfo();
    });
  }

  async respond(requestId: number, response: boolean) {
    this.userService.respondFriendRequest(requestId,
          response ? FriendsRequestAction.ACCEPTED : FriendsRequestAction.DECLINED).subscribe(
            (res: any) => {
              this.updateInfo();
            }
          );
  }

  async updateInfo() {
    this.friends = this.userService.getFriends();
    this.pandingFriends = this.userService.getFriendRequests();
  }

}
