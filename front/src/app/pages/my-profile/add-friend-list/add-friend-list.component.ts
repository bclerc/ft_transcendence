
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-friend-list',
  templateUrl: './add-friend-list.component.html',
  styleUrls: ['./add-friend-list.component.css']
})
export class AddFriendListComponent {

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) { }

  async addFriend(friendId: any) {
    await this.userService.sendRequest(friendId.id).subscribe(
      (res: any) => {
        this.snackBar.open("Votre demande d'amis as été envoyée", 'X', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        })
      }
    );
  }
}
