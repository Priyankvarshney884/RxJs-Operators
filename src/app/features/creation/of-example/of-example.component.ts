import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

interface Emission {
  index: number;
  value: any;
  time: number;
}

@Component({
  selector: 'app-of-example',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './of-example.component.html',
  styleUrls: ['./of-example.component.scss']
})
export class OfExampleComponent {
  loading = signal(false);
  result = signal<any>(null);
  executionTime = signal(0);
  emissions = signal<Emission[]>([]);
  completed = signal(false);
  completionTime = signal(0);
  selectedType: 'numbers' | 'strings' | 'objects' | 'mixed' = 'numbers';

  codeExample = `// Create Observable from static values
import { of } from 'rxjs';

// Emit numbers
of(1, 2, 3, 4, 5).subscribe(value => {
  console.log(value); // 1, 2, 3, 4, 5
});

// Emit objects
of(
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
).subscribe(user => {
  console.log(user);
});

// Mixed types
of('Hello', 42, true, { key: 'value' }).subscribe(value => {
  console.log(value);
});`;

  runExample() {
    this.loading.set(true);
    this.emissions.set([]);
    this.result.set(null);
    this.completed.set(false);
    
    const startTime = performance.now();
    const values = this.getValuesForType();
    const emissionsList: Emission[] = [];
    const collectedValues: any[] = [];

    of(...values).pipe(
      tap(value => {
        const time = Math.round(performance.now() - startTime);
        emissionsList.push({
          index: emissionsList.length,
          value,
          time
        });
        this.emissions.set([...emissionsList]);
        collectedValues.push(value);
      }),
      finalize(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
        this.completionTime.set(Math.round(endTime - startTime));
        this.completed.set(true);
        this.loading.set(false);
        this.result.set(collectedValues);
      })
    ).subscribe();
  }

  private getValuesForType(): any[] {
    switch (this.selectedType) {
      case 'numbers':
        return [1, 2, 3, 4, 5];
      
      case 'strings':
        return ['A', 'B', 'C'];
      
      case 'objects':
        return [
          { id: 1, name: 'Alice', role: 'Developer' },
          { id: 2, name: 'Bob', role: 'Designer' },
          { id: 3, name: 'Charlie', role: 'Manager' }
        ];
      
      case 'mixed':
        return [
          'Hello',
          42,
          true,
          { key: 'value' },
          [1, 2, 3]
        ];
      
      default:
        return [1, 2, 3];
    }
  }

  clearResults() {
    this.result.set(null);
    this.emissions.set([]);
    this.executionTime.set(0);
    this.completed.set(false);
    this.completionTime.set(0);
  }
}

// Made with Bob