import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';

interface Message {
  id: number;
  value: string;
  timestamp: Date;
  subscriberId: string;
}

@Component({
  selector: 'app-replaysubject-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './replaysubject-example.component.html',
  styleUrl: './replaysubject-example.component.scss',
})
export class ReplaysubjectExampleComponent implements OnDestroy {
  // Code examples for display
  codeExample = `import { ReplaySubject } from 'rxjs';

// Create a ReplaySubject that replays last 3 values
const subject = new ReplaySubject<number>(3);

// Emit values before any subscriptions
subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

// Late subscriber receives last 3 values (2, 3, 4)
subject.subscribe(value => console.log('Observer 1:', value));
// Output: Observer 1: 2
//         Observer 1: 3
//         Observer 1: 4

subject.next(5);  // Observer 1: 5

// Another late subscriber also receives last 3 values (3, 4, 5)
subject.subscribe(value => console.log('Observer 2:', value));
// Output: Observer 2: 3
//         Observer 2: 4
//         Observer 2: 5`;

  codeExampleWithTime = `import { ReplaySubject } from 'rxjs';

// ReplaySubject with buffer size 100 and 500ms window
const subject = new ReplaySubject<number>(100, 500);

subject.next(1);
subject.next(2);

setTimeout(() => {
  subject.next(3);
  
  // Subscriber only gets values from last 500ms
  subject.subscribe(value => console.log('Observer:', value));
  // Output: Observer: 3
}, 600);`;

  useCaseActivityLog = `// activity-log.service.ts
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

interface Activity {
  action: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  // Keep last 10 activities
  private activitySubject = new ReplaySubject<Activity>(10);
  
  activities$ = this.activitySubject.asObservable();
  
  logActivity(action: string) {
    this.activitySubject.next({
      action,
      timestamp: new Date()
    });
  }
}`;

  useCaseNotifications = `// notification.service.ts
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Keep last 5 notifications for 30 seconds
  private notificationSubject = 
    new ReplaySubject<string>(5, 30000);
  
  notifications$ = this.notificationSubject.asObservable();
  
  notify(message: string) {
    this.notificationSubject.next(message);
  }
}`;

  useCaseChatHistory = `// chat.service.ts
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

interface Message {
  user: string;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  // Keep last 50 messages
  private messageSubject = new ReplaySubject<Message>(50);
  
  messages$ = this.messageSubject.asObservable();
  
  sendMessage(message: Message) {
    this.messageSubject.next(message);
  }
}`;

  messages = signal<Message[]>([]);
  isRunning = signal(false);
  subscriber1Active = signal(false);
  subscriber2Active = signal(false);
  subscriber3Active = signal(false);
  bufferSize = signal(3);
  replayedValues = signal<string[]>([]);
  nextValue = signal(1);

  private replaySubject = new ReplaySubject<string>(3);
  private subscriptions: Subscription[] = [];
  private messageId = 0;
  private emittedValues: string[] = [];

  ngOnDestroy(): void {
    this.stopExample();
    this.replaySubject.complete();
  }

  startExample(): void {
    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.messages.set([]);
    this.messageId = 0;
    this.nextValue.set(1);
    this.emittedValues = [];
    this.replayedValues.set([]);

    // Create a new ReplaySubject with buffer size
    this.replaySubject = new ReplaySubject<string>(this.bufferSize());

    this.addMessage(`ReplaySubject created (buffer size: ${this.bufferSize()})`, 'System');
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
    this.emittedValues = [];
    this.replayedValues.set([]);
    this.replaySubject.complete();
  }

  changeBufferSize(size: number): void {
    if (this.isRunning()) return;
    this.bufferSize.set(size);
  }

  subscribe1(): void {
    if (this.subscriber1Active()) return;

    this.addMessage('Subscribing...', 'Subscriber 1');
    
    const sub = this.replaySubject.subscribe({
      next: (value) => this.addMessage(value, 'Subscriber 1'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 1'),
      complete: () => this.addMessage('Completed', 'Subscriber 1'),
    });

    this.subscriptions.push(sub);
    this.subscriber1Active.set(true);
    
    if (this.emittedValues.length > 0) {
      const replayed = this.emittedValues.slice(-this.bufferSize());
      this.addMessage(`Replayed ${replayed.length} value(s)`, 'Subscriber 1');
    }
  }

  subscribe2(): void {
    if (this.subscriber2Active()) return;

    this.addMessage('Subscribing...', 'Subscriber 2');
    
    const sub = this.replaySubject.subscribe({
      next: (value) => this.addMessage(value, 'Subscriber 2'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 2'),
      complete: () => this.addMessage('Completed', 'Subscriber 2'),
    });

    this.subscriptions.push(sub);
    this.subscriber2Active.set(true);
    
    if (this.emittedValues.length > 0) {
      const replayed = this.emittedValues.slice(-this.bufferSize());
      this.addMessage(`Replayed ${replayed.length} value(s)`, 'Subscriber 2');
    }
  }

  subscribe3(): void {
    if (this.subscriber3Active()) return;

    this.addMessage('Subscribing...', 'Subscriber 3');
    
    const sub = this.replaySubject.subscribe({
      next: (value) => this.addMessage(value, 'Subscriber 3'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 3'),
      complete: () => this.addMessage('Completed', 'Subscriber 3'),
    });

    this.subscriptions.push(sub);
    this.subscriber3Active.set(true);
    
    if (this.emittedValues.length > 0) {
      const replayed = this.emittedValues.slice(-this.bufferSize());
      this.addMessage(`Replayed ${replayed.length} value(s)`, 'Subscriber 3');
    }
  }

  emitValue(): void {
    if (!this.isRunning()) return;

    const value = `Value ${this.nextValue()}`;
    this.replaySubject.next(value);
    this.emittedValues.push(value);
    this.updateReplayedValues();
    this.addMessage(`Emitted: ${value}`, 'ReplaySubject');
    this.nextValue.update((v) => v + 1);
  }

  emitError(): void {
    if (!this.isRunning()) return;

    this.replaySubject.error('Intentional error');
    this.addMessage('Error emitted', 'ReplaySubject');
    this.isRunning.set(false);
  }

  complete(): void {
    if (!this.isRunning()) return;

    this.replaySubject.complete();
    this.addMessage('Completed', 'ReplaySubject');
    this.isRunning.set(false);
  }

  private updateReplayedValues(): void {
    const replayed = this.emittedValues.slice(-this.bufferSize());
    this.replayedValues.set(replayed);
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
    if (subscriberId === 'ReplaySubject') return 'subject';
    if (subscriberId === 'Subscriber 1') return 'subscriber-1';
    if (subscriberId === 'Subscriber 2') return 'subscriber-2';
    if (subscriberId === 'Subscriber 3') return 'subscriber-3';
    return '';
  }
}

// Made with Bob
