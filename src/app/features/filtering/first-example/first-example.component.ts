import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { interval, of, first, take } from 'rxjs';

interface Emission {
  value: number;
  time: number;
  isFirst: boolean;
}

@Component({
  selector: 'app-first-example',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './first-example.component.html',
  styleUrls: ['./first-example.component.scss']
})
export class FirstExampleComponent {
  loading = signal(false);
  emissions = signal<Emission[]>([]);
  firstValue = signal<number | null>(null);
  useCondition = signal(false);
  conditionValue = signal(5);
  
  codeExample = `// Basic usage - emit first value
interval(1000).pipe(
  take(10),
  first()
).subscribe(value => {
  console.log('First value:', value); // 0
});

// With condition - emit first value > 5
interval(1000).pipe(
  take(10),
  first(value => value > 5)
).subscribe(value => {
  console.log('First value > 5:', value); // 6
});

// With default value if no match
of(1, 2, 3).pipe(
  first(value => value > 10, 999)
).subscribe(value => {
  console.log('Value:', value); // 999 (default)
});`;

  runExample() {
    this.loading.set(true);
    this.emissions.set([]);
    this.firstValue.set(null);
    
    const startTime = Date.now();
    const source$ = interval(500).pipe(take(10));
    
    // Show all emissions for visualization
    const allEmissions: Emission[] = [];
    source$.subscribe({
      next: (value) => {
        const emission: Emission = {
          value,
          time: Date.now() - startTime,
          isFirst: false
        };
        allEmissions.push(emission);
        this.emissions.set([...allEmissions]);
      }
    });
    
    // Apply first operator
    const firstOperator$ = this.useCondition()
      ? source$.pipe(first(value => value > this.conditionValue()))
      : source$.pipe(first());
    
    firstOperator$.subscribe({
      next: (value) => {
        this.firstValue.set(value);
        // Mark the first value in emissions
        const updated = allEmissions.map(e => ({
          ...e,
          isFirst: e.value === value
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
    this.firstValue.set(null);
    this.loading.set(false);
  }

  toggleCondition() {
    this.useCondition.set(!this.useCondition());
  }
}

// Made with Bob
