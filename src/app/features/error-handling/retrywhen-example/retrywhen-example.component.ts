import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, throwError, timer, of } from 'rxjs';
import { retryWhen, tap, finalize, delay, mergeMap, catchError } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

interface RetryAttempt {
  number: number;
  success: boolean;
  message: string;
  time: number;
  delay: number;
}

@Component({
  selector: 'app-retrywhen-example',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './retrywhen-example.component.html',
  styleUrls: ['./retrywhen-example.component.scss']
})
export class RetryWhenExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  finalError = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);
  loadingMessage = signal('Attempting to load data...');
  attempts = signal<RetryAttempt[]>([]);
  retryStrategy: 'exponential' | 'fixed' | 'immediate' = 'exponential';
  nextRetryDelay = signal(0);

  codeExample = `// Exponential backoff retry strategy
this.api.getUsers().pipe(
  retryWhen(errors => errors.pipe(
    mergeMap((error, index) => {
      const retryAttempt = index + 1;
      const maxRetries = 5;
      
      if (retryAttempt > maxRetries) {
        return throwError(() => error);
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delayMs = Math.pow(2, retryAttempt) * 1000;
      console.log(\`Retry \${retryAttempt} after \${delayMs}ms\`);
      
      return timer(delayMs);
    })
  ))
).subscribe(users => {
  console.log('Success!', users);
});`;

  runExample() {
    this.loading.set(true);
    this.finalError.set(null);
    this.result.set(null);
    this.attempts.set([]);
    this.nextRetryDelay.set(0);
    
    const startTime = performance.now();
    const attemptsList: RetryAttempt[] = [];
    let attemptNumber = 0;

    this.createFlakyObservable().pipe(
      tap(() => {
        attemptNumber++;
        const attemptTime = Math.round(performance.now() - startTime);
        
        attemptsList.push({
          number: attemptNumber,
          success: true,
          message: 'Request succeeded',
          time: attemptTime,
          delay: 0
        });
        this.attempts.set([...attemptsList]);
      }),
      retryWhen(errors => errors.pipe(
        mergeMap((error, index) => {
          attemptNumber++;
          const retryAttempt = index + 1;
          const maxRetries = 4;
          
          if (retryAttempt > maxRetries) {
            return throwError(() => new Error('Maximum retry attempts reached'));
          }
          
          const delayMs = this.getRetryDelay(retryAttempt);
          const attemptTime = Math.round(performance.now() - startTime);
          
          attemptsList.push({
            number: attemptNumber,
            success: false,
            message: `Failed: ${error.message}`,
            time: attemptTime,
            delay: delayMs
          });
          this.attempts.set([...attemptsList]);
          
          this.loadingMessage.set(`Retry attempt ${retryAttempt} of ${maxRetries}...`);
          this.nextRetryDelay.set(delayMs);
          
          // Countdown animation
          const countdownInterval = setInterval(() => {
            const remaining = this.nextRetryDelay();
            if (remaining > 100) {
              this.nextRetryDelay.set(remaining - 100);
            } else {
              this.nextRetryDelay.set(0);
              clearInterval(countdownInterval);
            }
          }, 100);
          
          return timer(delayMs);
        })
      )),
      catchError(error => {
        this.finalError.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
        this.loading.set(false);
        this.nextRetryDelay.set(0);
      })
    ).subscribe({
      next: (data) => this.result.set(data.slice(0, 5)),
      error: () => {} // Error already handled
    });
  }

  private getRetryDelay(retryAttempt: number): number {
    switch (this.retryStrategy) {
      case 'exponential':
        // 1s, 2s, 4s, 8s
        return Math.pow(2, retryAttempt) * 1000;
      case 'fixed':
        return 1000;
      case 'immediate':
        return 0;
      default:
        return 1000;
    }
  }

  private createFlakyObservable(): Observable<any> {
    return new Observable(subscriber => {
      // 70% chance of failure
      const shouldFail = Math.random() < 0.7;
      
      setTimeout(() => {
        if (shouldFail) {
          subscriber.error(new Error('Service temporarily unavailable'));
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
    this.attempts.set([]);
    this.nextRetryDelay.set(0);
  }
}

// Made with Bob