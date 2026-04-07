import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AsyncSubject, Subscription } from 'rxjs';

interface Message {
  id: number;
  value: string;
  timestamp: Date;
  subscriberId: string;
}

@Component({
  selector: 'app-asyncsubject-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './asyncsubject-example.component.html',
  styleUrl: './asyncsubject-example.component.scss',
})
export class AsyncsubjectExampleComponent implements OnDestroy {
  // Code examples for display
  codeExample = `import { AsyncSubject } from 'rxjs';

// Create an AsyncSubject
const subject = new AsyncSubject<number>();

// Subscribe before any emissions
subject.subscribe(value => console.log('Observer 1:', value));

// Emit multiple values
subject.next(1);  // Nothing emitted yet
subject.next(2);  // Nothing emitted yet
subject.next(3);  // Nothing emitted yet

// Late subscriber
subject.subscribe(value => console.log('Observer 2:', value));

subject.next(4);  // Still nothing emitted

// Complete - now both observers receive the last value (4)
subject.complete();
// Output: Observer 1: 4
//         Observer 2: 4

// Even later subscriber still gets the last value
subject.subscribe(value => console.log('Observer 3:', value));
// Output: Observer 3: 4`;

  useCaseApiCall = `// data.service.ts
import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataService {
  private resultSubject = new AsyncSubject<any>();
  
  constructor(private http: HttpClient) {}
  
  fetchData() {
    this.http.get('/api/data').subscribe({
      next: (data) => this.resultSubject.next(data),
      error: (err) => this.resultSubject.error(err),
      complete: () => this.resultSubject.complete()
    });
    
    return this.resultSubject.asObservable();
  }
}`;

  useCaseComputation = `// calculation.service.ts
import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CalculationService {
  private resultSubject = new AsyncSubject<number>();
  
  performLongCalculation() {
    // Simulate long-running calculation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
    
    this.resultSubject.next(result);
    this.resultSubject.complete();
    
    return this.resultSubject.asObservable();
  }
}`;

  useCaseFinalResult = `// task.service.ts
import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';

interface TaskResult {
  success: boolean;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private taskSubject = new AsyncSubject<TaskResult>();
  
  executeTask() {
    // Perform multiple steps
    this.step1();
    this.step2();
    this.step3();
    
    // Only emit final result
    const finalResult = { success: true, data: {} };
    this.taskSubject.next(finalResult);
    this.taskSubject.complete();
    
    return this.taskSubject.asObservable();
  }
}`;

  messages = signal<Message[]>([]);
  isRunning = signal(false);
  isCompleted = signal(false);
  subscriber1Active = signal(false);
  subscriber2Active = signal(false);
  subscriber3Active = signal(false);
  emittedValues = signal<string[]>([]);
  lastValue = signal<string | null>(null);
  nextValue = signal(1);

  private asyncSubject = new AsyncSubject<string>();
  private subscriptions: Subscription[] = [];
  private messageId = 0;

  ngOnDestroy(): void {
    this.stopExample();
    if (!this.isCompleted()) {
      this.asyncSubject.complete();
    }
  }

  startExample(): void {
    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.isCompleted.set(false);
    this.messages.set([]);
    this.messageId = 0;
    this.nextValue.set(1);
    this.emittedValues.set([]);
    this.lastValue.set(null);

    // Create a new AsyncSubject
    this.asyncSubject = new AsyncSubject<string>();

    this.addMessage('AsyncSubject created', 'System');
    this.addMessage('⚠️ Values will only be emitted after completion', 'System');
  }

  stopExample(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.subscriber1Active.set(false);
    this.subscriber2Active.set(false);
    this.subscriber3Active.set(false);
  }

  resetExample(): void {
    this.stopExample();
    this.isRunning.set(false);
    this.isCompleted.set(false);
    this.messages.set([]);
    this.nextValue.set(1);
    this.emittedValues.set([]);
    this.lastValue.set(null);
    if (!this.isCompleted()) {
      this.asyncSubject.complete();
    }
  }

  subscribe1(): void {
    if (this.subscriber1Active()) return;

    const sub = this.asyncSubject.subscribe({
      next: (value) => this.addMessage(`Received: ${value}`, 'Subscriber 1'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 1'),
      complete: () => this.addMessage('Completed', 'Subscriber 1'),
    });

    this.subscriptions.push(sub);
    this.subscriber1Active.set(true);
    this.addMessage('Subscribed (waiting for completion)', 'Subscriber 1');
  }

  subscribe2(): void {
    if (this.subscriber2Active()) return;

    const sub = this.asyncSubject.subscribe({
      next: (value) => this.addMessage(`Received: ${value}`, 'Subscriber 2'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 2'),
      complete: () => this.addMessage('Completed', 'Subscriber 2'),
    });

    this.subscriptions.push(sub);
    this.subscriber2Active.set(true);
    
    if (this.isCompleted()) {
      this.addMessage('Subscribed (immediately received last value)', 'Subscriber 2');
    } else {
      this.addMessage('Subscribed (waiting for completion)', 'Subscriber 2');
    }
  }

  subscribe3(): void {
    if (this.subscriber3Active()) return;

    const sub = this.asyncSubject.subscribe({
      next: (value) => this.addMessage(`Received: ${value}`, 'Subscriber 3'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 3'),
      complete: () => this.addMessage('Completed', 'Subscriber 3'),
    });

    this.subscriptions.push(sub);
    this.subscriber3Active.set(true);
    
    if (this.isCompleted()) {
      this.addMessage('Subscribed (immediately received last value)', 'Subscriber 3');
    } else {
      this.addMessage('Subscribed (waiting for completion)', 'Subscriber 3');
    }
  }

  emitValue(): void {
    if (!this.isRunning() || this.isCompleted()) return;

    const value = `Value ${this.nextValue()}`;
    this.asyncSubject.next(value);
    this.lastValue.set(value);
    this.emittedValues.update((values) => [...values, value]);
    this.addMessage(`Emitted: ${value} (not sent to subscribers yet)`, 'AsyncSubject');
    this.nextValue.update((v) => v + 1);
  }

  emitError(): void {
    if (!this.isRunning() || this.isCompleted()) return;

    this.asyncSubject.error('Intentional error');
    this.addMessage('Error emitted (no value sent to subscribers)', 'AsyncSubject');
    this.isRunning.set(false);
    this.isCompleted.set(true);
  }

  complete(): void {
    if (!this.isRunning() || this.isCompleted()) return;

    this.asyncSubject.complete();
    this.addMessage('✅ Completed - Last value sent to all subscribers!', 'AsyncSubject');
    this.isRunning.set(false);
    this.isCompleted.set(true);
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
    if (subscriberId === 'AsyncSubject') return 'subject';
    if (subscriberId === 'Subscriber 1') return 'subscriber-1';
    if (subscriberId === 'Subscriber 2') return 'subscriber-2';
    if (subscriberId === 'Subscriber 3') return 'subscriber-3';
    return '';
  }
}

// Made with Bob
