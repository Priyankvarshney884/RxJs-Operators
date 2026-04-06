import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { merge, interval } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-merge-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './merge-example.component.html',
  styleUrls: ['./merge-example.component.scss']
})
export class MergeExampleComponent {
  emissions = signal<Array<{ source: string; value: number; time: string }>>([]);
  running = signal(false);

  codeExample = `// Merge multiple event sources
merge(
  clicks$,
  keypress$,
  scroll$
).subscribe(event => {
  console.log('Event from any source:', event);
});`;

  runExample() {
    this.emissions.set([]);
    this.running.set(true);

    const source1$ = interval(1000).pipe(
      take(5),
      map(val => ({ source: 'Source 1', value: val, time: new Date().toLocaleTimeString() }))
    );

    const source2$ = interval(1500).pipe(
      take(4),
      map(val => ({ source: 'Source 2', value: val, time: new Date().toLocaleTimeString() }))
    );

    const source3$ = interval(2000).pipe(
      take(3),
      map(val => ({ source: 'Source 3', value: val, time: new Date().toLocaleTimeString() }))
    );

    merge(source1$, source2$, source3$).subscribe({
      next: (emission) => {
        this.emissions.update(arr => [...arr, emission]);
      },
      complete: () => {
        this.running.set(false);
      }
    });
  }

  clearResults() {
    this.emissions.set([]);
    this.running.set(false);
  }
}

// Made with Bob