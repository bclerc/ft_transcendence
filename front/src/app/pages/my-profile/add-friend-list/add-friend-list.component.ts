import { Component, OnInit } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-friend-list',
  templateUrl: './add-friend-list.component.html',
  styleUrls: ['./add-friend-list.component.css']
})
export class AddFriendListComponent implements OnInit {

  constructor (
                private userService : UserService,
                private snackBar : MatSnackBar,
              ) { }

  ngOnInit(): void {
  }

  async addFriend(friendId: any) {
    await this.userService.sendRequest(friendId.id).subscribe(
      (res: any) => {
        this.snackBar.open("Votre demande d'amis as été envoyée", 'Undo', {
          duration: 3000
        })
        // console.log(res);
        //this.updateInfo();
      }
    );
  }

  /*async updateInfo() {
    this.friends = this.userService.getFriends();
    this.pandingFriends = this.userService.getFriendRequests();
  }*/


}
