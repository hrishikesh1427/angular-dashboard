// src/app/camera-feed/camera-feed.component.ts

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-camera-feed',
  standalone: true,
  template: `
    <div class="camera-feed">
      <div class="camera-header">
        <h4>{{ location }}</h4>
        <span class="camera-status">Live</span>
      </div>
      <img [src]="cameraFeedURL" [alt]="'Camera feed from ' + location" class="camera-feed-img" />
    </div>
  `,
  styleUrls: ['./camera-feed.component.css']
})
export class CameraFeedComponent {
  @Input() cameraFeedURL!: string;
  @Input() id!: string;
  @Input() location!: string;
}
