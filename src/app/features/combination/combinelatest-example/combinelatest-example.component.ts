import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { startWith, debounceTime } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-combinelatest-example',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './combinelatest-example.component.html',
  styleUrls: ['./combinelatest-example.component.scss']
})
export class CombineLatestExampleComponent {
  private dummyApi = inject(DummyApiService);

  searchControl = new FormControl('');
  categoryControl = new FormControl('all');
  sortControl = new FormControl('name');
  
  result = signal<any[]>([]);
  emissionCount = signal(0);
  categories = ['all', 'Electronics', 'Furniture', 'Stationery'];
  sortOptions = ['name', 'price'];

  codeExample = `// Combine multiple form controls
combineLatest([
  searchTerm$,
  category$,
  sortOrder$
]).pipe(
  debounceTime(300)
).subscribe(([search, category, sort]) => {
  // Emits whenever ANY input changes
  this.filterProducts(search, category, sort);
});`;

  ngOnInit() {
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.categoryControl.valueChanges.pipe(startWith('all')),
      this.sortControl.valueChanges.pipe(startWith('name'))
    ]).pipe(
      debounceTime(300)
    ).subscribe(([search, category, sort]) => {
      this.emissionCount.update(c => c + 1);
      this.filterProducts(search || '', category || 'all', sort || 'name');
    });
  }

  filterProducts(search: string, category: string, sort: string) {
    this.dummyApi.getProducts().subscribe(products => {
      let filtered = products;

      // Filter by search
      if (search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filter by category
      if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }

      // Sort
      filtered = [...filtered].sort((a, b) => {
        if (sort === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          return a.price - b.price;
        }
      });

      this.result.set(filtered);
    });
  }

  clearFilters() {
    this.searchControl.setValue('', { emitEvent: false });
    this.categoryControl.setValue('all', { emitEvent: false });
    this.sortControl.setValue('name', { emitEvent: false });
    this.result.set([]);
    this.emissionCount.set(0);
  }
}

// Made with Bob