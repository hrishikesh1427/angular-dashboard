// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'; // Service to fetch data
import { LocationTableComponent } from '../location-table/location-table.component'; // Import LocationTableComponent
import { CameraFeedComponent } from '../camera-feed/camera-feed.component'; // Import CameraFeedComponent
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LocationTableComponent, CameraFeedComponent, CommonModule],  // Declare the imported components
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  locationData: LocationData[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Subscribe to the data service to receive updates
    this.dataService.getLocationData().subscribe(
      (data) => {
        console.log('Data received in component:', data);
        this.locationData = Object.entries(data).map(([key, value]) => ({
          key,
          value: {
            ...value,
            containers: value.containers,
            totalCount: value.totalCount,
            cameraId: value.cameraId,
            cameraStatus: value.cameraStatus
          }
        }));
      },
      (error) => {
        console.error('Error receiving data:', error);
      }
    );
  }
}
