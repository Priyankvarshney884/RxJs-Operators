import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { take, tap, finalize } from 'rxjs/operators';
import { interval } from 'rxjs';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-take-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './take-example.component.html',
  styleUrls: ['./take-example.component.scss']
})
export class TakeExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);
  totalUsers = signal(0);
  intervalValues = signal<number[]>([]);
  intervalRunning = signal(false);

  codeExample = `// Take only first 3 users
this.dummyApi.getUsers().pipe(
  take(3),
  tap(users => console.log('Received:', users.length))
).subscribe(users => {
  console.log('Only first 3 users:', users);
  // Automatically completes after 3 emissions
});`;

  runExample() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    
    const startTime = performance.now();

    this.dummyApi.getUsers().pipe(
      tap(users => this.totalUsers.set(users.length)),
      take(1), // Take only first emission
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      }),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (users) => {
        // Take first 3 users from the array
        this.result.set(users.slice(0, 3));
      },
      error: (err) => this.error.set(err.message)
    });
  }

  runIntervalExample() {
    this.intervalValues.set([]);
    this.intervalRunning.set(true);

    interval(500).pipe(
      take(5), // Take only first 5 emissions
      tap(value => {
        this.intervalValues.update(arr => [...arr, value]);
      }),
      finalize(() => this.intervalRunning.set(false))
    ).subscribe({
      complete: () => {
        console.log('Interval completed after 5 emissions');
      }
    });
  }

  clearResults() {
    this.result.set(null);
    this.error.set(null);
    this.executionTime.set(0);
    this.totalUsers.set(0);
    this.intervalValues.set([]);
  }
}

// Made with Bob