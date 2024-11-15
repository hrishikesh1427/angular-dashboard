// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit {
  locationData: LocationData[] = [];
  frames: Record<string, string> = {};

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getLocationData().subscribe({
      next: (response: WebSocketResponse) => {
        // Process frames
        this.frames = Object.keys(response.frames).reduce((acc, location) => {
          acc[location] = 'data:image/jpeg;base64,' + response.frames[location];
          return acc;
        }, {} as Record<string, string>);

        // Process location data
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

        console.log('Processed frames:', this.frames);
        console.log('Processed location data:', this.locationData);
      },
      error: (error) => {
        console.error('Error receiving data:', error);
      }
    });
  }
}
