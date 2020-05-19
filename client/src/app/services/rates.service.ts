import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class RatesService {

    constructor(private socket: Socket) { 
    }

    sendRate(message) {
        this.socket.emit('rate', message);
    }

    receiveRate() {
        return this.socket.fromEvent('rate');
    }

    getUsers() {
        return this.socket.fromEvent('users');
    }

}