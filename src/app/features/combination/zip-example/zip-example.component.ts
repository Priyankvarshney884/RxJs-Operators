import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { zip, interval } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-zip-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './zip-example.component.html',
  styleUrls: ['./zip-example.component.scss']
})
export class ZipExampleComponent {
  pairs = signal<Array<{ fast: number; slow: number; time: string }>>([]);
  running = signal(false);

  codeExample = `// Pair emissions by index
zip(
  fastSource$,  // Emits: 0, 1, 2, 3...
  slowSource$   // Emits: A, B, C, D...
).subscribe(([fast, slow]) => {
  console.log(\`Pair: \${fast} - \${slow}\`);
  // Output: [0, A], [1, B], [2, C]...
});`;

  runExample() {
    this.pairs.set([]);
    this.running.set(true);

    const fast$ = interval(800).pipe(
      take(6),
      map(val => val)
    );

    const slow$ = interval(1500).pipe(
      take(4),
      map(val => val)
    );

    zip(fast$, slow$).subscribe({
      next: ([fast, slow]) => {
        this.pairs.update(arr => [...arr, {
          fast,
          slow,
          time: new Date().toLocaleTimeString()
        }]);
      },
      complete: () => {
        this.running.set(false);
      }
    });
  }

  clearResults() {
    this.pairs.set([]);
    this.running.set(false);
  }
}

// Made with Bob