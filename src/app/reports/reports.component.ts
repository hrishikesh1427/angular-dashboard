import { Component, OnInit } from '@angular/core';
import {  HttpClient , HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ContainerReport } from './container-report.interface';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [HttpClient],
  template: `
    <div class="reports">
      <h1>Container Movement Reports</h1>
      <div class="table-container">
        <table class="reports-table">
          <thead>
            <tr>
              <th>Container Number</th>
              <th>Time Range</th>
              <th>Movement Path</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let report of containerReports">
              <td>{{ report.containerNumber }}</td>
              <td>{{ report.timeRange.start }} - {{ report.timeRange.end }}</td>
              <td class="path-cell">
                <div *ngFor="let entry of report.path" class="path-entry">
                  <span class="location">{{ entry.location }}</span>
                  <span class="timestamp">{{ entry.timestamp }}</span>
                  <span class="weight" *ngIf="entry.weight">({{ entry.weight }} tons)</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .reports {
      margin-top: 70px;
      padding: 2rem;
      color: var(--text-primary);
      background-color: var(--bg-primary);
      min-height: calc(100vh - 70px);
    }
    
    h1 {
      color: var(--text-primary);
      margin-bottom: 2rem;
      font-size: 1.5rem;
    }

    .table-container {
      background-color: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .reports-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background-color: var(--bg-secondary);
      border-radius: 8px;
      overflow: hidden;
    }

    .reports-table th,
    .reports-table td {
      padding: 1.25rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    .reports-table th {
      background-color: var(--header-bg);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
    }

    .path-cell {
      line-height: 1.6;
    }

    .path-entry {
      padding: 0.5rem 0;
      border-bottom: 1px dashed var(--border-color);
    }

    .path-entry:last-child {
      border-bottom: none;
    }

    .location {
      color: var(--accent-color);
      font-weight: 500;
      margin-right: 1rem;
    }

    .timestamp {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .weight {
      color: var(--text-primary);
      font-size: 0.875rem;
      margin-left: 0.5rem;
    }
  `]
})
export class ReportsComponent implements OnInit {
  containerReports: ContainerReport[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<ContainerReport[]>('http://localhost:8000/api/container-reports').subscribe(data => {
      this.containerReports = data;
    });
  }
} 