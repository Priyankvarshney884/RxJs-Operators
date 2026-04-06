import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map, tap, finalize } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-map-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="operator-example">
      <!-- Header -->
      <div class="example-header">
        <h1>🔄 map Operator</h1>
        <span class="difficulty beginner">🟢 Beginner</span>
      </div>

      <!-- Description -->
      <section class="section">
        <h2>What is map?</h2>
        <p class="description">
          The <code>map</code> operator transforms each value emitted by the source Observable 
          by applying a projection function to it. It's one of the most commonly used operators 
          in RxJS and is similar to Array.map() in JavaScript.
        </p>
      </section>

      <!-- When to Use -->
      <section class="section">
        <h2>When to Use</h2>
        <ul class="use-cases">
          <li>✅ Transform data format (e.g., API response to UI model)</li>
          <li>✅ Extract specific properties from objects</li>
          <li>✅ Perform calculations on values</li>
          <li>✅ Convert data types</li>
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
        <div class="demo-controls">
          <button 
            class="btn btn-primary" 
            (click)="runExample()"
            [disabled]="loading()">
            {{ loading() ? '⏳ Loading...' : '▶️ Run Example' }}
          </button>
          <button 
            class="btn btn-secondary" 
            (click)="clearResults()"
            [disabled]="loading()">
            🗑️ Clear
          </button>
        </div>

        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Fetching users from API...</p>
          </div>
        }

        @if (error()) {
          <div class="error-state">
            <h3>❌ Error</h3>
            <p>{{ error() }}</p>
          </div>
        }

        @if (result()) {
          <div class="result-panel">
            <h3>✅ Result</h3>
            <div class="result-stats">
              <span class="stat">
                <strong>Execution Time:</strong> {{ executionTime() }}ms
              </span>
              <span class="stat">
                <strong>Items:</strong> {{ result()?.length }}
              </span>
            </div>
            <div class="result-content">
              <pre>{{ result() | json }}</pre>
            </div>
          </div>
        }
      </section>

      <!-- Explanation -->
      <section class="section">
        <h2>How It Works</h2>
        <div class="explanation">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Source Observable</h4>
              <p>We start with an Observable that emits user objects from the API</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Apply map Operator</h4>
              <p>The map operator transforms each user object into a simpler format</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Transformed Output</h4>
              <p>We receive the transformed data with only the fields we need</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Real-World Use Cases -->
      <section class="section">
        <h2>Real-World Use Cases</h2>
        <div class="use-case-grid">
          <div class="use-case-card">
            <h4>🎨 UI Data Transformation</h4>
            <p>Convert API response format to match your component's needs</p>
            <code>map(user => ({{ '{' }} name: user.fullName, avatar: user.photoUrl {{ '}' }}))</code>
          </div>
          <div class="use-case-card">
            <h4>💰 Price Calculations</h4>
            <p>Apply discounts, taxes, or currency conversions</p>
            <code>map(price => price * 1.1) // Add 10% tax</code>
          </div>
          <div class="use-case-card">
            <h4>📊 Data Extraction</h4>
            <p>Extract specific properties from complex objects</p>
            <code>map(response => response.data.items)</code>
          </div>
          <div class="use-case-card">
            <h4>🔤 String Manipulation</h4>
            <p>Transform text data (uppercase, trim, format)</p>
            <code>map(text => text.toUpperCase().trim())</code>
          </div>
        </div>
      </section>

      <!-- Common Mistakes -->
      <section class="section warning">
        <h2>⚠️ Common Mistakes</h2>
        <div class="mistake">
          <h4>❌ Don't use map for side effects</h4>
          <pre><code>// BAD - side effects in map
map(user => {{ '{' }}
  console.log(user); // Side effect!
  this.saveToCache(user); // Side effect!
  return user;
{{ '}' }})</code></pre>
          <pre><code>// GOOD - use tap for side effects
