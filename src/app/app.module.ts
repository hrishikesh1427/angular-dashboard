import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [
    // other components
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // other modules
  ],
  bootstrap: [/* your main component */]
})
export class AppModule { } 