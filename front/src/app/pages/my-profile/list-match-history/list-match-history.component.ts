import { Component, OnInit, Input } from '@angular/core';
import { UserI } from 'src/app/models/user.models';

@Component({
  selector: 'app-list-match-history',
  templateUrl: './list-match-history.component.html',
  styleUrls: ['./list-match-history.component.css']
})
export class ListMatchHistoryComponent implements OnInit {
  @Input() user! : UserI;

  constructor() { }

  ngOnInit(): void {
  }

}
