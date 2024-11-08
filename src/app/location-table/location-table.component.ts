// src/app/location-table/location-table.component.ts

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface Container {
  id: string;
  weight: number | null;
}

interface Location {
  key: string;
  value: {
    containers: Container[];
    totalCount: number;
  };
}

@Component({
  selector: 'app-location-table',
  standalone: true,
  templateUrl: './location-table.component.html',
  styleUrls: ['./location-table.component.css'],
  imports: [CommonModule]
})
export class LocationTableComponent {
  @Input() locationData: Location[] = [];  // Initialize as an empty array
}
