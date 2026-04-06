import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { tap, finalize, map } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

interface TapLog {
  timestamp: number;
  message: string;
  icon: string;
  type: 'info' | 'success' | 'warning';
}

@Component({
  selector: 'app-tap-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tap-example.component.html',
  styleUrls: ['./tap-example.component.scss']
})
export class TapExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);
  tapLogs = signal<TapLog[]>([]);

  codeExample = `// Use tap for side effects without modifying data
this.api.getUsers().pipe(
  tap(() => console.log('Request started')),
  tap(users => {
    // Log for debugging
    console.log('Received users:', users.length);
    
    // Update analytics
    analytics.track('users_loaded', { count: users.length });
    
    // Cache the data
    cache.set('users', users);
  }),
  map(users => users.filter(u => u.isActive)),
  tap(filtered => console.log('After filter:', filtered.length)),
  tap(() => this.loading.set(false))
).subscribe(users => {
  console.log('Final result:', users);
});`;

  runExample() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.tapLogs.set([]);
    
    const startTime = performance.now();
    const logs: TapLog[] = [];

    const addLog = (message: string, icon: string, type: 'info' | 'success' | 'warning' = 'info') => {
      const timestamp = Math.round(performance.now() - startTime);
      logs.push({ timestamp, message, icon, type });
      this.tapLogs.set([...logs]);
    };

    this.dummyApi.getUsers().pipe(
      tap(() => {
        addLog('🚀 Request initiated', '🚀', 'info');
      }),
      tap(users => {
        addLog(`📥 Received ${users.length} users from API`, '📥', 'success');
      }),
      tap(users => {
        addLog('💾 Caching data for offline use', '💾', 'info');
        // Simulate caching
        localStorage.setItem('cached_users', JSON.stringify(users.slice(0, 3)));
      }),
      tap(() => {
        addLog('📊 Sending analytics event', '📊', 'info');
        // Simulate analytics
      }),
      map(users => users.filter(user => user.isActive)),
      tap(filtered => {
        addLog(`🔍 Filtered to ${filtered.length} active users`, '🔍', 'warning');
      }),
      tap(filtered => {
        addLog('✅ Processing complete, data ready', '✅', 'success');
      }),
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      }),
      finalize(() => {
        this.loading.set(false);
        addLog('🏁 Observable completed', '🏁', 'success');
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
    this.tapLogs.set([]);
  }
}

// Made with Bob