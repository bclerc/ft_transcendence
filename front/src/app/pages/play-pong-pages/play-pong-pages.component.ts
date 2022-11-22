import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import {  GameListInfo } from '../../models/PongInterfaces/pong.interface';
import { UserI } from '../../models/PongInterfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './play-pong-pages.component.html',
  styleUrls: ['./play-pong-pages.component.css']
})
@Injectable(
  {providedIn: 'root'}
)
export class PlayPongPagesComponent implements AfterViewInit
{
  private var_interval: number;
  id!:                  string;
  user:                 UserI = {};
  games:                GameListInfo[] = [];
	inGame$:              Observable<boolean> = this.socket.fromEvent<boolean>('inGame');

  constructor(private router: Router, private socket: Socket,  private currentUser :CurrentUserService)
  {
    this.var_interval = 0;
    this.socket.on('onGoingGames', (data: GameListInfo[]) => {
      this.games = data;
    });
    this.socket.emit('inGame');
  }

  ngAfterViewInit(): void
  {
    this.socket.emit('needOnGoingGames');
    this.inGame$.subscribe(
      (inGameOrNot: boolean) => {
        if (inGameOrNot)
          this.stopMode();
        else
          this.launchMode();
      }
    );
  }
  
  ngAfterInit(): void {
  }

  ngOnDestroy(): void {
    this.stopSearchLoop(this.var_interval);
  }

  newGame(normalOrNot: boolean)
  {
    this.stopMode();
    this.socket.emit('newGame', normalOrNot);
  }

  stopGame()
  {
    this.socket.emit('stopSearch');
    this.launchMode();
  }

  stopSearchLoop(id: number)
  {
    if (id && id != 0)
    {
      console.log("stopSearchLoop");
      window.clearInterval(id);
      this.var_interval = 0;
    }
  }

  joinGame(id: number)
  {
    this.router.navigate(['/game/', id]);
  }

  private launchMode() {
    var button = document.getElementById("stop") as HTMLElement;
    if (button)
      button.setAttribute("hidden", "true");
    button = document.getElementById("regular") as HTMLElement;
    if (button)
      button.removeAttribute("hidden");
    button = document.getElementById("random") as HTMLElement;
    if (button)
      button.removeAttribute("hidden");
  }

  private stopMode() {
    var button = document.getElementById("stop") as HTMLElement;
    if (button)
      button.removeAttribute("hidden");
    button = document.getElementById("regular") as HTMLElement;
    if (button)
      button.setAttribute("hidden", "true");
    button = document.getElementById("random") as HTMLElement;
    if (button)
      button.setAttribute("hidden", "true");
  }

};
