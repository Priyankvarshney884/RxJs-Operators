import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { interval, of, last, take } from 'rxjs';

interface Emission {
  value: number;
  time: number;
  isLast: boolean;
}

@Component({
  selector: 'app-last-example',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './last-example.component.html',
  styleUrls: ['./last-example.component.scss']
})
export class LastExampleComponent {
  loading = signal(false);
  emissions = signal<Emission[]>([]);
  lastValue = signal<number | null>(null);
  useCondition = signal(false);
  conditionValue = signal(5);
  
  codeExample = `// Basic usage - emit last value
interval(1000).pipe(
  take(10),
  last()
).subscribe(value => {
  console.log('Last value:', value); // 9
});

// With condition - emit last value < 5
interval(1000).pipe(
  take(10),
  last(value => value < 5)
).subscribe(value => {
  console.log('Last value < 5:', value); // 4
});

// With default value if no match
of(1, 2, 3).pipe(
  last(value => value > 10, 999)
).subscribe(value => {
  console.log('Value:', value); // 999 (default)
});`;

  runExample() {
    this.loading.set(true);
    this.emissions.set([]);
    this.lastValue.set(null);
    
    const startTime = Date.now();
    const source$ = interval(500).pipe(take(10));
    
    // Show all emissions for visualization
    const allEmissions: Emission[] = [];
    source$.subscribe({
      next: (value) => {
        const emission: Emission = {
          value,
          time: Date.now() - startTime,
          isLast: false
        };
        allEmissions.push(emission);
        this.emissions.set([...allEmissions]);
      }
    });
    
    // Apply last operator
    const lastOperator$ = this.useCondition()
      ? source$.pipe(last(value => value < this.conditionValue()))
      : source$.pipe(last());
    
    lastOperator$.subscribe({
      next: (value) => {
        this.lastValue.set(value);
        // Mark the last value in emissions
        const updated = allEmissions.map(e => ({
          ...e,
          isLast: e.value === value
        }));
        this.emissions.set(updated);
      },
      complete: () => {
        setTimeout(() => this.loading.set(false), 100);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading.set(false);
      }
    });
  }

  clearResults() {
    this.emissions.set([]);
    this.lastValue.set(null);
    this.loading.set(false);
  }

  toggleCondition() {
    this.useCondition.set(!this.useCondition());
  }
}

// Made with Bob
