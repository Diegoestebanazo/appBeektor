import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor(private serviceApi: ApiService) {
    this.setupSocketConnection();

  }

  setupSocketConnection() {
    let url = environment.url.split('api/');
    this.socket = io(url[0], {
      //this.socket = io('http://localhost:4200/', {
      // this.socket = io("https://de-una-aprende-backend-9ce4.up.railway.app", {
      transports: ['websocket', 'polling', 'flashsocket'],

      extraHeaders: {
        'my-custom-header': '1234',
      },
      query: {
        'my-custom-header': this.serviceApi.token,
      },
    });
    // this.socket = io('http://localhost:3000',{transports : ['websocket', 'polling', 'flashsocket'],query:{"token":localStorage.getItem('token')}});
  }



  desconectar() {
    this.socket.on('disconnect', () => {
      console.log('desconectado');
    });
  }

  emit(event: string, payload?: any, callback?: Function): void {
    this.socket.emit(event, payload, callback);
  }

  listen(event: string) {
    return new Observable((resp) => {
      this.socket.on(event, (data: any) => {
        resp.next(data);
      });
    });
  }

  getSensores(): Observable<any> {
    return this.listen('newDataSensores');
  }
}
