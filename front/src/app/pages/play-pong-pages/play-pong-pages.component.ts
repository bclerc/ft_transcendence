import { Component, HostListener } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
// import { Subscription } from 'rxjs';
import { GameI } from '../../models/PongInterfaces/pong.interface';
import { ScoreI } from '../../models/PongInterfaces/score.interface';
import { UserI } from '../../models/PongInterfaces/user.interface';

const PLAYER_RADIUS = 3.5;
const FONT = 33;
const CANVAS_RADIUS = 20;
const BALL_RADIUS = 4;
const PLAYER_HEIGHT = 65;
const PLAYER_WIDTH = 8;
const HEIGHTCANVAS = 400;
const WIDTHCANVAS = 500;
const WALL = 0;
const PADDLE = 1;
const MISS = 2;

@Component({
  selector: 'app-root',
  templateUrl: './play-pong-pages.component.html',
  styleUrls: ['./play-pong-pages.component.css']
})
@Injectable(
  {providedIn: 'root'}
)
export class PlayPongPagesComponent {
  title = 'Best Pong Ever'; //titre page
  user: UserI = {};
  private var_interval: number;

  // private audio1;
  // private audio2;
  // private audio3;

  
  constructor(private router: Router, private socket: Socket) {
    console.log("constructor");
    // socket.on('score', this.updateScore);
    // socket.on('draw', this.drawMessage);
    // socket.on('id', this.idMessage);
    // socket.on('enableButtonS', this.enableButtonS);
    // socket.on('drawInit', this.drawInit);
    // socket.on('drawText', this.drawText);
    // socket.on('drawName', this.drawName);
    // socket.on('stopSearchLoop', this.stopSearchLoop);
    // socket.on('win', this.win);
    // socket.on('lose', this.lose);
    // socket.on('play', this.playAudio);
    this.var_interval = 0;
    console.log("constructor end");

    // this.audio1 = new Audio();
    // this.audio2 = new Audio();
    // this.audio3 = new Audio();
    
    // this.audio1.src = "../../../assets/audio/ping_pong_8bit_plop.wav";
    // this.audio1.load();
    // this.audio2.src = "../../../assets/audio/ping_pong_8bit_beeep.wav";
    // this.audio2.load();
    // this.audio3.src = "../../../assets/audio/ping_pong_8bit_peeeeeep.wav";
    // this.audio3.load();
  }

  ngOnInit(): void {
    console.log("ngoninit");
    this.socket.on('score', this.updateScore);
    this.socket.on('draw', this.drawMessage);
    this.socket.on('id', this.idMessage);
    this.socket.on('enableButtonS', this.enableButtonS);
    this.socket.on('drawInit', this.drawInit);
    this.socket.on('drawText', this.drawText);
    this.socket.on('drawName', this.drawName);
    this.socket.on('stopSearchLoop', this.stopSearchLoop);
    this.socket.on('win', this.win);
    this.socket.on('lose', this.lose);
    // this.socket.on('play', this.playAudio);
    this.socket.emit('init');

    // this.var_interval = 0;
    console.log("ngoninit end");
  }
  
  ngOnDestroy(): void {
    console.log("ngondestroy");
    this.stopSearchLoop(this.var_interval);
    this.socket.emit('stopGame', {});
    console.log("ngondestroy end");
  }
  // @HostListener('document:keypress', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === 'z') {
  //     // event.
  //     this.sock.emit('keypress', { key: event.key });
  //     console.log(event.key);
  //   }
  //   else if (event.key === 's') {
  //     this.sock.emit('keypress', { key: event.key });
  //     console.log(event.key);
  //   }
  //   //send keypress to server

  //   // else if (event.key === 's') {
  //     // client.emit('keypress', { key: 'z' });
  //   // }
  // }

  @HostListener('document:keydown.z', ['$event'])  //$event is the event object
  handleKeyboardDownZ(event: KeyboardEvent) {
      // console.log("key down", event.key);
      this.socket.emit('keydownZ');
  }
  
