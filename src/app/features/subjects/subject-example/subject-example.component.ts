import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

interface Message {
  id: number;
  value: string;
  timestamp: Date;
  subscriberId: string;
}

@Component({
  selector: 'app-subject-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './subject-example.component.html',
  styleUrl: './subject-example.component.scss',
})
export class SubjectExampleComponent implements OnDestroy {
  // Code examples for display
  codeExample = `import { Subject } from 'rxjs';

// Create a Subject
const subject = new Subject<number>();

// Subscribe multiple observers
subject.subscribe(value => console.log('Observer 1:', value));
subject.subscribe(value => console.log('Observer 2:', value));

// Emit values
subject.next(1);  // Both observers receive: 1
subject.next(2);  // Both observers receive: 2

// Late subscriber
subject.subscribe(value => console.log('Observer 3:', value));

subject.next(3);  // All three observers receive: 3

// Complete the subject
subject.complete();`;

  useCaseEventBus = `// event-bus.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private eventSubject = new Subject<any>();
  
  emit(event: any) {
    this.eventSubject.next(event);
  }
  
  on() {
    return this.eventSubject.asObservable();
  }
}`;

  useCaseStateManagement = `// state.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StateService {
  private stateSubject = new Subject<State>();
  
  updateState(newState: State) {
    this.stateSubject.next(newState);
  }
  
  getState() {
    return this.stateSubject.asObservable();
  }
}`;

  useCaseWebSocket = `// websocket.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private messageSubject = new Subject<any>();
  
  connect(url: string) {
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };
  }
  
  getMessages() {
    return this.messageSubject.asObservable();
  }
}`;

  messages = signal<Message[]>([]);
  isRunning = signal(false);
  subscriber1Active = signal(false);
  subscriber2Active = signal(false);
  subscriber3Active = signal(false);
  nextValue = signal(1);

  private subject = new Subject<string>();
  private subscriptions: Subscription[] = [];
  private messageId = 0;

  ngOnDestroy(): void {
    this.stopExample();
    this.subject.complete();
  }

  startExample(): void {
    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.messages.set([]);
    this.messageId = 0;
    this.nextValue.set(1);

    // Create a new subject for fresh start
    this.subject = new Subject<string>();

    this.addMessage('Subject created', 'System');
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
    this.subject.complete();
  }

  subscribe1(): void {
    if (this.subscriber1Active()) return;

    const sub = this.subject.subscribe({
      next: (value) => this.addMessage(value, 'Subscriber 1'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 1'),
      complete: () => this.addMessage('Completed', 'Subscriber 1'),
    });

    this.subscriptions.push(sub);
    this.subscriber1Active.set(true);
    this.addMessage('Subscribed', 'Subscriber 1');
  }

  subscribe2(): void {
    if (this.subscriber2Active()) return;

    const sub = this.subject.subscribe({
      next: (value) => this.addMessage(value, 'Subscriber 2'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 2'),
      complete: () => this.addMessage('Completed', 'Subscriber 2'),
    });

    this.subscriptions.push(sub);
    this.subscriber2Active.set(true);
    this.addMessage('Subscribed', 'Subscriber 2');
  }

  subscribe3(): void {
    if (this.subscriber3Active()) return;

    const sub = this.subject.subscribe({
      next: (value) => this.addMessage(value, 'Subscriber 3'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 3'),
      complete: () => this.addMessage('Completed', 'Subscriber 3'),
    });

    this.subscriptions.push(sub);
    this.subscriber3Active.set(true);
    this.addMessage('Subscribed', 'Subscriber 3');
  }

  emitValue(): void {
    if (!this.isRunning()) return;

    const value = `Value ${this.nextValue()}`;
    this.subject.next(value);
    this.addMessage(`Emitted: ${value}`, 'Subject');
    this.nextValue.update((v) => v + 1);
  }

  emitError(): void {
    if (!this.isRunning()) return;

    this.subject.error('Intentional error');
    this.addMessage('Error emitted', 'Subject');
    this.isRunning.set(false);
  }

  complete(): void {
    if (!this.isRunning()) return;

    this.subject.complete();
    this.addMessage('Completed', 'Subject');
    this.isRunning.set(false);
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
    if (subscriberId === 'Subject') return 'subject';
    if (subscriberId === 'Subscriber 1') return 'subscriber-1';
    if (subscriberId === 'Subscriber 2') return 'subscriber-2';
    if (subscriberId === 'Subscriber 3') return 'subscriber-3';
    return '';
  }
}

// Made with Bob
