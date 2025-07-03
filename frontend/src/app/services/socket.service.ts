
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://taskflow.martinherranzc.es');
  }

  onEvent(event: string, callback: (...args: any[]) => void): void {
    this.socket.on(event, callback);
  }

  emitEvent(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
// import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';

// @Injectable({
//   providedIn: 'root',
// })
// export class SocketService {
//   private socket!: Socket;

//   connect(userId: string, username: string) {
//     this.socket = io('http://localhost:5050', {
//       query: { userId, username },
//       transports: ['websocket'],
//     });

//     this.socket.on('connect', () => {
//       console.log(`✅ Socket connected: ${this.socket.id}`);
//     });

//     this.socket.on('disconnect', () => {
//       console.log('❌ Socket disconnected');
//     });

//     this.socket.on('userConnected', (data) => {
//       console.log(`🔵 ${data.username} connected`);
//     });

//     this.socket.on('userDisconnected', (data) => {
//       console.log(`🔴 ${data.username} disconnected`);
//     });
//   }

//   onEvent(event: string, callback: (data: any) => void) {
//     this.socket.on(event, callback);
//   }

//   emitEvent(event: string, data: any) {
//     this.socket.emit(event, data);
//   }
// }
