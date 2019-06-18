import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Message } from '../interfaces/Message';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private connection: signalR.HubConnection;
  message = new Subject<Message>();
  connect(accessToken) {
    if (!this.connection) {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5000/chathub', { accessTokenFactory: () => accessToken })
        .build();

      this.connection.on('receive', (user, msg) => {
        console.log('Received', user, msg)
        this.message.next({user: user, content: msg})
      });

      this.connection.start().catch(err => console.error(err));
    }
  }

  disconnect() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }

  send(message) {
    this.connection.invoke('SendMessage', message).catch(err => console.error(err));
  }
}
