import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { retry, tap, finalize, delay, catchError } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

interface RetryAttempt {
  number: number;
  success: boolean;
  message: string;
  time: number;
}

@Component({
  selector: 'app-retry-example',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './retry-example.component.html',
  styleUrls: ['./retry-example.component.scss']
})
export class RetryExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  finalError = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);
  loadingMessage = signal('Attempting to load data...');
  currentAttempt = signal(0);
  attempts = signal<RetryAttempt[]>([]);
  retryCount = 3;

  codeExample = `// Retry failed requests automatically
this.api.getUsers().pipe(
  retry(3), // Retry up to 3 times
  catchError(error => {
    console.error('All retries failed:', error);
    return of([]); // Return empty array as fallback
  })
).subscribe(users => {
  console.log('Users:', users);
});`;

  runExample() {
    this.loading.set(true);
    this.finalError.set(null);
    this.result.set(null);
    this.currentAttempt.set(0);
    this.attempts.set([]);
    
    const startTime = performance.now();
    const attemptsList: RetryAttempt[] = [];

    // Simulate a flaky API that fails randomly
    this.createFlakyObservable().pipe(
      tap(() => {
        const attemptTime = Math.round(performance.now() - startTime);
        const attemptNum = this.currentAttempt() + 1;
        this.currentAttempt.set(attemptNum);
        
        attemptsList.push({
          number: attemptNum,
          success: true,
          message: 'Request succeeded',
          time: attemptTime
        });
        this.attempts.set([...attemptsList]);
      }),
      retry({
        count: this.retryCount,
        delay: (error, retryCount) => {
          const attemptTime = Math.round(performance.now() - startTime);
          const attemptNum = this.currentAttempt() + 1;
          this.currentAttempt.set(attemptNum);
          
          attemptsList.push({
            number: attemptNum,
            success: false,
            message: `Failed: ${error.message}`,
            time: attemptTime
          });
          this.attempts.set([...attemptsList]);
          
          this.loadingMessage.set(`Retry attempt ${retryCount} of ${this.retryCount}...`);
          return of(null).pipe(delay(500));
        }
      }),
      catchError(error => {
        this.finalError.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
        this.loading.set(false);
      })
    ).subscribe({
      next: (data) => this.result.set(data.slice(0, 5)),
      error: () => {} // Error already handled in catchError
    });
  }

  private createFlakyObservable(): Observable<any> {
    return new Observable(subscriber => {
      // 60% chance of failure on each attempt
      const shouldFail = Math.random() < 0.6;
      
      setTimeout(() => {
        if (shouldFail) {
          subscriber.error(new Error('Network timeout (simulated)'));
        } else {
          this.dummyApi.getUsers().subscribe({
            next: (users) => {
              subscriber.next(users);
              subscriber.complete();
            },
            error: (err) => subscriber.error(err)
          });
        }
      }, 300);
    });
  }

  clearResults() {
    this.result.set(null);
    this.finalError.set(null);
    this.executionTime.set(0);
    this.currentAttempt.set(0);
    this.attempts.set([]);
  }
}

// Made with Bob