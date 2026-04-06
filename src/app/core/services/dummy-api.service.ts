import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, Product, Order, OrderStatus } from '../models/operator-example.model';

@Injectable({
  providedIn: 'root'
})
export class DummyApiService {
  private mockUsers: User[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', age: 30, role: 'admin', isActive: true },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', age: 25, role: 'user', isActive: false },
    { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', age: 35, role: 'user', isActive: true },
    { id: 4, firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com', age: 28, role: 'moderator', isActive: true },
    { id: 5, firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', age: 32, role: 'user', isActive: true },
    { id: 6, firstName: 'Diana', lastName: 'Davis', email: 'diana.davis@example.com', age: 27, role: 'user', isActive: false },
    { id: 7, firstName: 'Eve', lastName: 'Miller', email: 'eve.miller@example.com', age: 29, role: 'admin', isActive: true },
    { id: 8, firstName: 'Frank', lastName: 'Wilson', email: 'frank.wilson@example.com', age: 31, role: 'user', isActive: true }
  ];

  private mockProducts: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', inStock: true, description: 'High-performance laptop' },
    { id: 2, name: 'Mouse', price: 29.99, category: 'Electronics', inStock: true, description: 'Wireless mouse' },
    { id: 3, name: 'Keyboard', price: 79.99, category: 'Electronics', inStock: false, description: 'Mechanical keyboard' },
    { id: 4, name: 'Monitor', price: 299.99, category: 'Electronics', inStock: true, description: '27-inch 4K monitor' },
    { id: 5, name: 'Desk Chair', price: 199.99, category: 'Furniture', inStock: true, description: 'Ergonomic office chair' },
    { id: 6, name: 'Desk Lamp', price: 49.99, category: 'Furniture', inStock: true, description: 'LED desk lamp' },
    { id: 7, name: 'Notebook', price: 9.99, category: 'Stationery', inStock: true, description: 'A4 notebook' },
    { id: 8, name: 'Pen Set', price: 14.99, category: 'Stationery', inStock: false, description: 'Premium pen set' }
  ];

  private mockOrders: Order[] = [
    { id: 1, userId: 1, productId: 1, quantity: 1, total: 999.99, status: OrderStatus.COMPLETED, createdAt: new Date('2024-01-15') },
    { id: 2, userId: 2, productId: 2, quantity: 2, total: 59.98, status: OrderStatus.COMPLETED, createdAt: new Date('2024-01-16') },
    { id: 3, userId: 3, productId: 4, quantity: 1, total: 299.99, status: OrderStatus.PROCESSING, createdAt: new Date('2024-01-17') },
    { id: 4, userId: 1, productId: 5, quantity: 1, total: 199.99, status: OrderStatus.PENDING, createdAt: new Date('2024-01-18') },
    { id: 5, userId: 4, productId: 7, quantity: 3, total: 29.97, status: OrderStatus.COMPLETED, createdAt: new Date('2024-01-19') }
  ];

  constructor() {}

  /**
   * Get all users with simulated network delay
   */
  getUsers(delayMs: number = 500): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(delayMs));
  }

  /**
   * Get a single user by ID
   */
  getUser(id: number, delayMs: number = 300): Observable<User> {
    const user = this.mockUsers.find(u => u.id === id);
    if (user) {
      return of(user).pipe(delay(delayMs));
    }
    return throwError(() => new Error(`User with id ${id} not found`));
  }

  /**
   * Get all products
   */
  getProducts(delayMs: number = 500): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(delayMs));
  }

  /**
   * Get a single product by ID
   */
  getProduct(id: number, delayMs: number = 300): Observable<Product> {
    const product = this.mockProducts.find(p => p.id === id);
    if (product) {
      return of(product).pipe(delay(delayMs));
    }
    return throwError(() => new Error(`Product with id ${id} not found`));
  }

  /**
   * Search products by name or category
   */
  searchProducts(query: string, delayMs: number = 400): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    const results = this.mockProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery)
    );
    return of(results).pipe(delay(delayMs));
  }

  /**
   * Filter products by price range
   */
  getProductsByPriceRange(min: number, max: number, delayMs: number = 400): Observable<Product[]> {
    const results = this.mockProducts.filter(p => p.price >= min && p.price <= max);
    return of(results).pipe(delay(delayMs));
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string, delayMs: number = 400): Observable<Product[]> {
    const results = this.mockProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    return of(results).pipe(delay(delayMs));
  }

  /**
   * Get all orders
   */
  getOrders(delayMs: number = 500): Observable<Order[]> {
    return of(this.mockOrders).pipe(delay(delayMs));
  }

  /**
   * Get orders by user ID
   */
  getOrdersByUser(userId: number, delayMs: number = 400): Observable<Order[]> {
    const orders = this.mockOrders.filter(o => o.userId === userId);
    return of(orders).pipe(delay(delayMs));
  }

  /**
   * Get order by ID
   */
  getOrder(id: number, delayMs: number = 300): Observable<Order> {
    const order = this.mockOrders.find(o => o.id === id);
    if (order) {
      return of(order).pipe(delay(delayMs));
    }
    return throwError(() => new Error(`Order with id ${id} not found`));
  }

  /**
   * Simulate an error for testing error handling operators
   */
  simulateError(message: string = 'Simulated API Error', delayMs: number = 300): Observable<never> {
    return throwError(() => new Error(message)).pipe(delay(delayMs));
  }

  /**
   * Simulate a slow API call
   */
  slowApiCall<T>(data: T, delayMs: number = 3000): Observable<T> {
    return of(data).pipe(delay(delayMs));
  }

  /**
   * Get users with pagination
   */
  getUsersPaginated(page: number, pageSize: number, delayMs: number = 400): Observable<User[]> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = this.mockUsers.slice(start, end);
    return of(paginatedUsers).pipe(delay(delayMs));
  }

  /**
   * Search users by name or email
   */
  searchUsers(query: string, delayMs: number = 400): Observable<User[]> {
    const lowerQuery = query.toLowerCase();
    const results = this.mockUsers.filter(u => 
      u.firstName.toLowerCase().includes(lowerQuery) || 
      u.lastName.toLowerCase().includes(lowerQuery) ||
      u.email.toLowerCase().includes(lowerQuery)
    );
    return of(results).pipe(delay(delayMs));
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: string, delayMs: number = 400): Observable<User[]> {
    const results = this.mockUsers.filter(u => u.role === role);
    return of(results).pipe(delay(delayMs));
  }

  /**
   * Simulate creating a new user
   */
  createUser(user: Omit<User, 'id'>, delayMs: number = 600): Observable<User> {
    const newUser: User = {
      ...user,
      id: this.mockUsers.length + 1
    };
    return of(newUser).pipe(delay(delayMs));
  }

  /**
   * Simulate updating a user
   */
  updateUser(id: number, updates: Partial<User>, delayMs: number = 600): Observable<User> {
    const user = this.mockUsers.find(u => u.id === id);
    if (user) {
      const updatedUser = { ...user, ...updates };
      return of(updatedUser).pipe(delay(delayMs));
    }
    return throwError(() => new Error(`User with id ${id} not found`));
  }

  /**
   * Simulate deleting a user
   */
  deleteUser(id: number, delayMs: number = 500): Observable<{ success: boolean; message: string }> {
    const userExists = this.mockUsers.some(u => u.id === id);
    if (userExists) {
      return of({ success: true, message: `User ${id} deleted successfully` }).pipe(delay(delayMs));
    }
    return throwError(() => new Error(`User with id ${id} not found`));
  }

  /**
   * Get random user (useful for testing)
   */
  getRandomUser(delayMs: number = 300): Observable<User> {
    const randomIndex = Math.floor(Math.random() * this.mockUsers.length);
    return of(this.mockUsers[randomIndex]).pipe(delay(delayMs));
  }

  /**
   * Get multiple users by IDs
   */
  getUsersByIds(ids: number[], delayMs: number = 400): Observable<User[]> {
    const users = this.mockUsers.filter(u => ids.includes(u.id));
    return of(users).pipe(delay(delayMs));
  }
}

// Made with Bob
