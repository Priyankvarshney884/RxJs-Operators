import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-debouncetime-example',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './debouncetime-example.component.html',
  styleUrls: ['./debouncetime-example.component.scss']
})
export class DebounceTimeExampleComponent {
  private dummyApi = inject(DummyApiService);

  searchControl = new FormControl('');
  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<any>(null);
  searchCount = signal(0);
  lastSearchTime = signal<string>('');

  codeExample = `// Search with debounceTime to wait for user to stop typing
searchControl.valueChanges.pipe(
  debounceTime(300), // Wait 300ms after user stops typing
  distinctUntilChanged(), // Only if value changed
  tap(() => console.log('Searching...')),
  switchMap(query => this.api.searchUsers(query))
).subscribe(results => {
  console.log('Search results:', results);
});`;

  ngOnInit() {
    this.setupSearch();
  }

  setupSearch() {
    this.searchControl.valueChanges.pipe(
      tap(() => {
        this.loading.set(true);
        this.searchCount.update(count => count + 1);
        this.lastSearchTime.set(new Date().toLocaleTimeString());
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim() === '') {
          this.loading.set(false);
          return [];
        }
        return this.dummyApi.getUsers().pipe(
          tap(() => this.loading.set(false)),
          finalize(() => this.loading.set(false))
        );
      })
    ).subscribe({
      next: (users) => {
        const query = this.searchControl.value?.toLowerCase() || '';
        if (query) {
          const filtered = users.filter(user => 
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
          );
          this.result.set(filtered);
        } else {
          this.result.set(null);
        }
        this.error.set(null);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  clearResults() {
    this.searchControl.setValue('');
    this.result.set(null);
    this.error.set(null);
    this.searchCount.set(0);
    this.lastSearchTime.set('');
  }
}

// Made with Bob