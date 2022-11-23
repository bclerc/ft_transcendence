import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { TokenStorageService } from './services/auth/token.storage';
import { BurgerMenuService } from './services/burger-menu.service';
import { HeaderService } from './services/user/header.service';

@Component({
  selector: 'app-root',
  template: `
  <div id="desktop">

<div *ngIf="navbar.visible">
  <app-header></app-header>
</div>
<router-outlet></router-outlet>

</div>

<div id="mobile">
<div *ngIf="navbar.visible">
  <app-header></app-header>
</div>
<div *ngIf="!burgerMenu.visible">
<router-outlet name="mobile"></router-outlet>
</div>


</div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'transcendanceV1';
  

  constructor(
              private socket: Socket,
              private snackBar: MatSnackBar,
              public navbar : HeaderService,
              public burgerMenu : BurgerMenuService,
              private token : TokenStorageService,
              private changeDetector: ChangeDetectorRef,) { 
                if (token.getToken())
                navbar.show();
              }   

  ngOnInit(): void {
      this.socket.on('notification', (notif: string) => {
        this.snackBar.open(notif, 'OK',
        {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });

    
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

}
