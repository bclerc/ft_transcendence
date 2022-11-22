import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-leaderbord',
  templateUrl: './leaderbord.component.html',
  styleUrls: ['./leaderbord.component.css']
})
export class LeaderbordComponent implements OnInit {
  leaderbord = this.userService.GetLeaderBord();

  constructor (
                private userService : UserService
              ) { }

  ngOnInit(): void {
    this.userService.GetLeaderBord().subscribe(
      (data : any) =>
      {
        console.log(data);
      }
    )
  }

}
