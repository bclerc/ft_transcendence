import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { GameI } from 'src/app/models/PongInterfaces/pong.interface';
import { ScoreI } from 'src/app/models/PongInterfaces/score.interface';
import { UserI } from 'src/app/models/user.models';
import { TokenStorageService } from 'src/app/services/auth/token.storage';
import { environment } from 'src/environments/environment';


const PLAYER_RADIUS = 3.5;
const CANVAS_RADIUS = 6;
const BALL_RADIUS = 4;
const PLAYER_HEIGHT = 80;
const PLAYER_WIDTH = 8;
const HEIGHTCANVAS = 400;
const WIDTHCANVAS = 600;
const FONT = 33;

///
// obstacls configs
///
//
// MAP1
/////// obstacle1
export const MAP1_OBSTACLE1_W = 40; // width
export const MAP1_OBSTACLE1_H = 125; // height
export const MAP1_OBSTACLE1_POSX = (WIDTHCANVAS / 2) - (MAP1_OBSTACLE1_W / 2); // position x
export const MAP1_OBSTACLE1_POSY = 0; // position y
export const MAP1_OBSTACLE1_RADIUS = 2;
///////// obstacle2
export const MAP1_OBSTACLE2_W = 40; // width
export const MAP1_OBSTACLE2_H = 125; // height
export const MAP1_OBSTACLE2_POSX = (WIDTHCANVAS / 2) - (MAP1_OBSTACLE2_W / 2); // position x
export const MAP1_OBSTACLE2_POSY = (HEIGHTCANVAS - MAP1_OBSTACLE2_H); // position x
export const MAP1_OBSTACLE2_RADIUS = 2;
////
////
//// MAP2
///////// obstacle1
export const MAP2_OBSTACLE_W = 40; // width
export const MAP2_OBSTACLE_H = 130; // height
export const MAP2_OBSTACLE_POSX = (WIDTHCANVAS / 2) - (MAP2_OBSTACLE_W / 2); // position x
export const MAP2_OBSTACLE_POSY = 0; // position y
export const MAP2_OBSTACLE_SPEED = 1;
export const MAP2_OBSTACLE_RADIUS = 2;
//
//
//// MAP3
///////// obstacle1
export const MAP3_OBSTACLE1_W = 250; // width
export const MAP3_OBSTACLE1_H = 20; // height
export const MAP3_OBSTACLE1_POSX = (WIDTHCANVAS / 2) - (MAP3_OBSTACLE1_W / 2); // position x
export const MAP3_OBSTACLE1_POSY = ((HEIGHTCANVAS / 2) - MAP3_OBSTACLE1_H) / 2; // position y
export const MAP3_OBSTACLE1_SPEED = 1;
export const MAP3_OBSTACLE1_RADIUS = 2;
//
///////// obstacle2
export const MAP3_OBSTACLE2_W = 250; // width
export const MAP3_OBSTACLE2_H = 20; // height
export const MAP3_OBSTACLE2_POSX = (WIDTHCANVAS / 2) - (MAP3_OBSTACLE2_W / 2); // position x
export const MAP3_OBSTACLE2_POSY = (HEIGHTCANVAS / 2) + (( HEIGHTCANVAS / 2 - MAP3_OBSTACLE2_H) / 2); // position y
export const MAP3_OBSTACLE2_SPEED = 1;
export const MAP3_OBSTACLE2_RADIUS = 2;
//

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})


export class PlayComponent implements OnInit {

  gameId: number;
  game: any;
  state!: number;
  user: UserI = {};

  constructor(
    private router: Router,
    private socket: Socket,
    private http: HttpClient,
    private storage: TokenStorageService
  )
  {
    this.gameId = parseInt(this.router.url.split('/')[2]);
    this.socket.on('drawNormalMap', this.drawNormalMap);
    this.socket.on('drawMap1', this.drawMap1);
    this.socket.on('drawMap2', this.drawMap2);
    this.socket.on('drawMap3', this.drawMap3);
    this.socket.on('score', this.updateScore);

    this.socket.on('win', this.win);
    this.socket.on('lose', this.lose);
 
    this.socket.on('drawInit', this.drawInit);
    this.socket.on('drawText', this.drawText);
    this.socket.on('drawName', this.drawName);
  }
  
