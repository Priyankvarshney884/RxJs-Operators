import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { switchMap, tap, finalize, delay } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-switchmap-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="operator-example">
      <!-- Header -->
      <div class="example-header">
        <h1>🔄 switchMap Operator</h1>
        <span class="difficulty intermediate">🟡 Intermediate</span>
      </div>

      <!-- Description -->
      <section class="section">
        <h2>What is switchMap?</h2>
        <p class="description">
          The <code>switchMap</code> operator maps each value to an Observable, then flattens all of these inner 
          Observables using <strong>switch</strong>. It cancels the previous inner Observable when a new value arrives, 
          making it perfect for scenarios where you only care about the latest request (like search autocomplete).
        </p>
      </section>

      <!-- When to Use -->
      <section class="section">
        <h2>When to Use</h2>
        <ul class="use-cases">
          <li>✅ Search/autocomplete (cancel previous searches)</li>
          <li>✅ User navigation (cancel previous page loads)</li>
          <li>✅ Form field changes that trigger API calls</li>
          <li>✅ Any scenario where only the latest result matters</li>
          <li>⚠️ NOT for operations that must complete (like POST requests)</li>
        </ul>
      </section>

      <!-- Code Example -->
      <section class="section">
        <h2>Code Example</h2>
        <div class="code-block">
          <pre><code>{{ codeExample }}</code></pre>
        </div>
      </section>

      <!-- Interactive Demo -->
      <section class="section">
        <h2>Try It Yourself</h2>
        <p class="demo-description">
          Click "Search Products" multiple times quickly. Notice how switchMap cancels previous searches 
          and only shows results from the latest request.
        </p>
        
        <div class="demo-controls">
          <button 
            class="btn-primary" 
            (click)="runExample()" 
            [disabled]="loading()">
            @if (loading()) {
              <span class="spinner"></span>
              Searching...
            } @else {
              🔍 Search Products
            }
          </button>
          
          <button 
            class="btn-secondary" 
            (click)="clearResults()"
            [disabled]="!result()">
            Clear
          </button>
        </div>

        @if (error()) {
          <div class="error-message">
            ❌ Error: {{ error() }}
          </div>
        }

        @if (result()) {
          <div class="result-panel">
            <div class="result-header">
              <h3>Search Results</h3>
              <span class="execution-time">⚡ {{ executionTime() }}ms</span>
            </div>
            <pre class="result-content">{{ result() | json }}</pre>
          </div>
        }
      </section>

      <!-- How It Works -->
      <section class="section">
        <h2>How It Works</h2>
        <div class="explanation">
          <h3>🔄 Cancellation Behavior:</h3>
          <ol>
            <li>User types "lap" → starts search for "lap"</li>
            <li>User types "laptop" → <strong>cancels "lap" search</strong>, starts "laptop" search</li>
            <li>Only "laptop" results are shown</li>
          </ol>
          
          <h3>📊 Marble Diagram:</h3>
          <pre class="marble-diagram">
Source:     --1----2----3----|
            switchMap(val => API call taking 2 seconds)
Inner:      --A----B----C----|
                   X    (A cancelled)
                        X (B cancelled)
Result:     -------C---------|
          </pre>
        </div>
      </section>

      <!-- Real-world Use Cases -->
      <section class="section">
        <h2>Real-world Use Cases</h2>
        <div class="use-case-grid">
          <div class="use-case-card">
            <h3>1. Search Autocomplete</h3>
            <pre><code>searchInput.valueChanges.pipe(
  debounceTime(300),
  switchMap(term => 
    this.api.searchProducts(term)
  )
).subscribe(results => 
  this.searchResults = results
);</code></pre>
          </div>

          <div class="use-case-card">
            <h3>2. Dependent Dropdowns</h3>
            <pre><code>countrySelect.valueChanges.pipe(
  switchMap(countryId => 
    this.api.getCities(countryId)
  )
).subscribe(cities => 
  this.cities = cities
);</code></pre>
          </div>

          <div class="use-case-card">
            <h3>3. Route Parameter Changes</h3>
            <pre><code>route.params.pipe(
  switchMap(params => 
    this.api.getUserById(params['id'])
  )
).subscribe(user => 
  this.user = user
);</code></pre>
          </div>

          <div class="use-case-card">
            <h3>4. Typeahead Search</h3>
            <pre><code>searchBox.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query => 
    this.api.search(query)
  )
).subscribe(results => 
  this.results = results
);</code></pre>
          </div>
        </div>
      </section>

      <!-- Common Mistakes -->
      <section class="section">
        <h2>⚠️ Common Mistakes</h2>
        <div class="mistakes">
          <div class="mistake bad">
            <h3>❌ BAD: Using switchMap for POST/PUT/DELETE</h3>
            <pre><code>// DON'T DO THIS!
saveButton.click$.pipe(
  switchMap(() => this.api.saveUser(user))
).subscribe();</code></pre>
            <p class="explanation">Problem: If user clicks twice, first save is cancelled!</p>
          </div>

          <div class="mistake good">
            <h3>✅ GOOD: Use exhaustMap or concatMap instead</h3>
            <pre><code>// Use exhaustMap to ignore clicks while saving
