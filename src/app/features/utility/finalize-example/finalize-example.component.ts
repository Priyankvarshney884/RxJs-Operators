import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of, throwError } from 'rxjs';
import { finalize, tap, delay } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

interface CleanupLog {
  timestamp: number;
  message: string;
  icon: string;
  type: 'success' | 'info';
}

@Component({
  selector: 'app-finalize-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './finalize-example.component.html',
  styleUrls: ['./finalize-example.component.scss']
})
export class FinalizeExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);
  loadingMessage = signal('Loading data...');
  cleanupLogs = signal<CleanupLog[]>([]);

  codeExample = `// finalize always executes on complete or error
this.api.getUsers().pipe(
  tap(() => this.loading.set(true)),
  tap(users => console.log('Received:', users)),
  finalize(() => {
    // This ALWAYS runs, whether success or error
    this.loading.set(false);
    console.log('Cleanup completed');
    this.closeConnections();
  })
).subscribe({
  next: users => console.log('Success:', users),
  error: err => console.error('Error:', err)
  // finalize runs after next/error/complete
});`;

  runSuccessExample() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.cleanupLogs.set([]);
    this.loadingMessage.set('Loading users...');
    
    const startTime = performance.now();
    const logs: CleanupLog[] = [];

    const addLog = (message: string, icon: string, type: 'success' | 'info' = 'info') => {
      const timestamp = Math.round(performance.now() - startTime);
      logs.push({ timestamp, message, icon, type });
      this.cleanupLogs.set([...logs]);
    };

    this.dummyApi.getUsers().pipe(
      delay(800),
      tap(() => {
        addLog('Data received successfully', '📥', 'success');
      }),
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      }),
      finalize(() => {
        // This ALWAYS runs
        this.loading.set(false);
        addLog('Loading indicator hidden', '⏳', 'info');
        addLog('Resources cleaned up', '🧹', 'success');
        addLog('Connections closed', '🔌', 'info');
        addLog('finalize callback completed', '🏁', 'success');
      })
    ).subscribe({
      next: (data) => {
        this.result.set(data.slice(0, 5));
        addLog('Data passed to subscriber', '✅', 'success');
      },
      error: (err) => this.error.set(err.message)
    });
  }

  runErrorExample() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.cleanupLogs.set([]);
    this.loadingMessage.set('Attempting to load data...');
    
    const startTime = performance.now();
    const logs: CleanupLog[] = [];

    const addLog = (message: string, icon: string, type: 'success' | 'info' = 'info') => {
      const timestamp = Math.round(performance.now() - startTime);
      logs.push({ timestamp, message, icon, type });
      this.cleanupLogs.set([...logs]);
    };

    // Simulate an error
    throwError(() => new Error('Simulated API error')).pipe(
      delay(800),
      tap(() => {
        addLog('This will not execute (error occurred)', '❌', 'info');
      }),
      finalize(() => {
        // This STILL runs even on error!
        this.loading.set(false);
        addLog('Loading indicator hidden (despite error)', '⏳', 'info');
        addLog('Error logged to monitoring', '📊', 'info');
        addLog('Resources cleaned up (despite error)', '🧹', 'success');
        addLog('finalize executed successfully!', '🏁', 'success');
        
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      })
    ).subscribe({
      next: (data) => this.result.set(data),
      error: (err) => {
        this.error.set(err.message);
        addLog('Error caught in subscriber', '❌', 'info');
      }
    });
  }

  clearResults() {
    this.result.set(null);
    this.error.set(null);
    this.executionTime.set(0);
    this.cleanupLogs.set([]);
  }
}

// Made with Bob