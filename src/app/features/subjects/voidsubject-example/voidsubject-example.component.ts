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
  selector: 'app-voidsubject-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './voidsubject-example.component.html',
  styleUrl: './voidsubject-example.component.scss',
})
export class VoidsubjectExampleComponent implements OnDestroy {
  // Code examples for display
  codeExample = `import { Subject } from 'rxjs';

// Create a Subject<void> - no value, just notifications
const voidSubject = new Subject<void>();

// Subscribe to notifications
voidSubject.subscribe(() => {
  console.log('Event occurred!');
});

// Emit notifications (no value needed)
voidSubject.next();  // Event occurred!
voidSubject.next();  // Event occurred!
voidSubject.next();  // Event occurred!

// Complete
voidSubject.complete();`;

  useCaseButtonClick = `// button-click.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ButtonClickService {
  private clickSubject = new Subject<void>();
  
  clicks$ = this.clickSubject.asObservable();
  
  notifyClick() {
    this.clickSubject.next();
  }
}

// Usage in component
export class MyComponent {
  constructor(private buttonService: ButtonClickService) {
    this.buttonService.clicks$.subscribe(() => {
      console.log('Button was clicked!');
    });
  }
  
  onButtonClick() {
    this.buttonService.notifyClick();
  }
}`;

  useCaseRefresh = `// refresh.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshService {
  private refreshSubject = new Subject<void>();
  
  refresh$ = this.refreshSubject.asObservable();
  
  triggerRefresh() {
    this.refreshSubject.next();
  }
}

// Usage in component
export class DataComponent implements OnInit {
  constructor(
    private refreshService: RefreshService,
    private dataService: DataService
  ) {}
  
  ngOnInit() {
    // Refresh data when triggered
    this.refreshService.refresh$.subscribe(() => {
      this.loadData();
    });
  }
  
  loadData() {
    this.dataService.getData().subscribe(data => {
      // Update UI
    });
  }
}`;

  useCaseModalClose = `// modal.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private closeSubject = new Subject<void>();
  
  onClose$ = this.closeSubject.asObservable();
  
  close() {
    this.closeSubject.next();
  }
}

// Usage in modal component
export class ModalComponent {
  constructor(private modalService: ModalService) {
    this.modalService.onClose$.subscribe(() => {
      this.hideModal();
    });
  }
  
  hideModal() {
    // Close modal logic
  }
}`;

  messages = signal<Message[]>([]);
  isRunning = signal(false);
  subscriber1Active = signal(false);
  subscriber2Active = signal(false);
  subscriber3Active = signal(false);
  notificationCount = signal(0);

  private voidSubject = new Subject<void>();
  private subscriptions: Subscription[] = [];
  private messageId = 0;

  ngOnDestroy(): void {
    this.stopExample();
    this.voidSubject.complete();
  }

  startExample(): void {
    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.messages.set([]);
    this.messageId = 0;
    this.notificationCount.set(0);

    // Create a new Subject<void>
    this.voidSubject = new Subject<void>();

    this.addMessage('Subject<void> created', 'System');
    this.addMessage('💡 This subject emits notifications without values', 'System');
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
    this.notificationCount.set(0);
    this.voidSubject.complete();
  }

  subscribe1(): void {
    if (this.subscriber1Active()) return;

    const sub = this.voidSubject.subscribe({
      next: () => this.addMessage('Notification received!', 'Subscriber 1'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 1'),
      complete: () => this.addMessage('Completed', 'Subscriber 1'),
    });

    this.subscriptions.push(sub);
    this.subscriber1Active.set(true);
    this.addMessage('Subscribed', 'Subscriber 1');
  }

  subscribe2(): void {
    if (this.subscriber2Active()) return;

    const sub = this.voidSubject.subscribe({
      next: () => this.addMessage('Notification received!', 'Subscriber 2'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 2'),
      complete: () => this.addMessage('Completed', 'Subscriber 2'),
    });

    this.subscriptions.push(sub);
    this.subscriber2Active.set(true);
    this.addMessage('Subscribed', 'Subscriber 2');
  }

  subscribe3(): void {
    if (this.subscriber3Active()) return;

    const sub = this.voidSubject.subscribe({
      next: () => this.addMessage('Notification received!', 'Subscriber 3'),
      error: (err) => this.addMessage(`Error: ${err}`, 'Subscriber 3'),
      complete: () => this.addMessage('Completed', 'Subscriber 3'),
    });

    this.subscriptions.push(sub);
    this.subscriber3Active.set(true);
    this.addMessage('Subscribed', 'Subscriber 3');
  }

  emitNotification(): void {
    if (!this.isRunning()) return;

    this.voidSubject.next();
    this.notificationCount.update((count) => count + 1);
    this.addMessage(`Notification #${this.notificationCount()} emitted`, 'VoidSubject');
  }

  emitError(): void {
    if (!this.isRunning()) return;

    this.voidSubject.error('Intentional error');
    this.addMessage('Error emitted', 'VoidSubject');
    this.isRunning.set(false);
  }

  complete(): void {
    if (!this.isRunning()) return;

    this.voidSubject.complete();
    this.addMessage('Completed', 'VoidSubject');
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
    if (subscriberId === 'VoidSubject') return 'subject';
    if (subscriberId === 'Subscriber 1') return 'subscriber-1';
    if (subscriberId === 'Subscriber 2') return 'subscriber-2';
    if (subscriberId === 'Subscriber 3') return 'subscriber-3';
    return '';
  }
}

// Made with Bob
