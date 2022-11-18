import { Injectable } from '@angular/core';

@Injectable()
export class ChatMobileService {
  room: boolean;
  newroom: boolean;

  constructor() { 
                    this.room = false;
                    this.newroom = false;
                }

    toggle() : boolean
    {
        if (this.room === true || this.newroom === true)
            return true;
        return false;
    }

    hideRoom() { this.room = false; }

    showRoom() { this.room = true; }

    hideNewRoom() { this.newroom = false; }

    showNewRoom() { this.newroom = true; }

}