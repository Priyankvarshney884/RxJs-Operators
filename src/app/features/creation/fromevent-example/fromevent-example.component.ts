import { Component, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { fromEvent, Subscription, throttleTime, map, debounceTime } from 'rxjs';

interface EventLog {
  time: number;
  type: string;
  data: string;
}

@Component({
  selector: 'app-fromevent-example',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './fromevent-example.component.html',
  styleUrls: ['./fromevent-example.component.scss']
})
export class FromEventExampleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('clickButton') clickButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('hoverArea') hoverArea!: ElementRef<HTMLDivElement>;
  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;
  
  eventLogs = signal<EventLog[]>([]);
  clickCount = signal(0);
  mousePosition = signal({ x: 0, y: 0 });
  inputValue = signal('');
  
  private subscriptions: Subscription[] = [];
  
  codeExample = `// Click events
const button = document.getElementById('myButton');
fromEvent(button, 'click').subscribe(event => {
  console.log('Button clicked!', event);
});

// Mouse move with throttle
const container = document.getElementById('container');
fromEvent(container, 'mousemove').pipe(
  throttleTime(100),
  map((event: MouseEvent) => ({
    x: event.clientX,
    y: event.clientY
  }))
).subscribe(position => {
  console.log('Mouse position:', position);
});

// Input events with debounce
const input = document.getElementById('search');
fromEvent(input, 'input').pipe(
  debounceTime(300),
  map((event: Event) => (event.target as HTMLInputElement).value)
).subscribe(value => {
  console.log('Search for:', value);
  // Perform search API call
});

// Keyboard events
fromEvent(document, 'keydown').pipe(
  map((event: KeyboardEvent) => event.key)
).subscribe(key => {
  console.log('Key pressed:', key);
});`;

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setupEventListeners() {
    const startTime = Date.now();
    
    // Click events
    const click$ = fromEvent(this.clickButton.nativeElement, 'click');
    this.subscriptions.push(
      click$.subscribe(() => {
        this.clickCount.update(count => count + 1);
        this.addLog(Date.now() - startTime, 'click', `Button clicked (${this.clickCount()})`);
      })
    );
    
    // Mouse move events (throttled)
    const mouseMove$ = fromEvent<MouseEvent>(this.hoverArea.nativeElement, 'mousemove').pipe(
      throttleTime(100),
      map(event => ({
        x: event.offsetX,
        y: event.offsetY
      }))
    );
    this.subscriptions.push(
      mouseMove$.subscribe(position => {
        this.mousePosition.set(position);
        this.addLog(Date.now() - startTime, 'mousemove', `Position: (${position.x}, ${position.y})`);
      })
    );
    
    // Input events (debounced)
    const input$ = fromEvent<Event>(this.inputField.nativeElement, 'input').pipe(
      debounceTime(300),
      map(event => (event.target as HTMLInputElement).value)
    );
    this.subscriptions.push(
      input$.subscribe(value => {
        this.inputValue.set(value);
        this.addLog(Date.now() - startTime, 'input', `Value: "${value}"`);
      })
    );
  }

  addLog(time: number, type: string, data: string) {
    this.eventLogs.update(logs => {
      const newLogs = [...logs, { time, type, data }];
      // Keep only last 10 logs
      return newLogs.slice(-10);
    });
  }

  clearLogs() {
    this.eventLogs.set([]);
    this.clickCount.set(0);
    this.mousePosition.set({ x: 0, y: 0 });
    this.inputValue.set('');
    if (this.inputField) {
      this.inputField.nativeElement.value = '';
    }
  }
}

// Made with Bob