tap(user => {{ '{' }}
  console.log(user);
  this.saveToCache(user);
{{ '}' }}),
map(user => transformUser(user))</code></pre>
        </div>
      </section>

      <!-- Best Practices -->
      <section class="section success">
        <h2>✅ Best Practices</h2>
        <ul class="best-practices">
          <li>Keep transformation functions pure (no side effects)</li>
          <li>Use map for synchronous transformations only</li>
          <li>For async operations, use switchMap, mergeMap, or concatMap</li>
          <li>Chain multiple map operators for complex transformations</li>
          <li>Consider performance for large datasets</li>
        </ul>
      </section>

      <!-- Related Operators -->
      <section class="section">
        <h2>Related Operators</h2>
        <div class="related-operators">
          <a routerLink="/transformation/switchmap" class="operator-link">
            <span class="icon">🔄</span>
            <span class="name">switchMap</span>
            <span class="desc">For async transformations</span>
          </a>
          <a routerLink="/transformation/mergemap" class="operator-link">
            <span class="icon">🔄</span>
            <span class="name">mergeMap</span>
            <span class="desc">Parallel async operations</span>
          </a>
          <a routerLink="/utility/tap" class="operator-link">
            <span class="icon">🛠️</span>
            <span class="name">tap</span>
            <span class="desc">For side effects</span>
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
      align-items: center;
      justify-content: space-between;
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
      font-size: 0.9rem;
    }

    .difficulty.beginner {
      background: #d1fae5;
      color: #065f46;
    }

    .section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section h2 {
      color: #1f2937;
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
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .demo-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #d1d5db;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e5e7eb;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-state {
      background: #fee2e2;
      border: 1px solid #fecaca;
      padding: 1.5rem;
      border-radius: 8px;
      color: #991b1b;
    }

    .result-panel {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .result-panel h3 {
      color: #166534;
      margin-bottom: 1rem;
    }

    .result-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #bbf7d0;
    }

    .stat {
      color: #166534;
    }

    .result-content {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      max-height: 400px;
      overflow-y: auto;
    }

    .result-content pre {
      margin: 0;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      color: #1f2937;
    }

    .explanation {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .step {
      display: flex;
      gap: 1rem;
    }

    .step-number {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .step-content h4 {
      margin-bottom: 0.5rem;
      color: #1f2937;
    }

    .step-content p {
      color: #6b7280;
      line-height: 1.6;
    }

    .use-case-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .use-case-card {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .use-case-card h4 {
      margin-bottom: 0.5rem;
      color: #1f2937;
    }

    .use-case-card p {
      color: #6b7280;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }

    .use-case-card code {
      display: block;
      background: #1f2937;
      color: #f9fafb;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      overflow-x: auto;
    }

    .section.warning {
      background: #fffbeb;
      border: 1px solid #fde68a;
    }

    .section.success {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
    }

    .mistake h4 {
      color: #991b1b;
      margin-bottom: 0.5rem;
    }

    .mistake pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 4px;
      margin: 0.5rem 0;
      overflow-x: auto;
    }

    .best-practices {
      list-style: none;
      padding: 0;
    }

    .best-practices li {
      padding: 0.5rem 0;
      color: #166534;
      padding-left: 1.5rem;
      position: relative;
    }

    .best-practices li::before {
      content: "✓";
      position: absolute;
      left: 0;
      font-weight: bold;
    }

    .related-operators {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .operator-link {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      text-decoration: none;
      color: #1f2937;
      transition: all 0.2s;
    }

    .operator-link:hover {
      background: #f3f4f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .operator-link .icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .operator-link .name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .operator-link .desc {
      font-size: 0.875rem;
      color: #6b7280;
    }
  `]
})
export class MapExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);

  codeExample = '// Transform user data using map operator\n' +
    'this.dummyApi.getUsers().pipe(\n' +
    '  map(users => users.map(user => ({\n' +
    '    fullName: `${user.firstName} ${user.lastName}`,\n' +
    '    email: user.email,\n' +
    '    isAdmin: user.role === \'admin\'\n' +
    '  })))\n' +
    ').subscribe(transformedUsers => {\n' +
    '  console.log(transformedUsers);\n' +
    '});';

  runExample() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    
    const startTime = performance.now();

    this.dummyApi.getUsers().pipe(
      map(users => users.map(user => ({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        isAdmin: user.role === 'admin',
        ageGroup: user.age && user.age < 30 ? 'Young' : 'Experienced'
      }))),
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      }),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => this.result.set(data),
      error: (err) => this.error.set(err.message)
    });
  }

  clearResults() {
    this.result.set(null);
    this.error.set(null);
    this.executionTime.set(0);
  }
}

// Made with Bob
