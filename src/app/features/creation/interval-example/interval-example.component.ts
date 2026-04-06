import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';

interface Emission {
  index: number;
  value: number;
  time: number;
}

@Component({
  selector: 'app-interval-example',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './interval-example.component.html',
  styleUrls: ['./interval-example.component.scss']
})
export class IntervalExampleComponent {
  loading = signal(false);
  emissions = signal<Emission[]>([]);
  intervalMs = 1000;
  maxEmissions = 5;
  private subscription?: Subscription;

  codeExample = `// Emit values at regular intervals
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

// Emit every 1 second
interval(1000).pipe(
  take(5) // Take only 5 emissions
).subscribe(value => {
  console.log(value); // 0, 1, 2, 3, 4
});`;

  runExample() {
    this.loading.set(true);
    this.emissions.set([]);
    
    const startTime = performance.now();
    const emissionsList: Emission[] = [];

    this.subscription = interval(this.intervalMs).pipe(
      take(this.maxEmissions),
      tap(value => {
        const time = Math.round(performance.now() - startTime);
        emissionsList.push({ index: value, value, time });
        this.emissions.set([...emissionsList]);
      })
    ).subscribe({
      complete: () => this.loading.set(false)
    });
  }

  stopExample() {
    this.subscription?.unsubscribe();
    this.loading.set(false);
  }

  clearResults() {
    this.stopExample();
    this.emissions.set([]);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

// Made with Bob