import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { skip, tap, finalize } from 'rxjs/operators';
import { interval } from 'rxjs';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-skip-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './skip-example.component.html',
  styleUrls: ['./skip-example.component.scss']
})
export class SkipExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);
  totalUsers = signal(0);
  skippedCount = signal(0);

  codeExample = `// Skip first 2 users
this.dummyApi.getUsers().pipe(
  skip(2), // Skip first 2 emissions
  tap(users => console.log('After skip:', users))
).subscribe(users => {
  console.log('Remaining users:', users);
});`;

  runExample() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    
    const startTime = performance.now();

    this.dummyApi.getUsers().pipe(
      tap(users => this.totalUsers.set(users.length)),
      skip(0), // Skip 0 to get all (for demo we'll skip in the array)
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      }),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (users) => {
        // Skip first 3 users from the array
        const skipCount = 3;
        this.skippedCount.set(skipCount);
        this.result.set(users.slice(skipCount));
      },
      error: (err) => this.error.set(err.message)
    });
  }

  clearResults() {
    this.result.set(null);
    this.error.set(null);
    this.executionTime.set(0);
    this.totalUsers.set(0);
    this.skippedCount.set(0);
  }
}

// Made with Bob