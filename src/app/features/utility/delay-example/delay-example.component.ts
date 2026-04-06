import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { delay, tap, finalize } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

interface TimelineEvent {
  id: number;
  time: number;
  label: string;
  icon: string;
  type: 'emission' | 'complete';
}

@Component({
  selector: 'app-delay-example',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './delay-example.component.html',
  styleUrls: ['./delay-example.component.scss']
})
export class DelayExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);
  loadingMessage = signal('Fetching data...');
  delayTime = 2000;
  delayProgress = signal(0);
  remainingTime = signal(0);
  timeline = signal<TimelineEvent[]>([]);

  codeExample = `// Delay all emissions by 2 seconds
this.api.getUsers().pipe(
  tap(() => console.log('Data fetched')),
  delay(2000), // Wait 2 seconds before emitting
  tap(() => console.log('Data emitted after delay'))
).subscribe(users => {
  console.log('Received:', users);
});

// Delay until specific date
const futureDate = new Date('2024-12-31');
source$.pipe(
  delay(futureDate)
).subscribe();`;

  runExample() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.delayProgress.set(0);
    this.remainingTime.set(this.delayTime);
    this.timeline.set([]);
    
    const startTime = performance.now();
    const events: TimelineEvent[] = [];
    let eventId = 0;

    // Progress tracking
    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min((elapsed / this.delayTime) * 100, 100);
      this.delayProgress.set(Math.round(progress));
      this.remainingTime.set(Math.max(0, Math.round(this.delayTime - elapsed)));
    }, 50);

    this.dummyApi.getUsers().pipe(
      tap(() => {
        const time = Math.round(performance.now() - startTime);
        events.push({
          id: eventId++,
          time,
          label: 'Data Fetched',
          icon: '📥',
          type: 'emission'
        });
        this.timeline.set([...events]);
        this.loadingMessage.set(`Data fetched! Applying ${this.delayTime}ms delay...`);
      }),
      delay(this.delayTime),
      tap(() => {
        const time = Math.round(performance.now() - startTime);
        events.push({
          id: eventId++,
          time,
          label: 'Data Emitted',
          icon: '📤',
          type: 'emission'
        });
        this.timeline.set([...events]);
        this.loadingMessage.set('Delay complete! Processing data...');
      }),
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      }),
      finalize(() => {
        clearInterval(progressInterval);
        this.loading.set(false);
        this.delayProgress.set(100);
        this.remainingTime.set(0);
        
        const time = Math.round(performance.now() - startTime);
        events.push({
          id: eventId++,
          time,
          label: 'Complete',
          icon: '✅',
          type: 'complete'
        });
        this.timeline.set([...events]);
      })
    ).subscribe({
      next: (data) => this.result.set(data.slice(0, 5)),
      error: (err) => this.error.set(err.message)
    });
  }

  clearResults() {
    this.result.set(null);
    this.error.set(null);
    this.executionTime.set(0);
    this.delayProgress.set(0);
    this.remainingTime.set(0);
    this.timeline.set([]);
  }
}

// Made with Bob