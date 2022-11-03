import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { newPenalty } from './penalty.interface';


function getTimeToMilliseconds(time: string, type: string): number {
    switch (type) {
        case 'minutes':
            return Number(time) * 60000;
        case 'hours':
            return Number(time) * 3600000;
        case 'days':
            return Number(time) * 86400000;
        case 'month':
            return Number(time) * 2592000000;
      default:
        return 0;
    } 
}

@Component({
  templateUrl: './penalty-dialog.component.html',
  styleUrls: ['./penalty-dialog.component.css']
})
export class PenaltyDialogComponent implements OnInit {
  
  checked = false;

  form: FormGroup = new FormGroup({
    perm: new FormControl(false),
    days: new FormControl(0),
    hours: new FormControl(0),
    minutes: new FormControl(0),
  
  }); 
  
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: newPenalty) {}



  ngOnInit(): void {
  }

  action(): void {
    if (this.form.valid)
    {
      let totalTime =  getTimeToMilliseconds(this.minutes!.value, 'minutes') + getTimeToMilliseconds(this.hours!.value, 'hours') + getTimeToMilliseconds(this.days!.value, 'days'); 
      const data = {
        type: this.data.penalty,
        perm: this.perm!.value,
        time: totalTime,
        user: this.data.target,
        room: this.data.room
      }
      console.log(data);
    }
  }

  get perm () {
    return this.form.get('perm');
  }

  get days () {
    return this.form.get('days');
  }

  get hours () {
    return this.form.get('hours');
  }

  get minutes () {
    return this.form.get('minutes');
  }



}
