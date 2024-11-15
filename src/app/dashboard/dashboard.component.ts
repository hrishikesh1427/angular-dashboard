// src/app/dashboard/dashboard.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service'; // Service to fetch data
import { LocationTableComponent } from '../location-table/location-table.component'; // Import LocationTableComponent
// import { CameraFeedComponent } from '../camera-feed/camera-feed.component'; // Import CameraFeedComponent
import { CommonModule } from '@angular/common';

interface Container {
  id: string;
  weight: number | null;
}

interface LocationData {
  key: string;
  value: {
    containers: Container[];
    totalCount: number;
    cameraId: string;
    cameraStatus: string;
  };
}

interface WebSocketResponse {
  frames: Record<string, string>;
  locationData: Record<
    string,
    {
      totalCount: number;
      containers: Container[];
      cameraId: string;
      cameraStatus: string;
    }
  >;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LocationTableComponent, CommonModule], // Declare the imported components
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  locationData: LocationData[] = [];
  frames: Record<string, string> = {};
  private websocket: WebSocket | null = null;
  fullScreenImage: string | null = null;
  fullScreenLocationKey: string | null = null; // Track which location is in full screen

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.openWebSocket();
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  private openWebSocket(): void {
    this.websocket = new WebSocket('ws://localhost:8000/ws');
    this.websocket.onmessage = (event) => {
      const response: WebSocketResponse = JSON.parse(event.data);
      this.frames = Object.keys(response.frames).reduce((acc, location) => {
        acc[location] = 'data:image/jpeg;base64,' + response.frames[location];
        return acc;
      }, {} as Record<string, string>);

      this.locationData = Object.entries(response.locationData).map(
        ([key, value]) => ({
          key,
          value: {
            containers: value.containers,
            totalCount: value.totalCount,
            cameraId: value.cameraId,
            cameraStatus: value.cameraStatus,
          },
        })
      );

      this.updateFullScreenImage(); // Update the full-screen image if needed

      console.log('Processed frames:', this.frames);
      console.log('Processed location data:', this.locationData);
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  private closeWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  openFullScreen(locationKey: string): void {
    this.fullScreenLocationKey = locationKey;
    this.updateFullScreenImage();
  }

  closeFullScreen(): void {
    this.fullScreenImage = null;
    this.fullScreenLocationKey = null;
  }

  private updateFullScreenImage(): void {
    if (this.fullScreenLocationKey) {
      this.fullScreenImage = this.frames[this.fullScreenLocationKey];
    }
  }
}
