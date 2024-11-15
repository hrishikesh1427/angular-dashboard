// src/app/camera-feed/camera-feed.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DataService } from '../data.service'; // Import the DataService
@Component({
  selector: 'app-camera-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="camera-feed">
      <div class="camera-header">
        <h4>{{ location }}</h4>
        <span class="camera-status">Live</span>
      </div>
      <img *ngIf="frame" [src]="'data:image/jpeg;base64,' + frame" [alt]="'Camera feed from ' + location" class="camera-feed-img" />
    </div>
  `,
  styleUrls: ['./camera-feed.component.css']
})
export class CameraFeedComponent implements OnInit {
  @Input() location!: string;
  frame: string = '';
  frame_array: any[] = [];

  constructor(private dataService: DataService) {} // Inject the DataService

  ngOnInit() {
    this.dataService.getLocationData().subscribe((data) => {
      const locationIndex = this.getLocationIndex(this.location);
      
      console.log('data.frames', this.dataService.frame_array);
      for(let i = 0; i < data.frames.length; i++){
        this.frame_array[i] = 'data:image/jpeg;base64,' + data.frames[i];
        this.frame = 'data:image/jpeg;base64,' + data.frames[i];
      }
      
      this.dataService.frame_array = this.frame_array;
      
      // if (locationIndex !== -1) {
      //   if (Array.isArray(data.frames) && data.frames.length > locationIndex) {
      //     this.frame = data.frames[locationIndex];
      //   } else {
      //     console.warn(`Frame not available for location index: ${locationIndex}`);
      //   }
      // } else {
      //   console.warn('Invalid location:', this.location);
      // }
    });
  }

  private getLocationIndex(location: string): number {
    const locations = ['Weigh Bridge', 'DIP', 'PCM', 'Fill Area'];
    return locations.indexOf(location);
  }
}
