import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { interval, timeout, take, delay, of, catchError, TimeoutError } from 'rxjs';

interface TimeoutResult {
  time: number;
  value?: number;
  status: 'success' | 'timeout' | 'error';
  message: string;
}

@Component({
  selector: 'app-timeout-example',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './timeout-example.component.html',
  styleUrls: ['./timeout-example.component.scss']
})
export class TimeoutExampleComponent {
  loading = signal(false);
  results = signal<TimeoutResult[]>([]);
  timeoutDuration = signal(2000);
  emissionDelay = signal(1000);
  countdown = signal(0);
  
  codeExample = `// Basic timeout - error if no emission within time
interval(1000).pipe(
  timeout(2000)
).subscribe({
  next: value => console.log('Value:', value),
  error: err => console.error('Timeout!', err)
});

// With fallback Observable
interval(3000).pipe(
  timeout({
    each: 2000,
    with: () => of('Fallback value')
  })
).subscribe(value => {
  console.log('Value:', value); // 'Fallback value'
});

// Real-world: API request with timeout
http.get('/api/data').pipe(
  timeout(5000),
  catchError(err => {
    if (err instanceof TimeoutError) {
      return of({ error: 'Request timed out' });
    }
    return throwError(() => err);
  })
).subscribe(data => {
  console.log('Data:', data);
});`;

  runExample() {
    this.loading.set(true);
    this.results.set([]);
    this.countdown.set(this.timeoutDuration());
    
    const startTime = Date.now();
    
    // Start countdown
    const countdownInterval = setInterval(() => {
      const remaining = this.timeoutDuration() - (Date.now() - startTime);
      this.countdown.set(Math.max(0, remaining));
      
      if (remaining <= 0) {
        clearInterval(countdownInterval);
      }
    }, 100);
    
    // Create a delayed observable
    const source$ = of(1).pipe(
      delay(this.emissionDelay()),
      take(1)
    );
    
    // Apply timeout
    source$.pipe(
      timeout(this.timeoutDuration()),
      catchError(err => {
        if (err instanceof TimeoutError) {
          const result: TimeoutResult = {
            time: Date.now() - startTime,
            status: 'timeout',
            message: `⏱️ Timeout after ${this.timeoutDuration()}ms`
          };
          this.results.update(prev => [...prev, result]);
          return of(null);
        }
        const result: TimeoutResult = {
          time: Date.now() - startTime,
          status: 'error',
          message: `❌ Error: ${err.message}`
        };
        this.results.update(prev => [...prev, result]);
        return of(null);
      })
    ).subscribe({
      next: (value) => {
        if (value !== null) {
          const result: TimeoutResult = {
            time: Date.now() - startTime,
            value: value as number,
            status: 'success',
            message: `✅ Value emitted: ${value}`
          };
          this.results.update(prev => [...prev, result]);
        }
      },
      complete: () => {
        clearInterval(countdownInterval);
        this.countdown.set(0);
        this.loading.set(false);
      }
    });
  }

  clearResults() {
    this.results.set([]);
    this.countdown.set(0);
    this.loading.set(false);
  }

  getStatusClass(status: string): string {
    return status;
  }
}

// Made with Bob
