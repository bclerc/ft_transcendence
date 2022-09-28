import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { ChatService } from 'src/app/chat.service';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient, private snackbar: MatSnackBar, private chatService: ChatService) { }

  form: FormGroup = new FormGroup(
    {
      message: new FormControl(null, Validators.required)
    }
  )

   title: any = 'titre';
   name: string = '';
   users: any = [];
   msg = new Array<string>;
   

  ngOnInit(): void {
    
    this.chatService.getMessages().subscribe((message: string) => {
        this.msg.push(message);
      });
    
     this.chatService.sendMessage('Hello World');
      this.snackbar.open(`Welcome ${user.displayname}, ${user.email}`, 'Close', {
        duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', 
      })
    }
    );

    }
    );
  }
  sendMessage()
  {
    if (this.form.valid)
    {
      console.log("Sending message:" + this.form.value.message);
      this.chatService.sendMessage(this.form.value.message);
      this.form.reset();
    }
  }

   

}

// open iframe 