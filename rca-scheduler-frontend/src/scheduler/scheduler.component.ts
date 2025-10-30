import { Component } from '@angular/core';
import { SchedulerService } from '../app/services/scheduler.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-scheduler',
  imports: [CommonModule, FormsModule],
  templateUrl: './scheduler.component.html',
})
export class SchedulerComponent {
  incidentId = '';
  rcaLink = '';
  devrevApiKey = '';
  reviewersMap = {}; // can be set dynamically later
  message = '';

  constructor(private schedulerService: SchedulerService) {}

  scheduleRCA() {
    const googleAccessToken = localStorage.getItem('googleAccessToken');
    if (!googleAccessToken) {
      this.message = 'Please login first';
      return;
    }

    const payload = {
      googleAccessToken,
      devrevApiKey: environment.DEVREV_API_KEY,
      incidentId: this.incidentId,
      reviewersMap: this.reviewersMap,
    };

    this.schedulerService.scheduleRCA(payload).subscribe({
      // next: (res) => (this.message = res.message),
      next: (res) => {
        // Display owner name in the frontend
        this.message = `RCA Owner: ${res.ownerName} (${res.ownerEmail})`;
      },
      error: (err) => {
        this.message = 'Error: ' + err.message;
      },
    });
  }

  logout() {
    localStorage.removeItem('googleAccessToken');
    window.location.href = '/login';
  }
}
