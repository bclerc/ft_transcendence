import { Component, HostListener, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { CurrentUserService } from 'src/app/services/user/current_user.service';
import { GameI } from '../../models/PongInterfaces/pong.interface';
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
  ratiox: number;
  ratioy: number;
  id!: string;
  private var_interval: number;

  constructor(private router: Router, private socket: Socket,  private currentUser :CurrentUserService)
  {
    this.var_interval = 0;
    this.ratiox = 1;
    this.ratioy = 1;
  }

  ngOnInit(): void 
  {
    // this.socket.on('id', this.idMessage);
    this.socket.on('enableButtonS', this.enableButtonS);
    this.socket.on('stopSearchLoop', this.stopSearchLoop);
    this.socket.on('getId', this.getId);
    this.enableButtonS();
    // this.socket.emit('init');
  }
  
  ngAfterInit(): void {
  }

  ngOnDestroy(): void {
    this.stopSearchLoop(this.var_interval);
    // this.socket.emit('stopGame');
  }

  getId(id: string){
    // this.id = id; //doesnt work
    const divId = document.getElementById('idGame');

    divId!.innerHTML = id;
    // console.log("getId", this.id);
  }

  newGame(normalOrNot: boolean)
  {
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    var   arr = ["Searching opponent.", "Searching opponent..", "Searching opponent..."];
    var   i = 1;


    this.disableElement('buttonStart');
    this.disableElement('buttonStartRandom');

    this.socket.emit('newGame', normalOrNot);
  }

  // idMessage(socket: Socket, id: {
  //   id: string
  // })
  // {
  //   if (id)
  //     this.user.id = id.id;
  // }

  disableElement(elemName: string)
  {
    var element = document.getElementById(elemName);
    if (element)
     {
       element.setAttribute('disabled', 'true');
     }
  }

  enableElement(elemName: string)
  {
    var element = document.getElementById(elemName);
    if (element)
      element.removeAttribute('disabled');
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

  enableButtonS()
  {
    var element = document.getElementById("buttonStart");
    if (element)
      element.removeAttribute('disabled');
  }

  /// JEEU 



  drawName(side: number)
  {
    const left = document.getElementById('leftName');
    const right = document.getElementById('rightName');
  }
};
