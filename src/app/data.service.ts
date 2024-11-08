import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../environments/environment';

interface Container {
  id: string;
  weight: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private socket!: WebSocketSubject<Record<string, { totalCount: number; containers: Container[]; cameraId: string; cameraStatus: string }>>;
  private locationDataSubject = new Subject<Record<string, { totalCount: number; containers: Container[]; cameraId: string; cameraStatus: string }>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    console.log('Attempting to connect to WebSocket...');
    this.socket = new WebSocketSubject(environment.websocketUrl);

    this.socket.subscribe(
      (data) => {
        console.log('Data received from WebSocket:', data);
        this.locationDataSubject.next(data);
      },
      (error) => {
        console.error('WebSocket error:', error);
        console.log('Attempting to reconnect due to WebSocket error...');
        this.handleReconnection();
      },
      () => {
        console.log('WebSocket connection closed');
        console.log('Attempting to reconnect due to connection closure...');
        this.handleReconnection();
      }
    );
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        this.connectWebSocket();
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
      console.log('No more reconnection attempts will be made.');
    }
  }

  getLocationData() {
    return this.locationDataSubject.asObservable();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.complete();
    }
  }
}