  @HostListener('document:keydown.w', ['$event'])  //$event is the event object
  handleKeyboardDownW(event: KeyboardEvent) {
      // console.log("key down www", event.key);
      this.socket.emit('keydownW');
  }

  @HostListener('document:keydown.s', ['$event'])  //$event is the event object
  handleKeyboardDownS(event: KeyboardEvent) {
      // console.log("key down", event.key);
      this.socket.emit('keydownS');
    }

  @HostListener('document:keyup.z', ['$event'])  //$event is the event object
  handleKeyboardUpZ() {
    // console.log("key up", event.key);
    this.socket.emit('keyupZ');
  }

  @HostListener('document:keyup.w', ['$event'])  //$event is the event object
  handleKeyboardUpW() {
    // console.log("key up", event.key);
    this.socket.emit('keyupW');
  }

  @HostListener('document:keyup.s', ['$event'])  //$event is the event object
  handleKeyboardUpS() {
    // console.log("key up", event.key);
    this.socket.emit('keyupS');
  }

  updateScore(score: ScoreI){
    // console.log(score);
    var htmlScore = document.getElementById('score');
    if (htmlScore)
    {
      var str = score.score1 + " : " + score.score2;
      htmlScore.innerHTML = str;
    }
  }

  stop()
  {
    this.socket.emit('stopGame', {});
    // this.enableElement("buttonDemo");
    this.enableElement("buttonNewGame");
    // console.log(this.var_interval);
    if (this.var_interval != 0)
    {
      window.clearInterval(this.var_interval);
      this.var_interval = 0;
    }

    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
      var context = canvas.getContext('2d');
      if (context)
        this.drawInit();
    }
}

  newGame()
  {
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    var   arr = ["Searching opponent.", "Searching opponent..", "Searching opponent..."];
    var   i = 1;
    
    this.disableElement('buttonStart');
    if (canvas)
    {
      var context = canvas.getContext('2d');
      if (context)
      {
        context.fillStyle = 'white';
        context.font = FONT + 'px streetartfont';
        context.fillText(arr[0], WIDTHCANVAS / 4 - FONT, HEIGHTCANVAS / 2 - 10);
      }
    }
    this.socket.emit('newGame');
    this.var_interval = window.setInterval(() => {
      if (canvas && context)
      {
        this.socket.emit('id_interval', this.var_interval);
        this.drawInit();
        context.fillText(arr[i], WIDTHCANVAS / 4 - FONT, HEIGHTCANVAS / 2 - 10 );
        i++;
        if (i == 3)
          i = 0;
      }
    }, 1000);
  }


  newGameAnimationFrame()
  {
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    var   arr = ["Searching opponent.", "Searching opponent..", "Searching opponent..."];
    var   i = 1;
    
    this.disableElement('buttonStart');
    if (canvas)
    {
      var context = canvas.getContext('2d');
      if (context)
      {
        context.fillStyle = 'white';
        context.font = FONT + 'px streetartfont';
        context.fillText(arr[0], WIDTHCANVAS / 4 - FONT, HEIGHTCANVAS / 2 - 10);
      }
    }
    this.socket.emit('newGame');
    this.var_interval = window.setInterval(() => {
      if (canvas && context)
      {
        this.socket.emit('id_interval', this.var_interval);
        this.drawInit();
        context.fillText(arr[i], WIDTHCANVAS / 4 - FONT, HEIGHTCANVAS / 2 - 10 );
        i++;
        if (i == 3)
          i = 0;
      }
    }, 1000);
  }


  idMessage(socket: Socket, id: {
    id: string
  })
  {
    console.log("idmessage:" + id);
    if (id)
      this.user.id = id.id;
  }

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

  win()
  {
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
      var context = canvas.getContext('2d');
      if (context)
      {
        context.fillStyle = 'white';
        context.font = FONT + 'px streetartfont';
        context.fillText("YOU WIN", WIDTHCANVAS / 2 - FONT * 2, HEIGHTCANVAS / 2 - 10);
        console.log("win");
      }
    }
  }

  lose()
  {
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
      var context = canvas.getContext('2d');
      if (context)
      {
        context.fillStyle = 'white';
        context.font = FONT + 'px streetartfont';
        context.fillText("YOU LOSE", WIDTHCANVAS / 2 - FONT * 2, HEIGHTCANVAS / 2 - 10);
        // context.fillText("YOU LOSE", 300, 300, 500);
        console.log("LOSE");
      }
    }
  }

  playAudio(type: number){
    let audio = new Audio();
    if (type == WALL)
      audio.src = "../../../assets/audio/ping_pong_8bit_plop.wav";
    else if (type == PADDLE)
      audio.src = "../../../assets/audio/ping_pong_8bit_beeep.wav";
    else if (type == MISS)
      audio.src = "../../../assets/audio/ping_pong_8bit_peeeeeep.wav";
    audio.load();
    audio.play();
    // if (type == WALL)
    //   this.audio1.play();
    // else if (type == PADDLE)
    //   this.audio2.play();
    // else if (type == MISS)
    //   this.audio3.play();
  }

  drawText(text: string)
  {
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
      var context = canvas.getContext('2d');
      if (context)
      {
        context.fillStyle = 'white';
        context.font = FONT + 'px streetartfont';
        if (text == "Start !")
          context.fillText(text, WIDTHCANVAS / 2 - FONT - 20, HEIGHTCANVAS / 2 - 10);
        else
          context.fillText(text, WIDTHCANVAS / 2 - 10, HEIGHTCANVAS / 2 - 10);
      }
    }
  }

  drawName(side: number)
  {
    const left = document.getElementById('leftName');
    const right = document.getElementById('rightName');
    if (left && right)
    {
      console.log("drawName");
      if (side == 1)
      {
        left.innerHTML = "You";
        right.innerHTML = "Opponent";
      }
      else
      {
        left.innerHTML = "Opponent";
        right.innerHTML = "You";
      }
    }
  }

  drawMessage(state: GameI){
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
        var context = canvas.getContext('2d');
        if (context)
        {
          //load font car il ne se charge pas des le chargement (??????)
          // context.font = FONT + 'px streetartfont';
          // context.fillText('', 0, 0, 0);


          // Draw rectangle noir
          context.fillStyle = 'black';
          context.beginPath();
          context.arc(0 + CANVAS_RADIUS, 0 + CANVAS_RADIUS, CANVAS_RADIUS, Math.PI, Math.PI * 3 / 2);   
          context.lineTo(canvas.width - CANVAS_RADIUS + 0, 0);   
          context.arc(canvas.width - CANVAS_RADIUS + 0, CANVAS_RADIUS + 0, CANVAS_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
          context.lineTo(canvas.width + 0, canvas.height + 0 - CANVAS_RADIUS);   
          context.arc(canvas.width - CANVAS_RADIUS + 0, canvas.height - CANVAS_RADIUS + 0, CANVAS_RADIUS, 0, Math.PI * 1 / 2);   
          context.lineTo(CANVAS_RADIUS + 0, canvas.height + 0);
          context.arc(CANVAS_RADIUS + 0, canvas.height - CANVAS_RADIUS + 0, CANVAS_RADIUS, Math.PI * 1 / 2, Math.PI);
          context.fill();

        
          // Draw middle line
          context.strokeStyle = 'white';
          context.beginPath();
          context.moveTo(canvas.width / 2, 0);
          context.lineTo(canvas.width / 2, canvas.height);
          context.stroke();
        
          // Draw paddle1
          context.fillStyle = 'white';
          if (state.player1 && state.player1.paddle)
          {
            context.beginPath();
            context.arc(state.player1.paddle.x + PLAYER_RADIUS, state.player1.paddle.y + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);   
            context.lineTo(state.player1.paddle.width - PLAYER_RADIUS + state.player1.paddle.x, state.player1.paddle.y);   
            context.arc(state.player1.paddle.width - PLAYER_RADIUS + state.player1.paddle.x, PLAYER_RADIUS + state.player1.paddle.y, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(state.player1.paddle.width + state.player1.paddle.x, state.player1.paddle.height + state.player1.paddle.y - PLAYER_RADIUS);   
            context.arc(state.player1.paddle.width - PLAYER_RADIUS + state.player1.paddle.x, state.player1.paddle.height - PLAYER_RADIUS + state.player1.paddle.y, PLAYER_RADIUS, state.player1.paddle.x, Math.PI * 1 / 2);   
            context.lineTo(PLAYER_RADIUS + state.player1.paddle.x, state.player1.paddle.height +state.player1.paddle.y);   
            context.arc(PLAYER_RADIUS + state.player1.paddle.x, state.player1.paddle.height - PLAYER_RADIUS + state.player1.paddle.y, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
          }

          // Draw paddle2          
          if (state.player2 && state.player2.paddle)
          {
            context.beginPath();
            context.arc(state.player2.paddle.x + PLAYER_RADIUS, state.player2.paddle.y + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);
            context.lineTo(state.player2.paddle.width - PLAYER_RADIUS + state.player2.paddle.x, state.player2.paddle.y);   
            context.arc(state.player2.paddle.width - PLAYER_RADIUS + state.player2.paddle.x, PLAYER_RADIUS + state.player2.paddle.y, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(state.player2.paddle.width + state.player2.paddle.x, state.player2.paddle.height + state.player2.paddle.y - PLAYER_RADIUS);   
            context.arc(state.player2.paddle.width - PLAYER_RADIUS + state.player2.paddle.x, state.player2.paddle.height - PLAYER_RADIUS + state.player2.paddle.y, PLAYER_RADIUS, state.player2.paddle.x, Math.PI * 1 / 2);   
            context.lineTo(PLAYER_RADIUS + state.player2.paddle.x, state.player2.paddle.height +state.player2.paddle.y);   
            context.arc(PLAYER_RADIUS + state.player2.paddle.x, state.player2.paddle.height - PLAYER_RADIUS + state.player2.paddle.y, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
          }
            
          // Draw ball
          context.beginPath();
          context.fillStyle = 'white';
          if (state.ball && state.ball.radius)
            context.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2, false);
          context.fill();
        }
      }
  }

  drawInit() {
      var p1 = {
          // user: UserI;
          // socket: Socket,
          paddle: {
          x: 0,
          y: HEIGHTCANVAS / 2 - PLAYER_HEIGHT / 2,
          dx: 0,
          dy: 0,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT
        },
          points: 0
      };
  
      var p2 = {
          // user: UserI;
          // socket: Socket;
          paddle: {
          x: WIDTHCANVAS - PLAYER_WIDTH,
          y: HEIGHTCANVAS / 2 - PLAYER_HEIGHT / 2,
          dx: 0,
          dy: 0,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT
        },
          points: 0
      };
  
      var state: GameI = {
        id: "1",
        player1: p1,
        player2: p2,
        // acceleration: 4,
              // direction: {
              //     x: 0,
              //     y: 0,
              //     dx: 0,
              //     dy: 0,
              //     height: 0,
              //     width: 0
              // },
              type: 0,
        // score1: 0,
        // score2: 0,
        ball: {
          x: WIDTHCANVAS / 2,
          y: HEIGHTCANVAS / 2,
          dx: -2,
          dy: -2,
          speed: 2,
          width: 5,
          height: 5,
          radius: BALL_RADIUS
        },
      }

      const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
      // console.log("canvas?");
      if (canvas)
      {
          // console.log("canvas exist");
          var context = canvas.getContext('2d');
          if (context)
          {
            //load font car il ne se charge pas des le chargement (??????)
            context.font = FONT + 'px streetartfont';
            context.fillText('', 160, 0, 0);
  
            // Draw rectangle noir
            context.fillStyle = 'black';
            context.beginPath();
            context.arc(0 + CANVAS_RADIUS, 0 + CANVAS_RADIUS, CANVAS_RADIUS, Math.PI, Math.PI * 3 / 2);   
            context.lineTo(canvas.width - CANVAS_RADIUS + 0, 0);   
            context.arc(canvas.width - CANVAS_RADIUS + 0, CANVAS_RADIUS + 0, CANVAS_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(canvas.width + 0, canvas.height + 0 - CANVAS_RADIUS);   
            context.arc(canvas.width - CANVAS_RADIUS + 0, canvas.height - CANVAS_RADIUS + 0, CANVAS_RADIUS, 0, Math.PI * 1 / 2);   
            context.lineTo(CANVAS_RADIUS + 0, canvas.height + 0);
            context.arc(CANVAS_RADIUS + 0, canvas.height - CANVAS_RADIUS + 0, CANVAS_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
  
          
            // Draw middle line
            context.strokeStyle = 'white';
            context.beginPath();
            context.moveTo(canvas.width / 2, 0);
            context.lineTo(canvas.width / 2, canvas.height);
            context.stroke();
          
            // Draw paddle1
            context.fillStyle = 'white';
            if (state.player1 && state.player1.paddle)
            {
              context.beginPath();
              context.arc(state.player1.paddle.x + PLAYER_RADIUS, state.player1.paddle.y + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);   
              context.lineTo(state.player1.paddle.width - PLAYER_RADIUS + state.player1.paddle.x, state.player1.paddle.y);   
              context.arc(state.player1.paddle.width - PLAYER_RADIUS + state.player1.paddle.x, PLAYER_RADIUS + state.player1.paddle.y, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
              context.lineTo(state.player1.paddle.width + state.player1.paddle.x, state.player1.paddle.height + state.player1.paddle.y - PLAYER_RADIUS);   
              context.arc(state.player1.paddle.width - PLAYER_RADIUS + state.player1.paddle.x, state.player1.paddle.height - PLAYER_RADIUS + state.player1.paddle.y, PLAYER_RADIUS, state.player1.paddle.x, Math.PI * 1 / 2);   
              context.lineTo(PLAYER_RADIUS + state.player1.paddle.x, state.player1.paddle.height +state.player1.paddle.y);   
              context.arc(PLAYER_RADIUS + state.player1.paddle.x, state.player1.paddle.height - PLAYER_RADIUS + state.player1.paddle.y, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
              context.fill();
            }
  
            // Draw paddle2          
            if (state.player2 && state.player2.paddle)
            {
              context.beginPath();
              context.arc(state.player2.paddle.x + PLAYER_RADIUS, state.player2.paddle.y + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);
              context.lineTo(state.player2.paddle.width - PLAYER_RADIUS + state.player2.paddle.x, state.player2.paddle.y);   
              context.arc(state.player2.paddle.width - PLAYER_RADIUS + state.player2.paddle.x, PLAYER_RADIUS + state.player2.paddle.y, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
              context.lineTo(state.player2.paddle.width + state.player2.paddle.x, state.player2.paddle.height + state.player2.paddle.y - PLAYER_RADIUS);   
              context.arc(state.player2.paddle.width - PLAYER_RADIUS + state.player2.paddle.x, state.player2.paddle.height - PLAYER_RADIUS + state.player2.paddle.y, PLAYER_RADIUS, state.player2.paddle.x, Math.PI * 1 / 2);   
              context.lineTo(PLAYER_RADIUS + state.player2.paddle.x, state.player2.paddle.height +state.player2.paddle.y);   
              context.arc(PLAYER_RADIUS + state.player2.paddle.x, state.player2.paddle.height - PLAYER_RADIUS + state.player2.paddle.y, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
              context.fill();
            }
              
            // Draw ball
            context.beginPath();
            context.fillStyle = 'white';
            if (state.ball && state.ball.radius)
              context.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2, false);
            context.fill();
          }
        }
    }
  };
