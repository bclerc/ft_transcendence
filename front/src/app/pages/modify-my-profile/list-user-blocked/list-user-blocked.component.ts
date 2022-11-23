import { Component, OnInit, Input } from '@angular/core';
import { UserI } from 'src/app/models/user.models';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-list-user-blocked',
  templateUrl: './list-user-blocked.component.html',
  styleUrls: ['./list-user-blocked.component.css']
})
export class ListUserBlockedComponent {
  @Input() user! : UserI;
  constructor (
                public userService : UserService,
              ) { }

  unblock(id : number | undefined): void{
      this.userService.unBlockUser(id).subscribe(
        (data : any) =>
        {
        if (this.user.blockedUsers)
        {
          for (var i = 0; this.user.blockedUsers[i] ;i++)
          {
            if (id === this.user.blockedUsers[i].id)
            {
              this.user.blockedUsers.splice(i, 1);
              break;
            }
          }
        }
      }
      )
    }

}
