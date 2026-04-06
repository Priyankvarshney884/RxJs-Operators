import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-distinctuntilchanged-example',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './distinctuntilchanged-example.component.html',
  styleUrls: ['./distinctuntilchanged-example.component.scss']
})
export class DistinctUntilChangedExampleComponent {
  searchControl = new FormControl('');
  emissionCount = signal(0);
  distinctEmissionCount = signal(0);
  emissions = signal<string[]>([]);
  distinctEmissions = signal<string[]>([]);

  codeExample = `// Only emit when value changes from previous
searchControl.valueChanges.pipe(
  distinctUntilChanged(),
  tap(value => console.log('Distinct value:', value))
).subscribe(value => {
  // Only called when value actually changes
});`;

  ngOnInit() {
    // Track all emissions
    this.searchControl.valueChanges.pipe(
      tap(value => {
        this.emissionCount.update(c => c + 1);
        this.emissions.update(arr => [...arr, value || '(empty)']);
      })
    ).subscribe();

    // Track distinct emissions
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      tap(value => {
        this.distinctEmissionCount.update(c => c + 1);
        this.distinctEmissions.update(arr => [...arr, value || '(empty)']);
      })
    ).subscribe();
  }

  clearResults() {
    this.searchControl.setValue('', { emitEvent: false });
    this.emissionCount.set(0);
    this.distinctEmissionCount.set(0);
    this.emissions.set([]);
    this.distinctEmissions.set([]);
  }
}

// Made with Bob