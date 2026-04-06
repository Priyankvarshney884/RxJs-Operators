import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of, throwError } from 'rxjs';
import { catchError, tap, finalize, delay } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-catcherror-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catcherror-example.component.html',
  styleUrls: ['./catcherror-example.component.scss']
})
export class CatchErrorExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  errorCaught = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);
  isFallbackData = signal(false);
  loadingMessage = signal('Loading data...');

  codeExample = `// Handle errors gracefully with catchError
this.api.getUsers().pipe(
  catchError(error => {
    console.error('Error occurred:', error);
    // Return fallback data
    return of([
      { id: 1, name: 'Fallback User', email: 'fallback@example.com' }
    ]);
  })
).subscribe(users => {
  console.log('Users:', users);
});`;

  runSuccessExample() {
    this.loading.set(true);
    this.errorCaught.set(null);
    this.result.set(null);
    this.isFallbackData.set(false);
    this.loadingMessage.set('Loading users from API...');
    
    const startTime = performance.now();

    this.dummyApi.getUsers().pipe(
      delay(500),
      catchError(error => {
        this.errorCaught.set(error.message);
        this.isFallbackData.set(true);
        return of(this.getFallbackUsers());
      }),
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      }),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => this.result.set(data.slice(0, 5))
    });
  }

  runErrorExample() {
    this.loading.set(true);
    this.errorCaught.set(null);
    this.result.set(null);
    this.isFallbackData.set(false);
    this.loadingMessage.set('Attempting to load data (will fail)...');
    
    const startTime = performance.now();

    // Simulate an error by throwing immediately
    throwError(() => new Error('API endpoint not found (404)')).pipe(
      delay(800),
      catchError(error => {
        this.errorCaught.set(error.message);
        this.isFallbackData.set(true);
        // Return fallback data instead of crashing
        return of(this.getFallbackUsers());
      }),
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      }),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => this.result.set(data)
    });
  }

  private getFallbackUsers() {
    return [
      {
        id: 1,
        firstName: 'Fallback',
        lastName: 'User 1',
        email: 'fallback1@example.com',
        role: 'user',
        isActive: true
      },
      {
        id: 2,
        firstName: 'Fallback',
        lastName: 'User 2',
        email: 'fallback2@example.com',
        role: 'user',
        isActive: true
      },
      {
        id: 3,
        firstName: 'Cached',
        lastName: 'Data',
        email: 'cached@example.com',
        role: 'admin',
        isActive: true
      }
    ];
  }

  clearResults() {
    this.result.set(null);
    this.errorCaught.set(null);
    this.executionTime.set(0);
    this.isFallbackData.set(false);
  }
}

// Made with Bob