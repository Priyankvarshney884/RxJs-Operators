import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { concatMap, tap, finalize, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-concatmap-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="operator-example">
      <!-- Header -->
      <div class="example-header">
        <h1>⛓️ concatMap Operator</h1>
        <span class="difficulty intermediate">🟡 Intermediate</span>
      </div>

      <!-- Description -->
      <section class="section">
        <h2>What is concatMap?</h2>
        <p class="description">
          The <code>concatMap</code> operator maps each value to an Observable, then flattens all inner 
          Observables <strong>sequentially</strong>. It waits for each inner Observable to complete before 
          subscribing to the next one. Perfect for operations that must happen in order.
        </p>
      </section>

      <!-- When to Use -->
      <section class="section">
        <h2>When to Use</h2>
        <ul class="use-cases">
          <li>✅ Sequential API calls (must complete in order)</li>
          <li>✅ File uploads (one at a time)</li>
          <li>✅ Database transactions (maintain order)</li>
          <li>✅ Queue processing (FIFO - First In First Out)</li>
          <li>✅ Operations where order matters</li>
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
          Click "Process Orders" to see how concatMap processes each order sequentially, 
          waiting for each to complete before starting the next.
        </p>
        
        <div class="demo-controls">
          <button 
            class="btn-primary" 
            (click)="runExample()" 
            [disabled]="loading()">
            @if (loading()) {
              <span class="spinner"></span>
              Processing {{ currentOrder() }}/3...
            } @else {
              📦 Process Orders
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
              <h3>Processing Results</h3>
              <span class="execution-time">⚡ Total: {{ executionTime() }}ms</span>
            </div>
            <pre class="result-content">{{ result() | json }}</pre>
          </div>
        }
      </section>

      <!-- How It Works -->
      <section class="section">
        <h2>How It Works</h2>
        <div class="explanation">
          <h3>⛓️ Sequential Processing:</h3>
          <ol>
            <li>Order 1 starts → completes (2s)</li>
            <li>Order 2 starts → completes (2s)</li>
            <li>Order 3 starts → completes (2s)</li>
            <li>Total time: ~6 seconds (sequential)</li>
          </ol>
          
          <h3>📊 Marble Diagram:</h3>
          <pre class="marble-diagram">
Source:     --1--2--3----|
            concatMap(val => API call taking 2 seconds)
Inner:      --A-----B-----C----|
            (waits) (waits)
Result:     --A-----B-----C----|
          </pre>
          
          <h3>🔄 vs Other Operators:</h3>
          <ul>
            <li><strong>concatMap:</strong> Sequential (6s total) - Order guaranteed</li>
            <li><strong>mergeMap:</strong> Concurrent (2s total) - Order not guaranteed</li>
            <li><strong>switchMap:</strong> Cancels previous (2s total) - Only last completes</li>
          </ul>
        </div>
      </section>

      <!-- Real-world Use Cases -->
      <section class="section">
        <h2>Real-world Use Cases</h2>
        <div class="use-case-grid">
          <div class="use-case-card">
            <h3>1. Sequential File Upload</h3>
            <pre><code>files$.pipe(
  concatMap(file => 
    this.api.uploadFile(file)
  )
).subscribe(result => 
  console.log('File uploaded:', result)
);</code></pre>
            <p class="note">Each file uploads completely before next starts</p>
          </div>

          <div class="use-case-card">
            <h3>2. Database Transactions</h3>
            <pre><code>operations$.pipe(
  concatMap(operation => 
    this.db.execute(operation)
  )
).subscribe(result => 
  console.log('Transaction complete')
);</code></pre>
            <p class="note">Maintains transaction order</p>
          </div>

          <div class="use-case-card">
            <h3>3. Queue Processing</h3>
            <pre><code>taskQueue$.pipe(
  concatMap(task => 
    this.processTask(task)
  )
).subscribe(result => 
  this.updateUI(result)
);</code></pre>
            <p class="note">FIFO queue processing</p>
          </div>

          <div class="use-case-card">
            <h3>4. Step-by-Step Wizard</h3>
            <pre><code>wizardSteps$.pipe(
  concatMap(step => 
    this.api.saveStep(step)
  )
).subscribe(() => 
  this.moveToNextStep()
);</code></pre>
            <p class="note">Each step must complete before next</p>
          </div>
        </div>
      </section>

      <!-- Common Mistakes -->
      <section class="section">
        <h2>⚠️ Common Mistakes</h2>
        <div class="mistakes">
          <div class="mistake bad">
            <h3>❌ BAD: Using concatMap for independent operations</h3>
            <pre><code>// DON'T DO THIS if operations are independent!
userIds$.pipe(
  concatMap(id => this.api.getUser(id))
).subscribe();</code></pre>
            <p class="explanation">Problem: Unnecessarily slow! Each request waits for previous.</p>
          </div>

          <div class="mistake good">
            <h3>✅ GOOD: Use mergeMap for independent operations</h3>
            <pre><code>// Use mergeMap for concurrent requests
userIds$.pipe(
  mergeMap(id => this.api.getUser(id))
).subscribe();</code></pre>
            <p class="explanation">Solution: All requests run concurrently, much faster!</p>
          </div>
        </div>
      </section>

      <!-- Best Practices -->
      <section class="section">
        <h2>✨ Best Practices</h2>
        <ul class="best-practices">
          <li>✅ Use concatMap when order matters</li>
          <li>✅ Perfect for queue processing (FIFO)</li>
          <li>✅ Use for operations that must not overlap</li>
          <li>✅ Good for rate-limited APIs (one request at a time)</li>
          <li>⚠️ Avoid for independent operations (use mergeMap instead)</li>
          <li>⚠️ Can be slow if inner observables take long</li>
          <li>⚠️ Consider timeout for long-running operations</li>
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
          <a routerLink="/transformation/exhaustmap" class="operator-link">
            <span class="icon">🚫</span>
            <div>
              <strong>exhaustMap</strong>
              <p>Ignores new while active</p>
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
export class ConcatMapExampleComponent {
  private dummyApi = inject(DummyApiService);
  
  loading = signal(false);
  result = signal<any>(null);
  error = signal<string>('');
  executionTime = signal(0);
  currentOrder = signal(0);

  codeExample = `// Process orders sequentially with concatMap
orders$.pipe(
  concatMap(order => 
    this.api.processOrder(order)
  )
).subscribe(result => {
  console.log('Order processed:', result);
});

// Key behavior: Each order completes
// before the next one starts`;

  runExample() {
    this.loading.set(true);
    this.error.set('');
    this.currentOrder.set(0);
    const startTime = performance.now();
    const orders = [
      { id: 1, product: 'Laptop', amount: 1200 },
      { id: 2, product: 'Mouse', amount: 25 },
      { id: 3, product: 'Keyboard', amount: 75 }
    ];

    const results: any[] = [];

    // Process orders sequentially using concatMap pattern
    of(...orders).pipe(
      concatMap((order, index) => {
        this.currentOrder.set(index + 1);
        return this.dummyApi.getOrders().pipe(
          delay(2000), // Simulate processing time
          tap(() => {
            results.push({
              orderId: order.id,
              product: order.product,
              amount: order.amount,
              processedAt: new Date().toISOString(),
              status: 'completed'
            });
          })
        );
      }),
      finalize(() => {
        this.loading.set(false);
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
      })
    ).subscribe({
      next: () => {
        this.result.set({
          totalOrders: orders.length,
          processedOrders: results,
          processingType: 'Sequential (one at a time)',
          note: 'Each order waited for previous to complete'
        });
      },
      error: (err) => this.error.set(err.message)
    });
  }

  clearResults() {
    this.result.set(null);
    this.error.set('');
    this.executionTime.set(0);
    this.currentOrder.set(0);
  }
}

// Made with Bob