saveButton.click$.pipe(
  exhaustMap(() => this.api.saveUser(user))
).subscribe();</code></pre>
            <p class="explanation">Solution: exhaustMap ignores new clicks until save completes.</p>
          </div>
        </div>
      </section>

      <!-- Best Practices -->
      <section class="section">
        <h2>✨ Best Practices</h2>
        <ul class="best-practices">
          <li>✅ Use switchMap for GET requests where only latest matters</li>
          <li>✅ Combine with debounceTime for search inputs</li>
          <li>✅ Add distinctUntilChanged to avoid duplicate requests</li>
          <li>✅ Handle errors with catchError to prevent stream termination</li>
          <li>⚠️ Never use for operations that must complete (POST/PUT/DELETE)</li>
          <li>⚠️ Be aware of cancellation side effects</li>
        </ul>
      </section>

      <!-- Related Operators -->
      <section class="section">
        <h2>🔗 Related Operators</h2>
        <div class="related-operators">
          <a routerLink="/transformation/map" class="operator-link">
            <span class="icon">🔄</span>
            <div>
              <strong>map</strong>
              <p>Simple synchronous transformation</p>
            </div>
          </a>
          <a routerLink="/transformation/mergemap" class="operator-link">
            <span class="icon">🔀</span>
            <div>
              <strong>mergeMap</strong>
              <p>Runs all inner observables concurrently</p>
            </div>
          </a>
          <a routerLink="/transformation/concatmap" class="operator-link">
            <span class="icon">⛓️</span>
            <div>
              <strong>concatMap</strong>
              <p>Runs inner observables sequentially</p>
            </div>
          </a>
          <a routerLink="/transformation/exhaustmap" class="operator-link">
            <span class="icon">🚫</span>
            <div>
              <strong>exhaustMap</strong>
              <p>Ignores new values while inner observable is active</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .operator-example {
      max-width: 1200px;
      margin: 0 auto;
    }

    .example-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .example-header h1 {
      font-size: 2rem;
      color: #1f2937;
    }

    .difficulty {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .difficulty.intermediate {
      background: #fef3c7;
      color: #92400e;
    }

    .section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .section h2 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .description {
      line-height: 1.6;
      color: #4b5563;
    }

    code {
      background: #f3f4f6;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: #dc2626;
    }

    .use-cases {
      list-style: none;
      padding: 0;
    }

    .use-cases li {
      padding: 0.5rem 0;
      color: #4b5563;
      line-height: 1.6;
    }

    .code-block {
      background: #1f2937;
      color: #f9fafb;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
    }

    .code-block pre {
      margin: 0;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      line-height: 1.6;
    }

    .demo-description {
      color: #6b7280;
      margin-bottom: 1rem;
      font-style: italic;
    }

    .demo-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #4b5563;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #e5e7eb;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      background: #fee2e2;
      color: #991b1b;
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid #dc2626;
    }

    .result-panel {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f3f4f6;
      border-bottom: 1px solid #e5e7eb;
    }

    .result-header h3 {
      margin: 0;
      font-size: 1rem;
      color: #1f2937;
    }

    .execution-time {
      color: #059669;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .result-content {
      padding: 1rem;
      margin: 0;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      line-height: 1.6;
    }

    .explanation h3 {
      color: #1f2937;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    .explanation ol {
      color: #4b5563;
      line-height: 1.8;
    }

    .marble-diagram {
      background: #1f2937;
      color: #10b981;
      padding: 1rem;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      overflow-x: auto;
    }

    .use-case-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .use-case-card {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }

    .use-case-card h3 {
      color: #1f2937;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .use-case-card pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.75rem;
      line-height: 1.4;
    }

    .mistakes {
      display: grid;
      gap: 1rem;
    }

    .mistake {
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid;
    }

    .mistake.bad {
      background: #fee2e2;
      border-left-color: #dc2626;
    }

    .mistake.good {
      background: #d1fae5;
      border-left-color: #059669;
    }

    .mistake h3 {
      margin-top: 0;
      font-size: 1rem;
    }

    .mistake pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.875rem;
    }

    .mistake .explanation {
      color: #4b5563;
      font-style: italic;
      margin-top: 0.5rem;
    }

    .best-practices {
      list-style: none;
      padding: 0;
    }

    .best-practices li {
      padding: 0.5rem 0;
      color: #4b5563;
      line-height: 1.6;
    }

    .related-operators {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .operator-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
    }

    .operator-link:hover {
      background: #f3f4f6;
      border-color: #667eea;
      transform: translateY(-2px);
    }

    .operator-link .icon {
      font-size: 2rem;
    }

    .operator-link strong {
      color: #667eea;
      display: block;
      margin-bottom: 0.25rem;
    }

    .operator-link p {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }
  `]
})
export class SwitchMapExampleComponent {
  private dummyApi = inject(DummyApiService);
  
  loading = signal(false);
  result = signal<any>(null);
  error = signal<string>('');
  executionTime = signal(0);
  searchCount = signal(0);

  codeExample = `// Search products with switchMap
searchInput.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query => 
    this.api.searchProducts(query)
  )
).subscribe(products => {
  this.searchResults = products;
});

// Key behavior: Previous search is cancelled
// when new search term arrives`;

  runExample() {
    this.loading.set(true);
    this.error.set('');
    const startTime = performance.now();
    const currentSearch = this.searchCount() + 1;
    this.searchCount.set(currentSearch);

    // Simulate user typing different search terms
    const searchTerms = ['laptop', 'phone', 'tablet'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    // Use switchMap pattern: if another search starts, this one gets cancelled
    this.dummyApi.searchProducts(randomTerm).pipe(
      delay(1000), // Simulate network delay
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      }),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => {
        this.result.set({
          searchTerm: randomTerm,
          searchNumber: currentSearch,
          productsFound: data.length,
          products: data
        });
      },
      error: (err) => this.error.set(err.message)
    });
  }

  clearResults() {
    this.result.set(null);
    this.error.set('');
    this.executionTime.set(0);
  }
}

// Made with Bob
