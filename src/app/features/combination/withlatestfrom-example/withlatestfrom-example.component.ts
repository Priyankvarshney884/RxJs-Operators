import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { interval, withLatestFrom, take, map } from 'rxjs';

interface CombinedEmission {
  time: number;
  source: number;
  other1: number;
  other2: number;
  combined: string;
}

@Component({
  selector: 'app-withlatestfrom-example',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './withlatestfrom-example.component.html',
  styleUrls: ['./withlatestfrom-example.component.scss']
})
export class WithLatestFromExampleComponent {
  loading = signal(false);
  emissions = signal<CombinedEmission[]>([]);
  sourceInterval = signal(1000);
  other1Interval = signal(500);
  other2Interval = signal(1500);
  
  codeExample = `// Combine source with latest from other observables
const source$ = interval(1000).pipe(take(5));
const other1$ = interval(500).pipe(take(10));
const other2$ = interval(1500).pipe(take(4));

source$.pipe(
  withLatestFrom(other1$, other2$),
  map(([source, other1, other2]) => ({
    source,
    other1,
    other2,
    combined: \`\${source}-\${other1}-\${other2}\`
  }))
).subscribe(result => {
  console.log('Combined:', result);
  // Only emits when source emits
  // Takes latest values from other1$ and other2$
});

// Real-world example: Form with auto-save
const saveButton$ = fromEvent(saveBtn, 'click');
const formValue$ = formControl.valueChanges;
const userId$ = currentUser$;

saveButton$.pipe(
  withLatestFrom(formValue$, userId$),
  map(([_, formData, userId]) => ({
    userId,
    data: formData,
    timestamp: Date.now()
  }))
).subscribe(payload => {
  api.save(payload);
});`;

  runExample() {
    this.loading.set(true);
    this.emissions.set([]);
    
    const startTime = Date.now();
    
    // Create three observables with different intervals
    const source$ = interval(this.sourceInterval()).pipe(take(5));
    const other1$ = interval(this.other1Interval()).pipe(take(10));
    const other2$ = interval(this.other2Interval()).pipe(take(4));
    
    // Combine source with latest from others
    source$.pipe(
      withLatestFrom(other1$, other2$),
      map(([source, other1, other2]) => ({
        time: Date.now() - startTime,
        source,
        other1,
        other2,
        combined: `${source}-${other1}-${other2}`
      }))
    ).subscribe({
      next: (emission) => {
        this.emissions.update(prev => [...prev, emission]);
      },
      complete: () => {
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading.set(false);
      }
    });
  }

  clearResults() {
    this.emissions.set([]);
    this.loading.set(false);
  }
}

// Made with Bob
