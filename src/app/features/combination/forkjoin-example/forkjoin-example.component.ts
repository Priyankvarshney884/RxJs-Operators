import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { DummyApiService } from '../../../core/services/dummy-api.service';

@Component({
  selector: 'app-forkjoin-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './forkjoin-example.component.html',
  styleUrls: ['./forkjoin-example.component.scss']
})
export class ForkJoinExampleComponent {
  private dummyApi = inject(DummyApiService);

  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<any>(null);
  executionTime = signal(0);
  individualTimes = signal<{ users: number; products: number; orders: number }>({ users: 0, products: 0, orders: 0 });

  codeExample = `// Load multiple resources in parallel
forkJoin({
  users: this.api.getUsers(),
  products: this.api.getProducts(),
  orders: this.api.getOrders()
}).subscribe((result) => {
  console.log('All data loaded!');
  console.log('Users:', result.users.length);
  console.log('Products:', result.products.length);
  console.log('Orders:', result.orders.length);
});`;

  runExample() {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    
    const startTime = performance.now();
    const times = { users: 0, products: 0, orders: 0 };

    forkJoin({
      users: this.dummyApi.getUsers().pipe(
        tap(() => times.users = performance.now() - startTime)
      ),
      products: this.dummyApi.getProducts().pipe(
        tap(() => times.products = performance.now() - startTime)
      ),
      orders: this.dummyApi.getOrders().pipe(
        tap(() => times.orders = performance.now() - startTime)
      )
    }).pipe(
      tap(() => {
        const endTime = performance.now();
        this.executionTime.set(Math.round(endTime - startTime));
        this.individualTimes.set({
          users: Math.round(times.users),
          products: Math.round(times.products),
          orders: Math.round(times.orders)
        });
      }),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => {
        this.result.set({
          users: data.users.slice(0, 3),
          products: data.products.slice(0, 3),
          orders: data.orders.slice(0, 3),
          summary: {
            totalUsers: data.users.length,
            totalProducts: data.products.length,
            totalOrders: data.orders.length
          }
        });
      },
      error: (err) => this.error.set(err.message)
    });
  }

  clearResults() {
    this.result.set(null);
    this.error.set(null);
    this.executionTime.set(0);
    this.individualTimes.set({ users: 0, products: 0, orders: 0 });
  }
}

// Made with Bob