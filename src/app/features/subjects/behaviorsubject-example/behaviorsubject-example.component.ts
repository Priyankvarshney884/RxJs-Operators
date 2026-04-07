import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

interface Message {
  id: number;
  value: string;
  timestamp: Date;
  subscriberId: string;
}

@Component({
  selector: 'app-behaviorsubject-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './behaviorsubject-example.component.html',
  styleUrl: './behaviorsubject-example.component.scss',
})
export class BehaviorsubjectExampleComponent implements OnDestroy {
  // Code examples for display
  codeExample = `import { BehaviorSubject } from 'rxjs';

// Create a BehaviorSubject with initial value
const subject = new BehaviorSubject<number>(0);

// Subscribe - immediately receives current value (0)
subject.subscribe(value => console.log('Observer 1:', value));
// Output: Observer 1: 0

// Emit new values
subject.next(1);  // Observer 1: 1
subject.next(2);  // Observer 1: 2

// Late subscriber - immediately receives current value (2)
subject.subscribe(value => console.log('Observer 2:', value));
// Output: Observer 2: 2

subject.next(3);  // Both observers receive: 3

// Get current value synchronously
console.log('Current value:', subject.value);  // 3`;

  useCaseCurrentUser = `// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = 
    new BehaviorSubject<User | null>(null);
  
  currentUser$ = this.currentUserSubject.asObservable();
  
  login(user: User) {
    this.currentUserSubject.next(user);
  }
  
  logout() {
    this.currentUserSubject.next(null);
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}`;

  useCaseLoadingState = `// loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  
  show() {
    this.loadingSubject.next(true);
  }
  
  hide() {
    this.loadingSubject.next(false);
  }
  
  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}`;

  useCaseFormState = `// form-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface FormData {
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class FormStateService {
  private formSubject = new BehaviorSubject<FormData>({
    name: '',
    email: ''
  });
  
  formState$ = this.formSubject.asObservable();
  
  updateForm(data: Partial<FormData>) {
    const current = this.formSubject.value;
    this.formSubject.next({ ...current, ...data });
  }
  
  getFormData(): FormData {
    return this.formSubject.value;
  }
}`;

  messages = signal<Message[]>([]);
  isRunning = signal(false);
  subscriber1Active = signal(false);
  subscriber2Active = signal(false);
  subscriber3Active = signal(false);
  currentValue = signal<string>('Initial Value');
  nextValue = signal(1);

  private behaviorSubject = new BehaviorSubject<string>('Initial Value');
  private subscriptions: Subscription[] = [];
  private messageId = 0;

  ngOnDestroy(): void {
    this.stopExample();
    this.behaviorSubject.complete();
  }

  startExample(): void {
    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.messages.set([]);
    this.messageId = 0;
    this.nextValue.set(1);

    // Create a new BehaviorSubject with initial value
    this.behaviorSubject = new BehaviorSubject<string>('Initial Value');
    this.currentValue.set('Initial Value');

    this.addMessage('BehaviorSubject created with initial value', 'System');
  }

  stopExample(): void {
    this.isRunning.set(false);
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.subscriber1Active.set(false);
    this.subscriber2Active.set(false);
    this.subscriber3Active.set(false);
  }

  resetExample(): void {
    this.stopExample();
    this.messages.set([]);
    this.nextValue.set(1);
    this.currentValue.set('Initial Value');
    this.behaviorSubject.complete();
  }

  subscribe1(): void {
    if (this.subscriber1Active()) return;

    const sub = this.behaviorSubject.subscribe({
      next: (value) => this.addMessage(value, 'Subscriber 1'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 1'),
      complete: () => this.addMessage('Completed', 'Subscriber 1'),
    });

    this.subscriptions.push(sub);
    this.subscriber1Active.set(true);
    this.addMessage('Subscribed (received current value)', 'Subscriber 1');
  }

  subscribe2(): void {
    if (this.subscriber2Active()) return;

    const sub = this.behaviorSubject.subscribe({
      next: (value) => this.addMessage(value, 'Subscriber 2'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 2'),
      complete: () => this.addMessage('Completed', 'Subscriber 2'),
    });

    this.subscriptions.push(sub);
    this.subscriber2Active.set(true);
    this.addMessage('Subscribed (received current value)', 'Subscriber 2');
  }

  subscribe3(): void {
    if (this.subscriber3Active()) return;

    const sub = this.behaviorSubject.subscribe({
      next: (value) => this.addMessage(value, 'Subscriber 3'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 3'),
      complete: () => this.addMessage('Completed', 'Subscriber 3'),
    });

    this.subscriptions.push(sub);
    this.subscriber3Active.set(true);
    this.addMessage('Subscribed (received current value)', 'Subscriber 3');
  }

  emitValue(): void {
    if (!this.isRunning()) return;

    const value = `Value ${this.nextValue()}`;
    this.behaviorSubject.next(value);
    this.currentValue.set(value);
    this.addMessage(`Emitted: ${value}`, 'BehaviorSubject');
    this.nextValue.update((v) => v + 1);
  }

  emitError(): void {
    if (!this.isRunning()) return;

    this.behaviorSubject.error('Intentional error');
    this.addMessage('Error emitted', 'BehaviorSubject');
    this.isRunning.set(false);
  }

  complete(): void {
    if (!this.isRunning()) return;

    this.behaviorSubject.complete();
    this.addMessage('Completed', 'BehaviorSubject');
    this.isRunning.set(false);
  }

  getCurrentValue(): void {
    const value = this.behaviorSubject.value;
    this.addMessage(`Current value accessed: ${value}`, 'System');
  }

  private addMessage(value: string, subscriberId: string): void {
    const newMessage: Message = {
      id: this.messageId++,
      value,
      timestamp: new Date(),
      subscriberId,
    };

    this.messages.update((messages) => [...messages, newMessage]);
  }

  getSubscriberClass(subscriberId: string): string {
    if (subscriberId === 'System') return 'system';
    if (subscriberId === 'BehaviorSubject') return 'subject';
    if (subscriberId === 'Subscriber 1') return 'subscriber-1';
    if (subscriberId === 'Subscriber 2') return 'subscriber-2';
    if (subscriberId === 'Subscriber 3') return 'subscriber-3';
    return '';
  }
}

// Made with Bob