  ngOnInit(): void {
    this.gameId = parseInt(this.router.url.split('/')[2]);
    this.http.get<boolean>("http://" + environment.host + ":3000/api/v1/game/" + this.gameId , {headers: new HttpHeaders({'Authorization' : 'Bearer ' + this.storage.getToken()})}).subscribe({
      next: (data) => {
        if (!data) {
          this.router.navigate(['/game']);
        }
        this.game = data;
        if (this.game.state == "ENDED"){
          this.state = 2;
        } else {
          this.state = 1; 
        }
      }
    });
    //check if player or not is necessary ??
    this.socket.emit('spectate', this.gameId);
  }

  ngOnDestroy(): void {
    this.socket.emit('deleteSpectate', this.gameId);
  }


  @HostListener('document:keydown',['$event'])  //$event is the event object
  handleKeyboardDown(event: KeyboardEvent) {
      this.socket.emit('keydown', event.key);
  }

  @HostListener('document:keyup',['$event'])  //$event is the event object
  handleKeyboardUp(event: KeyboardEvent) {
      this.socket.emit('keyup', event.key);
  }

  
  // Make a new score system with ws
  updateScore(score: ScoreI){
    var htmlScore = document.getElementById('score');
    if (htmlScore)
    {
      var str = score.score1 + " : " + score.score2;
      htmlScore.innerHTML = str;
    }
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
      }
    }
  }

  drawText(text: string)
  {
    // this.ratiox = this.getRatiox();
    // this.ratioy = this.getRatioy();
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
      var context = canvas.getContext('2d');
      if (context)
      {
        context.fillStyle = 'white';
        context.font = FONT + 'px streetartfont';
        if (text == "Start !")
          context.fillText(text, (canvas.width) / 2 - FONT - 20, (canvas.height) / 2 - 10);
        else
          context.fillText(text, (canvas.width) / 2 - 10, (canvas.height) / 2 - 10);
      }
    }
  }

  onResizeWin(event: any)
  {
    // if (event && event.target)
      // console.log(event.target.innerHeight);
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
      canvas.height = event.target.innerHeight;
      canvas.width = event.target.innerWidth;
      // console.log("canvasH",canvas.width);
      // console.log("canvasW",canvas.height);
    }
    this.drawInit();
  }

  drawName(side: number)
  {
    const left = document.getElementById('leftName');
    const right = document.getElementById('rightName');
  }

  drawNormalMap(state: GameI){

    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    // const canvas = this.canvas;
    if (canvas)
    {
      var ratiox = canvas.width / WIDTHCANVAS;
      var ratioy = canvas.height / HEIGHTCANVAS;
      var ratio = canvas.width * canvas!.height / (WIDTHCANVAS * HEIGHTCANVAS);
        var context = canvas.getContext('2d');
        if (context)
        {
          context.fillStyle = 'black';
          context.beginPath();
          context.arc(CANVAS_RADIUS, CANVAS_RADIUS, CANVAS_RADIUS, Math.PI, Math.PI * 3 / 2);   
          context.lineTo(canvas.width - CANVAS_RADIUS, 0);   
          context.arc(canvas.width - CANVAS_RADIUS, CANVAS_RADIUS, CANVAS_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
          context.lineTo(canvas.width, canvas.height - CANVAS_RADIUS);   
          context.arc(canvas.width - CANVAS_RADIUS, canvas.height - CANVAS_RADIUS, CANVAS_RADIUS, 0, Math.PI * 1 / 2);   
          context.lineTo(CANVAS_RADIUS, canvas.height);
          context.arc(CANVAS_RADIUS, canvas.height - CANVAS_RADIUS, CANVAS_RADIUS, Math.PI * 1 / 2, Math.PI);
          context.fill();

          // Draw ball
          context.beginPath();
          context.fillStyle = 'white';
          if (state.ball && state.ball.radius)
            context.arc(state.ball.x * ratiox, state.ball.y * ratioy, state.ball.radius * ratio, 0, Math.PI * 2, false);
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
            context.arc(state.player1.paddle.x * ratiox + PLAYER_RADIUS, state.player1.paddle.y * ratioy + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);   
            context.lineTo(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.y * ratioy);   
            context.arc(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(state.player1.paddle.width * ratiox + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy + state.player1.paddle.y * ratioy - PLAYER_RADIUS);   
            context.arc(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy - PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, state.player1.paddle.x * ratiox, Math.PI * 1 / 2);   
            context.lineTo(PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy +state.player1.paddle.y * ratioy);   
            context.arc(PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy - PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
          }

          // Draw paddle2          
          if (state.player2 && state.player2.paddle)
          {
            context.beginPath();
            context.arc(state.player2.paddle.x * ratiox + PLAYER_RADIUS, state.player2.paddle.y * ratioy + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);
            context.lineTo(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.y * ratioy);   
            context.arc(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(state.player2.paddle.width * ratiox + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy + state.player2.paddle.y * ratioy - PLAYER_RADIUS);   
            context.arc(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy - PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, state.player2.paddle.x * ratiox, Math.PI * 1 / 2);   
            context.lineTo(PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy +state.player2.paddle.y * ratioy);   
            context.arc(PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy - PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
          } 
        }
      }
  }

  drawMap1(state: GameI){
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
      var ratiox = canvas.width / WIDTHCANVAS;
      var ratioy = canvas.height / HEIGHTCANVAS;
      var ratio = canvas.width * canvas!.height / (WIDTHCANVAS * HEIGHTCANVAS);
        var context = canvas.getContext('2d');
        if (context)
        {
          // Draw rectangle noir
          context.fillStyle = 'black';
          context.beginPath();
          context.arc(CANVAS_RADIUS, CANVAS_RADIUS, CANVAS_RADIUS, Math.PI, Math.PI * 3 / 2);   
          context.lineTo(canvas.width - CANVAS_RADIUS, 0);   
          context.arc(canvas.width - CANVAS_RADIUS, CANVAS_RADIUS, CANVAS_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
          context.lineTo(canvas.width, canvas.height - CANVAS_RADIUS);   
          context.arc(canvas.width - CANVAS_RADIUS, canvas.height - CANVAS_RADIUS, CANVAS_RADIUS, 0, Math.PI * 1 / 2);   
          context.lineTo(CANVAS_RADIUS, canvas.height);
          context.arc(CANVAS_RADIUS, canvas.height - CANVAS_RADIUS, CANVAS_RADIUS, Math.PI * 1 / 2, Math.PI);
          context.fill();
        
          // Draw middle line
          context.strokeStyle = 'white';
          context.beginPath();
          context.moveTo(canvas.width / 2, 0);
          context.lineTo(canvas.width / 2, canvas.height);
          context.stroke();
        
          // Draw obstacle1
          context.fillStyle = 'white';
          context.beginPath();
          context.arc(MAP1_OBSTACLE1_POSX * ratiox + MAP1_OBSTACLE1_RADIUS, MAP1_OBSTACLE1_POSY * ratioy + MAP1_OBSTACLE1_RADIUS, MAP1_OBSTACLE1_RADIUS, Math.PI, Math.PI * 3 / 2);
          context.lineTo(MAP1_OBSTACLE1_W * ratiox - MAP1_OBSTACLE1_RADIUS + MAP1_OBSTACLE1_POSX * ratiox, MAP1_OBSTACLE1_POSY * ratioy);   
          context.arc(MAP1_OBSTACLE1_W * ratiox - MAP1_OBSTACLE1_RADIUS + MAP1_OBSTACLE1_POSX * ratiox, MAP1_OBSTACLE1_RADIUS + MAP1_OBSTACLE1_POSY * ratioy, MAP1_OBSTACLE1_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
          context.lineTo(MAP1_OBSTACLE1_W * ratiox + MAP1_OBSTACLE1_POSX * ratiox, MAP1_OBSTACLE1_H * ratioy + MAP1_OBSTACLE1_POSY * ratioy - MAP1_OBSTACLE1_RADIUS);   
          context.arc(MAP1_OBSTACLE1_W * ratiox - MAP1_OBSTACLE1_RADIUS + MAP1_OBSTACLE1_POSX * ratiox, MAP1_OBSTACLE1_H * ratioy - MAP1_OBSTACLE1_RADIUS + MAP1_OBSTACLE1_POSY * ratioy, MAP1_OBSTACLE1_RADIUS, MAP1_OBSTACLE1_POSX * ratiox, Math.PI * 1 / 2);   
          context.lineTo(MAP1_OBSTACLE1_RADIUS + MAP1_OBSTACLE1_POSX * ratiox, MAP1_OBSTACLE1_H * ratioy +MAP1_OBSTACLE1_POSY * ratioy);   
          context.arc(MAP1_OBSTACLE1_RADIUS + MAP1_OBSTACLE1_POSX * ratiox, MAP1_OBSTACLE1_H * ratioy - MAP1_OBSTACLE1_RADIUS + MAP1_OBSTACLE1_POSY * ratioy, MAP1_OBSTACLE1_RADIUS, Math.PI * 1 / 2, Math.PI);
          context.fill();

          // Draw obstacle2
          context.fillStyle = 'white';
          context.beginPath();
          context.arc(MAP1_OBSTACLE2_POSX * ratiox + MAP1_OBSTACLE2_RADIUS, MAP1_OBSTACLE2_POSY * ratioy + MAP1_OBSTACLE2_RADIUS, MAP1_OBSTACLE2_RADIUS, Math.PI, Math.PI * 3 / 2);
          context.lineTo(MAP1_OBSTACLE2_W * ratiox - MAP1_OBSTACLE2_RADIUS + MAP1_OBSTACLE2_POSX * ratiox, MAP1_OBSTACLE2_POSY * ratioy);   
          context.arc(MAP1_OBSTACLE2_W * ratiox - MAP1_OBSTACLE2_RADIUS + MAP1_OBSTACLE2_POSX * ratiox, MAP1_OBSTACLE2_RADIUS + MAP1_OBSTACLE2_POSY * ratioy, MAP1_OBSTACLE2_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
          context.lineTo(MAP1_OBSTACLE2_W * ratiox + MAP1_OBSTACLE2_POSX * ratiox, MAP1_OBSTACLE2_H * ratioy + MAP1_OBSTACLE2_POSY * ratioy - MAP1_OBSTACLE2_RADIUS);   
          context.arc(MAP1_OBSTACLE2_W * ratiox - MAP1_OBSTACLE2_RADIUS + MAP1_OBSTACLE2_POSX * ratiox, MAP1_OBSTACLE2_H * ratioy - MAP1_OBSTACLE2_RADIUS + MAP1_OBSTACLE2_POSY * ratioy, MAP1_OBSTACLE2_RADIUS, MAP1_OBSTACLE2_POSX * ratiox, Math.PI * 1 / 2);   
          context.lineTo(MAP1_OBSTACLE2_RADIUS + MAP1_OBSTACLE2_POSX * ratiox, MAP1_OBSTACLE2_H * ratioy +MAP1_OBSTACLE2_POSY * ratioy);   
          context.arc(MAP1_OBSTACLE2_RADIUS + MAP1_OBSTACLE2_POSX * ratiox, MAP1_OBSTACLE2_H * ratioy - MAP1_OBSTACLE2_RADIUS + MAP1_OBSTACLE2_POSY * ratioy, MAP1_OBSTACLE2_RADIUS, Math.PI * 1 / 2, Math.PI);
          context.fill();


          // Draw paddle1
          context.fillStyle = 'white';
          if (state.player1 && state.player1.paddle)
          {
            context.beginPath();
            context.arc(state.player1.paddle.x * ratiox + PLAYER_RADIUS, state.player1.paddle.y * ratioy + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);   
            context.lineTo(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.y * ratioy);   
            context.arc(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(state.player1.paddle.width * ratiox + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy + state.player1.paddle.y * ratioy - PLAYER_RADIUS);   
            context.arc(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy - PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, state.player1.paddle.x * ratiox, Math.PI * 1 / 2);   
            context.lineTo(PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy +state.player1.paddle.y * ratioy);   
            context.arc(PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy - PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
          }

          // Draw paddle2          
          if (state.player2 && state.player2.paddle)
          {
            context.beginPath();
            context.arc(state.player2.paddle.x * ratiox + PLAYER_RADIUS, state.player2.paddle.y * ratioy + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);
            context.lineTo(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.y * ratioy);   
            context.arc(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(state.player2.paddle.width * ratiox + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy + state.player2.paddle.y * ratioy - PLAYER_RADIUS);   
            context.arc(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy - PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, state.player2.paddle.x * ratiox, Math.PI * 1 / 2);   
            context.lineTo(PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy +state.player2.paddle.y * ratioy);   
            context.arc(PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy - PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
          }

          // Draw ball
          context.beginPath();
          context.fillStyle = 'white';
          if (state.ball && state.ball.radius)
            context.arc(state.ball.x * ratiox, state.ball.y * ratioy, state.ball.radius * ratio, 0, Math.PI * 2, false);
          context.fill();
        }
      }
  }

  drawMap2(state: GameI){
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
      var ratiox = canvas.width / WIDTHCANVAS;
      var ratioy = canvas.height / HEIGHTCANVAS;
      var ratio = canvas.width * canvas!.height / (WIDTHCANVAS * HEIGHTCANVAS);
        var context = canvas.getContext('2d');
        if (context)
        {
          // Draw rectangle noir
          context.fillStyle = 'black';
          context.beginPath();
          context.arc(CANVAS_RADIUS, CANVAS_RADIUS, CANVAS_RADIUS, Math.PI, Math.PI * 3 / 2);   
          context.lineTo(canvas.width - CANVAS_RADIUS, 0);   
          context.arc(canvas.width - CANVAS_RADIUS, CANVAS_RADIUS, CANVAS_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
          context.lineTo(canvas.width, canvas.height - CANVAS_RADIUS);   
          context.arc(canvas.width - CANVAS_RADIUS, canvas.height - CANVAS_RADIUS, CANVAS_RADIUS, 0, Math.PI * 1 / 2);   
          context.lineTo(CANVAS_RADIUS, canvas.height);
          context.arc(CANVAS_RADIUS, canvas.height - CANVAS_RADIUS, CANVAS_RADIUS, Math.PI * 1 / 2, Math.PI);
          context.fill();

        
          // Draw middle line
          context.strokeStyle = 'white';
          context.beginPath();
          context.moveTo(canvas.width / 2, 0);
          context.lineTo(canvas.width / 2, canvas.height);
          context.stroke();
        
          // Draw obstacle
          context.fillStyle = 'white';
          // context.strokeStyle = 'white';
          context.beginPath();
          context.arc(state.obstacle.x * ratiox + MAP2_OBSTACLE_RADIUS, state.obstacle.y * ratioy + MAP2_OBSTACLE_RADIUS, MAP2_OBSTACLE_RADIUS, Math.PI, Math.PI * 3 / 2);
          context.lineTo(state.obstacle.width * ratiox - MAP2_OBSTACLE_RADIUS + state.obstacle.x * ratiox, state.obstacle.y * ratioy);   
          context.arc(state.obstacle.width * ratiox - MAP2_OBSTACLE_RADIUS + state.obstacle.x * ratiox, MAP2_OBSTACLE_RADIUS + state.obstacle.y * ratioy, MAP2_OBSTACLE_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
          context.lineTo(state.obstacle.width * ratiox + state.obstacle.x * ratiox, state.obstacle.height * ratioy + state.obstacle.y * ratioy - MAP2_OBSTACLE_RADIUS);   
          context.arc(state.obstacle.width * ratiox - MAP2_OBSTACLE_RADIUS + state.obstacle.x * ratiox, state.obstacle.height * ratioy - MAP2_OBSTACLE_RADIUS + state.obstacle.y * ratioy, MAP2_OBSTACLE_RADIUS, state.obstacle.x * ratiox, Math.PI * 1 / 2);   
          context.lineTo(MAP2_OBSTACLE_RADIUS + state.obstacle.x * ratiox, state.obstacle.height * ratioy +state.obstacle.y * ratioy);   
          context.arc(MAP2_OBSTACLE_RADIUS + state.obstacle.x * ratiox, state.obstacle.height * ratioy - MAP2_OBSTACLE_RADIUS + state.obstacle.y * ratioy, MAP2_OBSTACLE_RADIUS, Math.PI * 1 / 2, Math.PI);
          context.fill();


          // Draw paddle1
          context.fillStyle = 'white';
          if (state.player1 && state.player1.paddle)
          {
            context.beginPath();
            context.arc(state.player1.paddle.x * ratiox + PLAYER_RADIUS, state.player1.paddle.y * ratioy + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);   
            context.lineTo(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.y * ratioy);   
            context.arc(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(state.player1.paddle.width * ratiox + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy + state.player1.paddle.y * ratioy - PLAYER_RADIUS);   
            context.arc(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy - PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, state.player1.paddle.x * ratiox, Math.PI * 1 / 2);   
            context.lineTo(PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy +state.player1.paddle.y * ratioy);   
            context.arc(PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy - PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
          }

          // Draw paddle2          
          if (state.player2 && state.player2.paddle)
          {
            context.beginPath();
            context.arc(state.player2.paddle.x * ratiox + PLAYER_RADIUS, state.player2.paddle.y * ratioy + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);
            context.lineTo(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.y * ratioy);   
            context.arc(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(state.player2.paddle.width * ratiox + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy + state.player2.paddle.y * ratioy - PLAYER_RADIUS);   
            context.arc(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy - PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, state.player2.paddle.x * ratiox, Math.PI * 1 / 2);   
            context.lineTo(PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy +state.player2.paddle.y * ratioy);   
            context.arc(PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy - PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
          }

          // Draw ball
          context.beginPath();
          context.fillStyle = 'white';
          if (state.ball && state.ball.radius)
            context.arc(state.ball.x * ratiox, state.ball.y * ratioy, state.ball.radius * ratio, 0, Math.PI * 2, false);
          context.fill();
        }
      }
  }

  drawMap3(state: GameI){
    const canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
      var ratiox = canvas.width / WIDTHCANVAS;
      var ratioy = canvas.height / HEIGHTCANVAS;
      var ratio = canvas.width * canvas!.height / (WIDTHCANVAS * HEIGHTCANVAS);
        var context = canvas.getContext('2d');
        if (context)
        {
          // Draw rectangle noir
          context.fillStyle = 'black';
          context.beginPath();
          context.arc(CANVAS_RADIUS, CANVAS_RADIUS, CANVAS_RADIUS, Math.PI, Math.PI * 3 / 2);   
          context.lineTo(canvas.width - CANVAS_RADIUS, 0);   
          context.arc(canvas.width - CANVAS_RADIUS, CANVAS_RADIUS, CANVAS_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
          context.lineTo(canvas.width, canvas.height - CANVAS_RADIUS);   
          context.arc(canvas.width - CANVAS_RADIUS, canvas.height - CANVAS_RADIUS, CANVAS_RADIUS, 0, Math.PI * 1 / 2);   
          context.lineTo(CANVAS_RADIUS, canvas.height);
          context.arc(CANVAS_RADIUS, canvas.height - CANVAS_RADIUS, CANVAS_RADIUS, Math.PI * 1 / 2, Math.PI);
          context.fill();

        
          // Draw middle line
          context.strokeStyle = 'white';
          context.beginPath();
          context.moveTo(canvas.width / 2, 0);
          context.lineTo(canvas.width / 2, canvas.height);
          context.stroke();
        
          // Draw obstacle
          context.fillStyle = 'white';
          // context.strokeStyle = 'white';

          context.beginPath();
          context.arc(MAP3_OBSTACLE1_POSX * ratiox + MAP3_OBSTACLE1_RADIUS, MAP3_OBSTACLE1_POSY * ratioy + MAP3_OBSTACLE1_RADIUS, MAP3_OBSTACLE1_RADIUS, Math.PI, Math.PI * 3 / 2);
          context.lineTo(MAP3_OBSTACLE1_W * ratiox - MAP3_OBSTACLE1_RADIUS + MAP3_OBSTACLE1_POSX * ratiox, MAP3_OBSTACLE1_POSY * ratioy);   
          context.arc(MAP3_OBSTACLE1_W * ratiox - MAP3_OBSTACLE1_RADIUS + MAP3_OBSTACLE1_POSX * ratiox, MAP3_OBSTACLE1_RADIUS + MAP3_OBSTACLE1_POSY * ratioy, MAP3_OBSTACLE1_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
          context.lineTo(MAP3_OBSTACLE1_W * ratiox + MAP3_OBSTACLE1_POSX * ratiox, MAP3_OBSTACLE1_H * ratioy + MAP3_OBSTACLE1_POSY * ratioy - MAP3_OBSTACLE1_RADIUS);   
          context.arc(MAP3_OBSTACLE1_W * ratiox - MAP3_OBSTACLE1_RADIUS + MAP3_OBSTACLE1_POSX * ratiox, MAP3_OBSTACLE1_H * ratioy - MAP3_OBSTACLE1_RADIUS + MAP3_OBSTACLE1_POSY * ratioy, MAP3_OBSTACLE1_RADIUS, MAP3_OBSTACLE1_POSX * ratiox, Math.PI * 1 / 2);   
          context.lineTo(MAP3_OBSTACLE1_RADIUS + MAP3_OBSTACLE1_POSX * ratiox, MAP3_OBSTACLE1_H * ratioy +MAP3_OBSTACLE1_POSY * ratioy);   
          context.arc(MAP3_OBSTACLE1_RADIUS + MAP3_OBSTACLE1_POSX * ratiox, MAP3_OBSTACLE1_H * ratioy - MAP3_OBSTACLE1_RADIUS + MAP3_OBSTACLE1_POSY * ratioy, MAP3_OBSTACLE1_RADIUS, Math.PI * 1 / 2, Math.PI);
          context.fill();


          context.beginPath();
          context.arc(MAP3_OBSTACLE2_POSX * ratiox + MAP3_OBSTACLE2_RADIUS, MAP3_OBSTACLE2_POSY * ratioy + MAP3_OBSTACLE2_RADIUS, MAP3_OBSTACLE2_RADIUS, Math.PI, Math.PI * 3 / 2);
          context.lineTo(MAP3_OBSTACLE2_W * ratiox - MAP3_OBSTACLE2_RADIUS + MAP3_OBSTACLE2_POSX * ratiox, MAP3_OBSTACLE2_POSY * ratioy);   
          context.arc(MAP3_OBSTACLE2_W * ratiox - MAP3_OBSTACLE2_RADIUS + MAP3_OBSTACLE2_POSX * ratiox, MAP3_OBSTACLE2_RADIUS + MAP3_OBSTACLE2_POSY * ratioy, MAP3_OBSTACLE2_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
          context.lineTo(MAP3_OBSTACLE2_W * ratiox + MAP3_OBSTACLE2_POSX * ratiox, MAP3_OBSTACLE2_H * ratioy + MAP3_OBSTACLE2_POSY * ratioy - MAP3_OBSTACLE2_RADIUS);   
          context.arc(MAP3_OBSTACLE2_W * ratiox - MAP3_OBSTACLE2_RADIUS + MAP3_OBSTACLE2_POSX * ratiox, MAP3_OBSTACLE2_H * ratioy - MAP3_OBSTACLE2_RADIUS + MAP3_OBSTACLE2_POSY * ratioy, MAP3_OBSTACLE2_RADIUS, MAP3_OBSTACLE2_POSX * ratiox, Math.PI * 1 / 2);   
          context.lineTo(MAP3_OBSTACLE2_RADIUS + MAP3_OBSTACLE2_POSX * ratiox, MAP3_OBSTACLE2_H * ratioy +MAP3_OBSTACLE2_POSY * ratioy);   
          context.arc(MAP3_OBSTACLE2_RADIUS + MAP3_OBSTACLE2_POSX * ratiox, MAP3_OBSTACLE2_H * ratioy - MAP3_OBSTACLE2_RADIUS + MAP3_OBSTACLE2_POSY * ratioy, MAP3_OBSTACLE2_RADIUS, Math.PI * 1 / 2, Math.PI);
          context.fill();


          // Draw paddle1
          context.fillStyle = 'white';
          if (state.player1 && state.player1.paddle)
          {
            context.beginPath();
            context.arc(state.player1.paddle.x * ratiox + PLAYER_RADIUS, state.player1.paddle.y * ratioy + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);   
            context.lineTo(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.y * ratioy);   
            context.arc(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(state.player1.paddle.width * ratiox + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy + state.player1.paddle.y * ratioy - PLAYER_RADIUS);   
            context.arc(state.player1.paddle.width * ratiox - PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy - PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, state.player1.paddle.x * ratiox, Math.PI * 1 / 2);   
            context.lineTo(PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy +state.player1.paddle.y * ratioy);   
            context.arc(PLAYER_RADIUS + state.player1.paddle.x * ratiox, state.player1.paddle.height * ratioy - PLAYER_RADIUS + state.player1.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
          }

          // Draw paddle2          
          if (state.player2 && state.player2.paddle)
          {
            context.beginPath();
            context.arc(state.player2.paddle.x * ratiox + PLAYER_RADIUS, state.player2.paddle.y * ratioy + PLAYER_RADIUS, PLAYER_RADIUS, Math.PI, Math.PI * 3 / 2);
            context.lineTo(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.y * ratioy);   
            context.arc(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(state.player2.paddle.width * ratiox + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy + state.player2.paddle.y * ratioy - PLAYER_RADIUS);   
            context.arc(state.player2.paddle.width * ratiox - PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy - PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, state.player2.paddle.x * ratiox, Math.PI * 1 / 2);   
            context.lineTo(PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy +state.player2.paddle.y * ratioy);   
            context.arc(PLAYER_RADIUS + state.player2.paddle.x * ratiox, state.player2.paddle.height * ratioy - PLAYER_RADIUS + state.player2.paddle.y * ratioy, PLAYER_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
          }

          // Draw ball
          context.beginPath();
          context.fillStyle = 'white';
          if (state.ball && state.ball.radius)
            context.arc(state.ball.x * ratiox, state.ball.y * ratioy, state.ball.radius * ratio, 0, Math.PI * 2, false);
          context.fill();
        }
      }
  }

  initState()
  {
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
    obstacle: {
      x: MAP2_OBSTACLE_POSX,
      y: MAP2_OBSTACLE_POSY,
      dx: 0,
      dy: MAP2_OBSTACLE_SPEED,
      height: MAP2_OBSTACLE_H,
      width: MAP2_OBSTACLE_W,
    },
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
  return state;
  }

  drawInit() {
    var ratiox = 1;
    var ratioy = 1;
    var ratio = 1;
    var canvas = document.getElementById('pong') as HTMLCanvasElement | null;
    if (canvas)
    {
      var ratiox = canvas.width / WIDTHCANVAS;
      var ratioy = canvas.height / HEIGHTCANVAS;
      var ratio = canvas.width * canvas!.height / (WIDTHCANVAS * HEIGHTCANVAS);
    }
    // if (canvas)
    // {
    //   ratiox = canvas.width / WIDTHCANVAS;
    //   ratioy = canvas.height / HEIGHTCANVAS;
    // }
    var p1 = {
          // user: UserI;
          // socket: Socket,
          paddle: {
          x: 0,
          y: (HEIGHTCANVAS * ratioy) / 2 - (PLAYER_HEIGHT * ratioy) / 2,
          dx: 0,
          dy: 0,
          width: PLAYER_WIDTH * ratiox,
          height: PLAYER_HEIGHT * ratioy
        },
          points: 0
      };
  
      var p2 = {
          // user: UserI;
          // socket: Socket;
          paddle: {
          x: (WIDTHCANVAS * ratiox) - (PLAYER_WIDTH * ratiox),
          y: (HEIGHTCANVAS * ratioy) / 2 - (PLAYER_HEIGHT * ratioy) / 2,
          dx: 0,
          dy: 0,
          width: PLAYER_WIDTH * ratiox,
          height: PLAYER_HEIGHT * ratioy
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
        // score1: 0,
        // score2: 0,
        obstacle: {
          x: MAP2_OBSTACLE_POSX,
          y: MAP2_OBSTACLE_POSY,
          dx: 0,
          dy: MAP2_OBSTACLE_SPEED,
          height: MAP2_OBSTACLE_H * ratioy,
          width: MAP2_OBSTACLE_W * ratiox
      },
        ball: {
          x: (WIDTHCANVAS * ratiox) / 2,
          y: (HEIGHTCANVAS * ratioy) / 2,
          dx: -2,
          dy: -2,
          speed: 2,
          width: 5 * ratiox,
          height: 5 * ratioy,
          radius: BALL_RADIUS * ratio
        },
      }
      // console.log("ratiox: " + this.ratiox);
      // console.log("ratioy: " + ratioy);
      // console.log("game", state);
      // console.log("gameball", state.ball);
      // var canvas = document.getElementById('pong') as HTMLCanvasElement | undefined;
      if (canvas)
      {
        console.log("canvas ", canvas);
          var context = canvas.getContext('2d');
          if (context)
          {
            //load font car il ne se charge pas des le chargement (??????)
            // context.font = FONT + 'px streetartfont';
            // context.fillText('', 160, 0, 0);
  
            // Draw rectangle noir
            context.fillStyle = 'black';
            context.beginPath();
            context.arc(CANVAS_RADIUS, CANVAS_RADIUS, CANVAS_RADIUS, Math.PI, Math.PI * 3 / 2);   
            context.lineTo(canvas.width - CANVAS_RADIUS, 0);   
            context.arc(canvas.width - CANVAS_RADIUS, CANVAS_RADIUS, CANVAS_RADIUS, Math.PI * 3 / 2, Math.PI * 2);   
            context.lineTo(canvas.width, canvas.height - CANVAS_RADIUS);   
            context.arc(canvas.width - CANVAS_RADIUS, canvas.height - CANVAS_RADIUS, CANVAS_RADIUS, 0, Math.PI * 1 / 2);   
            context.lineTo(CANVAS_RADIUS, canvas.height);
            context.arc(CANVAS_RADIUS, canvas.height - CANVAS_RADIUS, CANVAS_RADIUS, Math.PI * 1 / 2, Math.PI);
            context.fill();
  
          
            // Draw middle line
            context.strokeStyle = 'white';
            context.beginPath();
            // console.log("canvas.width: " + canvas.width);
            // console.log("canvas.height: " + canvas.height);
            context.moveTo(canvas.width / 2, 0);
            context.lineTo(canvas.width / 2, canvas.height );
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

    goToGame() {
      this.router.navigate(['/game']);
    }

}
