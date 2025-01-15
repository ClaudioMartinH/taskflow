import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5050');
  }

  onEvent(event: string, callback: (...args: any[]) => void): void {
    this.socket.on(event, callback);
  }

  emitEvent(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}