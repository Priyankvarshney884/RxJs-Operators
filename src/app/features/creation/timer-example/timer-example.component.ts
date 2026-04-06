import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timer, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';

interface Emission {
  index: number;
  value: number;
  time: number;
}

@Component({
  selector: 'app-timer-example',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './timer-example.component.html',
  styleUrls: ['./timer-example.component.scss']
})
export class TimerExampleComponent {
  loading = signal(false);
  emissions = signal<Emission[]>([]);
  initialDelay = 2000;
  intervalPeriod = 1000;
  maxEmissions = 5;
  private subscription?: Subscription;

  codeExample = `// Emit after delay, then at intervals
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

// Emit after 2 seconds, then every 1 second
timer(2000, 1000).pipe(
  take(5)
).subscribe(value => {
  console.log(value); // 0, 1, 2, 3, 4
});

// One-time emission after delay
timer(3000).subscribe(() => {
  console.log('Executed after 3 seconds');
});`;

  runExample() {
    this.loading.set(true);
    this.emissions.set([]);
    
    const startTime = performance.now();
    const emissionsList: Emission[] = [];

    this.subscription = timer(this.initialDelay, this.intervalPeriod).pipe(
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