import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { filter, tap, finalize } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-filter-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './filter-example.component.html',
  styleUrls: ['./filter-example.component.scss']
})
export class FilterExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);
  totalUsers = signal(0);

  codeExample = `// Filter users by age and active status
this.dummyApi.getUsers().pipe(
  tap(users => console.log(\`Total: \${users.length}\`)),
  filter(users => users.filter(user => 
    user.age > 25 && user.isActive
  )),
  tap(filtered => console.log(\`Filtered: \${filtered.length}\`))
).subscribe(activeUsers => {
  console.log(activeUsers);
});`;

  runExample() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    
    const startTime = performance.now();

    this.dummyApi.getUsers().pipe(
      tap(users => this.totalUsers.set(users.length)),
      filter(users => {
        const filtered = users.filter(user => 
          user.age && user.age > 25 && user.isActive
        );
        return filtered.length > 0;
      }),
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      }),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (users) => {
        const filtered = users.filter(user => 
          user.age && user.age > 25 && user.isActive
        );
        this.result.set(filtered);
      },
      error: (err) => this.error.set(err.message)
    });
  }

  clearResults() {
    this.result.set(null);
    this.error.set(null);
    this.executionTime.set(0);
    this.totalUsers.set(0);
  }
}

// Made with Bob