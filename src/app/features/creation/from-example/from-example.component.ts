import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { from } from 'rxjs';
import { tap, finalize, delay } from 'rxjs/operators';

interface Emission {
  index: number;
  value: any;
  time: number;
}

interface SourceInfo {
  type: string;
  data: any;
}

@Component({
  selector: 'app-from-example',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './from-example.component.html',
  styleUrls: ['./from-example.component.scss']
})
export class FromExampleComponent {
  loading = signal(false);
  result = signal<any>(null);
  executionTime = signal(0);
  emissions = signal<Emission[]>([]);
  completed = signal(false);
  completionTime = signal(0);
  selectedSource: 'array' | 'promise' | 'string' | 'set' = 'array';
  sourceInfo = signal<SourceInfo | null>(null);
  loadingMessage = signal('Converting to Observable...');

  codeExample = `// Convert array to Observable
from([1, 2, 3, 4, 5]).subscribe(value => {
  console.log(value); // 1, 2, 3, 4, 5
});

// Convert Promise to Observable
from(fetch('/api/data')).subscribe(response => {
  console.log(response);
});

// Convert string (iterable) to Observable
from('Hello').subscribe(char => {
  console.log(char); // 'H', 'e', 'l', 'l', 'o'
});

// Convert Set to Observable
from(new Set([1, 2, 3])).subscribe(value => {
  console.log(value);
});`;

  runExample() {
    this.loading.set(true);
    this.emissions.set([]);
    this.result.set(null);
    this.completed.set(false);
    
    const startTime = performance.now();
    const source = this.getSourceForType();
    this.sourceInfo.set(source);
    
    const emissionsList: Emission[] = [];

    from(source.data).pipe(
      delay(100), // Add small delay to visualize emissions
      tap(value => {
        const time = Math.round(performance.now() - startTime);
        emissionsList.push({
          index: emissionsList.length,
          value,
          time
        });
        this.emissions.set([...emissionsList]);
      }),
      finalize(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
        this.completionTime.set(Math.round(endTime - startTime));
        this.completed.set(true);
        this.loading.set(false);
        this.result.set(true);
      })
    ).subscribe();
  }

  private getSourceForType(): SourceInfo {
    switch (this.selectedSource) {
      case 'array':
        this.loadingMessage.set('Converting array to Observable...');
        return {
          type: 'Array',
          data: [10, 20, 30, 40, 50]
        };
      
      case 'promise':
        this.loadingMessage.set('Converting Promise to Observable...');
        return {
          type: 'Promise',
          data: Promise.resolve({ id: 1, message: 'Promise resolved!' })
        };
      
      case 'string':
        this.loadingMessage.set('Converting string to Observable...');
        return {
          type: 'String (Iterable)',
          data: 'RxJS'
        };
      
      case 'set':
        this.loadingMessage.set('Converting Set to Observable...');
        return {
          type: 'Set',
          data: new Set(['Apple', 'Banana', 'Cherry'])
        };
      
      default:
        return {
          type: 'Array',
          data: [1, 2, 3]
        };
    }
  }

  clearResults() {
    this.result.set(null);
    this.emissions.set([]);
    this.executionTime.set(0);
    this.completed.set(false);
    this.completionTime.set(0);
    this.sourceInfo.set(null);
  }
}

// Made with Bob