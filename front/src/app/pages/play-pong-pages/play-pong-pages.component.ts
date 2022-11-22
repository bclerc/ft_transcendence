import { Component, HostListener, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { GameI, GameListInfo } from '../../models/PongInterfaces/pong.interface';
import { ScoreI } from '../../models/PongInterfaces/score.interface';
import { UserI } from '../../models/PongInterfaces/user.interface';


@Component({
  selector: 'app-root',
  templateUrl: './play-pong-pages.component.html',
  styleUrls: ['./play-pong-pages.component.css']
})
@Injectable(
  {providedIn: 'root'}
)
export class PlayPongPagesComponent implements OnInit
{
  user: UserI = {};
  games: GameListInfo[] = [];
  id!: string;

  private var_interval: number;

  constructor(private router: Router, private socket: Socket,  private currentUser :CurrentUserService, private dialog: MatDialog)
  {
    this.var_interval = 0;
    this.socket.on('onGoingGames', (data: GameListInfo[]) => {
      this.games = data;
    });
  }

  
  testInviteUser() {
    this.socket.emit('inviteUser', 2);
  }
  ngOnInit(): void 
  {
    this.socket.emit("needOnGoingGames");
  }
  
  ngAfterInit(): void {
  }

  ngOnDestroy(): void {
    this.stopSearchLoop(this.var_interval);
  }

  getId(id: string){
    const divId = document.getElementById('idGame');

    divId!.innerHTML = id;
  }

  newGame(normalOrNot: boolean)
  {
    this.socket.emit('newGame', normalOrNot);
  }

  stopSearchLoop(id: number)
  {
    if (id && id != 0)
    {
      // console.log("stopSearchLoop");
      window.clearInterval(id);
      this.var_interval = 0;
    }
  }

  joinGame(id: number)
  {
    this.router.navigate(['/game/', id]);
  }

};
