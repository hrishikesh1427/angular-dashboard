import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ContainerReport } from './container-report.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [HttpClient],
  template: `
    <div class="reports">
  
      <div class="filter-container">
        <input type="text" placeholder="Filter by Container Number" [(ngModel)]="filterContainerNumber" />
        <input type="date" placeholder="Filter by Date" [(ngModel)]="filterDate" />
        <button (click)="applyFilters()">Apply Filters</button>
      </div>
      <div class="table-container">
        <table class="reports-table">
          <thead>
            <tr>
              <th>Container Number</th>
              <th>Date</th>
              <th>Time Range</th>
              <th>Movement Path</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let report of filteredReports">
              <td>{{ report.containerNumber }}</td>
              <td>{{ report.date }}</td>
              <td>{{ report.timeRange.start }} - {{ report.timeRange.end }}</td>
              <td class="path-cell">
                <div class="path-entry" *ngFor="let entry of report.path; let last = last">
                  <span class="location">{{ entry.location }}</span>
                  <span class="timestamp">{{ entry.timestamp }}</span>
                  <span class="weight" *ngIf="entry.weight">({{ entry.weight }} tons)</span>
                  <span *ngIf="!last" class="arrow">→</span>
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
      font-size: 1.8rem;
      font-weight: 600;
    }

    .filter-container {
      margin-bottom: 2rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1.5rem;
      background-color: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .filter-container input {
      flex: 1;
      min-width: 200px;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.95rem;
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      transition: all 0.3s ease;
    }

    .filter-container input:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb), 0.1);
    }

    .filter-container button {
      padding: 0.75rem 2rem;
      background-color: var(--accent-color);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    .filter-container button:hover {
      background-color: var(--accent-color-dark);
      transform: translateY(-1px);
    }

    .filter-container button:active {
      transform: translateY(0);
    }

    .table-container {
      background-color: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
    }

    .reports-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background-color: var(--bg-secondary);
      border-radius: 8px;
      overflow: hidden;
      min-width: 800px;
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
      white-space: nowrap;
    }

    .reports-table tr:last-child td {
      border-bottom: none;
    }

    .reports-table tr:hover {
      background-color: rgba(var(--accent-color-rgb), 0.05);
    }

    .path-cell {
      line-height: 1.6;
      white-space: nowrap;
      overflow-x: auto;
      max-width: 400px;
      padding-bottom: 0.5rem;
    }

    .path-cell::-webkit-scrollbar {
      height: 4px;
    }

    .path-cell::-webkit-scrollbar-track {
      background: var(--border-color);
      border-radius: 2px;
    }

    .path-cell::-webkit-scrollbar-thumb {
      background: var(--accent-color);
      border-radius: 2px;
    }

    .path-entry {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background-color: var(--bg-primary);
      border-radius: 6px;
      margin-right: 0.5rem;
      border: 1px solid var(--border-color);
    }

    .location {
      color: var(--accent-color);
      font-weight: 500;
      margin-right: 0.5rem;
    }

    .timestamp {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .weight {
      color: var(--text-primary);
      font-size: 0.875rem;
      margin-left: 0.5rem;
      font-weight: 500;
    }

    .arrow {
      margin: 0 0.75rem;
      color: var(--accent-color);
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .reports {
        padding: 1rem;
      }

      h1 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .filter-container {
        padding: 1rem;
        flex-direction: column;
      }

      .filter-container input,
      .filter-container button {
        width: 100%;
      }

      .table-container {
        padding: 1rem;
        margin: 0 -1rem;
        border-radius: 0;
      }

      .reports-table th,
      .reports-table td {
        padding: 1rem;
      }

      .path-cell {
        max-width: 250px;
      }
    }

    @media (max-width: 480px) {
      .reports {
        margin-top: 60px;
      }

      h1 {
        font-size: 1.25rem;
      }

      .filter-container {
        gap: 0.75rem;
      }

      .path-cell {
        max-width: 200px;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  containerReports: ContainerReport[] = [];
  filteredReports: ContainerReport[] = [];
  filterContainerNumber: string = '';
  filterDate: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<ContainerReport[]>('http://localhost:8000/api/container-reports').subscribe(data => {
      this.containerReports = data;
      this.filteredReports = data; // Initialize filtered reports
    });
  }

  applyFilters() {
    this.filteredReports = this.containerReports.filter(report => {
      const matchesContainerNumber = report.containerNumber.includes(this.filterContainerNumber);
      const matchesDate = !this.filterDate || report.date === this.filterDate;
      return matchesContainerNumber && matchesDate;
    });
  }
} 