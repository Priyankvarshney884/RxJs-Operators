import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { exhaustMap, tap, finalize, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-exhaustmap-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="operator-example">
      <!-- Header -->
      <div class="example-header">
        <h1>🚫 exhaustMap Operator</h1>
        <span class="difficulty intermediate">🟡 Intermediate</span>
      </div>

      <!-- Description -->
      <section class="section">
        <h2>What is exhaustMap?</h2>
        <p class="description">
          The <code>exhaustMap</code> operator maps each value to an Observable, but <strong>ignores new values</strong> 
          while the current inner Observable is still active. Perfect for preventing duplicate submissions 
          (like double-clicking a save button).
        </p>
      </section>

      <!-- When to Use -->
      <section class="section">
        <h2>When to Use</h2>
        <ul class="use-cases">
          <li>✅ Form submissions (prevent double-submit)</li>
          <li>✅ Login/authentication (ignore extra clicks)</li>
          <li>✅ Payment processing (prevent duplicate charges)</li>
          <li>✅ API calls that shouldn't be interrupted or duplicated</li>
          <li>✅ Any operation where you want to ignore rapid clicks</li>
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
          Click "Save Data" multiple times rapidly. Notice how exhaustMap ignores clicks 
          while the save operation is in progress. Clicks: {{ clickCount() }} | Processed: {{ processedCount() }}
        </p>
        
        <div class="demo-controls">
          <button 
            class="btn-primary" 
            (click)="simulateClick()">
            @if (loading()) {
              <span class="spinner"></span>
              Saving... ({{ clickCount() - processedCount() }} clicks ignored)
            } @else {
              💾 Save Data
            }
          </button>
          
          <button 
            class="btn-secondary" 
            (click)="clearResults()"
            [disabled]="!result()">
            Clear
          </button>
        </div>

        @if (ignoredClicks() > 0) {
          <div class="info-message">
            ℹ️ Ignored {{ ignoredClicks() }} click(s) while processing
          </div>
        }

        @if (error()) {
          <div class="error-message">
            ❌ Error: {{ error() }}
          </div>
        }

        @if (result()) {
          <div class="result-panel">
            <div class="result-header">
              <h3>Save Results</h3>
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
          <h3>🚫 Ignore Behavior:</h3>
          <ol>
            <li>User clicks "Save" → starts save operation (2s)</li>
            <li>User clicks again → <strong>IGNORED</strong> (save still in progress)</li>
            <li>User clicks again → <strong>IGNORED</strong> (save still in progress)</li>
            <li>Save completes → next click will be processed</li>
          </ol>
          
          <h3>📊 Marble Diagram:</h3>
          <pre class="marble-diagram">
Source:     --1--2--3----4----|
            exhaustMap(val => API call taking 3 seconds)
Inner:      --A---------B-----|
               X  X      (2,3 ignored)
Result:     --A---------B-----|
          </pre>
          
          <h3>🔄 vs Other Operators:</h3>
          <ul>
            <li><strong>exhaustMap:</strong> Ignores new while active - Prevents duplicates</li>
            <li><strong>switchMap:</strong> Cancels previous - Only latest completes</li>
            <li><strong>concatMap:</strong> Queues all - All eventually process</li>
            <li><strong>mergeMap:</strong> Runs all concurrently - Can cause duplicates</li>
          </ul>
        </div>
      </section>

      <!-- Real-world Use Cases -->
      <section class="section">
        <h2>Real-world Use Cases</h2>
        <div class="use-case-grid">
          <div class="use-case-card">
            <h3>1. Form Submission</h3>
            <pre><code>saveButton.click$.pipe(
  exhaustMap(() => 
    this.api.saveForm(formData)
  )
).subscribe(result => 
  this.showSuccess()
);</code></pre>
            <p class="note">Prevents double-submission</p>
          </div>

          <div class="use-case-card">
            <h3>2. Login Button</h3>
            <pre><code>loginButton.click$.pipe(
  exhaustMap(() => 
    this.auth.login(credentials)
  )
).subscribe(user => 
  this.navigateToHome()
);</code></pre>
            <p class="note">Ignores extra clicks during login</p>
          </div>

          <div class="use-case-card">
            <h3>3. Payment Processing</h3>
            <pre><code>payButton.click$.pipe(
  exhaustMap(() => 
    this.payment.process(amount)
  )
).subscribe(receipt => 
  this.showReceipt(receipt)
);</code></pre>
            <p class="note">Prevents duplicate charges</p>
          </div>

          <div class="use-case-card">
            <h3>4. Refresh Button</h3>
            <pre><code>refreshButton.click$.pipe(
  exhaustMap(() => 
    this.api.refreshData()
  )
).subscribe(data => 
  this.updateView(data)
);</code></pre>
            <p class="note">Ignores clicks while refreshing</p>
          </div>
        </div>
      </section>

      <!-- Common Mistakes -->
      <section class="section">
        <h2>⚠️ Common Mistakes</h2>
        <div class="mistakes">
          <div class="mistake bad">
            <h3>❌ BAD: Using mergeMap for save operations</h3>
            <pre><code>// DON'T DO THIS!
saveButton.click$.pipe(
  mergeMap(() => this.api.saveData(data))
).subscribe();</code></pre>
            <p class="explanation">Problem: Multiple rapid clicks create duplicate saves!</p>
          </div>

          <div class="mistake good">
            <h3>✅ GOOD: Use exhaustMap to prevent duplicates</h3>
            <pre><code>// Use exhaustMap to ignore extra clicks
saveButton.click$.pipe(
  exhaustMap(() => this.api.saveData(data))
).subscribe();</code></pre>
            <p class="explanation">Solution: Extra clicks are ignored while save is in progress.</p>
          </div>
        </div>
      </section>

      <!-- Best Practices -->
      <section class="section">
        <h2>✨ Best Practices</h2>
        <ul class="best-practices">
          <li>✅ Use exhaustMap for operations that shouldn't be duplicated</li>
          <li>✅ Perfect for button clicks (save, submit, login)</li>
          <li>✅ Prevents race conditions in critical operations</li>
          <li>✅ Provide visual feedback (disable button or show spinner)</li>
          <li>✅ Consider adding a success message when operation completes</li>
          <li>⚠️ Not suitable for search/autocomplete (use switchMap)</li>
          <li>⚠️ Not suitable for operations that must all complete (use concatMap)</li>
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
          <a routerLink="/transformation/switchmap" class="operator-link">
            <span class="icon">🔀</span>
            <div>
              <strong>switchMap</strong>
              <p>Cancels previous, uses latest</p>
            </div>
          </a>
          <a routerLink="/transformation/mergemap" class="operator-link">
            <span class="icon">🔀</span>
            <div>
              <strong>mergeMap</strong>
              <p>Runs all concurrently</p>
            </div>
          </a>
          <a routerLink="/transformation/concatmap" class="operator-link">
            <span class="icon">⛓️</span>
            <div>
              <strong>concatMap</strong>
              <p>Runs sequentially</p>
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

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

    .info-message {
      background: #dbeafe;
      color: #1e40af;
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid #3b82f6;
      margin-bottom: 1rem;
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

    .explanation ol, .explanation ul {
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

    .use-case-card .note {
      color: #6b7280;
      font-size: 0.875rem;
      font-style: italic;
      margin-top: 0.5rem;
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
export class ExhaustMapExampleComponent {
  private dummyApi = inject(DummyApiService);
  private clicks$ = new Subject<void>();
  
  loading = signal(false);
  result = signal<any>(null);
  error = signal<string>('');
  executionTime = signal(0);
  clickCount = signal(0);
  processedCount = signal(0);
  ignoredClicks = signal(0);

  codeExample = `// Prevent double-submission with exhaustMap
saveButton.click$.pipe(
  exhaustMap(() => 
    this.api.saveData(formData)
  )
).subscribe(result => {
  this.showSuccess();
});

// Key behavior: Ignores new clicks
// while save is in progress`;

  constructor() {
    // Set up exhaustMap pattern
    this.clicks$.pipe(
      exhaustMap(() => {
        this.loading.set(true);
        this.processedCount.set(this.processedCount() + 1);
        const startTime = performance.now();

        return this.dummyApi.getUsers().pipe(
          delay(2000), // Simulate save operation
          tap(() => {
            const endTime = performance.now();
            this.executionTime.set(Math.round(endTime - startTime));
          }),
          finalize(() => {
            this.loading.set(false);
            this.ignoredClicks.set(this.clickCount() - this.processedCount());
          })
        );
      })
    ).subscribe({
      next: (data) => {
        this.result.set({
          totalClicks: this.clickCount(),
          processedRequests: this.processedCount(),
          ignoredClicks: this.ignoredClicks(),
          lastSaveData: {
            timestamp: new Date().toISOString(),
            recordsSaved: data.length,
            status: 'success'
          }
        });
      },
      error: (err) => this.error.set(err.message)
    });
  }

  simulateClick() {
    this.clickCount.set(this.clickCount() + 1);
    this.clicks$.next();
  }

  clearResults() {
    this.result.set(null);
    this.error.set('');
    this.executionTime.set(0);
    this.clickCount.set(0);
    this.processedCount.set(0);
    this.ignoredClicks.set(0);
  }
}

// Made with Bob
