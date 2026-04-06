# RxJS Operators Complete Guide

## 📚 Table of Contents

1. [Transformation Operators](#transformation-operators)
2. [Filtering Operators](#filtering-operators)
3. [Combination Operators](#combination-operators)
4. [Error Handling Operators](#error-handling-operators)
5. [Utility Operators](#utility-operators)
6. [Creation Operators](#creation-operators)

---

## Transformation Operators

### 1. map
**Purpose**: Transform each emitted value using a projection function

**When to Use**:
- Convert data format (e.g., API response to UI model)
- Extract specific properties
- Perform calculations on values

**Real-World Example**:
```typescript
// Convert API user data to display format
this.http.get<User[]>('/api/users').pipe(
  map(users => users.map(user => ({
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email
  })))
)
```

**Why Use It**: Simple, synchronous transformations without side effects

---

### 2. switchMap
**Purpose**: Cancel previous inner observable and switch to new one

**When to Use**:
- Search/autocomplete (cancel previous search)
- Navigation (cancel previous route data load)
- Form submissions (prevent duplicate submissions)

**Real-World Example**:
```typescript
// Search autocomplete - cancel previous search when user types
searchInput$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query => this.http.get(`/api/search?q=${query}`))
)
```

**Why Use It**: Prevents memory leaks and race conditions by canceling outdated requests

---

### 3. mergeMap (flatMap)
**Purpose**: Process all inner observables in parallel

**When to Use**:
- Fetch details for multiple items simultaneously
- Process independent operations concurrently
- When order doesn't matter

**Real-World Example**:
```typescript
// Fetch details for each user ID in parallel
userIds$.pipe(
  mergeMap(id => this.http.get(`/api/users/${id}`))
)
```

**Why Use It**: Maximum throughput when operations are independent

---

### 4. concatMap
**Purpose**: Process inner observables sequentially (one at a time)

**When to Use**:
- Order matters (e.g., sequential API calls)
- Rate limiting
- Dependent operations

**Real-World Example**:
```typescript
// Process orders one by one in sequence
orders$.pipe(
  concatMap(order => this.http.post('/api/process', order))
)
```

**Why Use It**: Guarantees order and prevents overwhelming the server

---

### 5. exhaustMap
**Purpose**: Ignore new values while current inner observable is active

**When to Use**:
- Prevent double-click submissions
- Login/authentication flows
- One-at-a-time operations

**Real-World Example**:
```typescript
// Prevent multiple login attempts
loginButton$.pipe(
  exhaustMap(() => this.http.post('/api/login', credentials))
)
```

**Why Use It**: Prevents duplicate operations and race conditions

---

## Filtering Operators

### 1. filter
**Purpose**: Emit only values that pass a predicate test

**When to Use**:
- Filter data based on conditions
- Remove null/undefined values
- Conditional processing

**Real-World Example**:
```typescript
// Only process valid products
products$.pipe(
  filter(product => product.price > 0 && product.inStock)
)
```

**Why Use It**: Clean, declarative data filtering

---

### 2. debounceTime
**Purpose**: Wait for specified time of silence before emitting

**When to Use**:
- Search input (wait for user to stop typing)
- Window resize events
- Scroll events

**Real-World Example**:
```typescript
// Wait 300ms after user stops typing
searchInput$.pipe(
  debounceTime(300),
  switchMap(query => this.searchService.search(query))
)
```

**Why Use It**: Reduces API calls and improves performance

---

### 3. distinctUntilChanged
**Purpose**: Emit only when value changes from previous

**When to Use**:
- Prevent duplicate API calls
- Form value changes
- State management

**Real-World Example**:
```typescript
// Only fetch when filter actually changes
filterControl.valueChanges.pipe(
  distinctUntilChanged(),
  switchMap(filter => this.http.get(`/api/data?filter=${filter}`))
)
```

**Why Use It**: Eliminates redundant operations

---

### 4. take
**Purpose**: Take only the first N emissions

**When to Use**:
- Get first page of results
- One-time operations
- Limit results

**Real-World Example**:
```typescript
// Get only first 5 users
users$.pipe(
  take(5)
)
```

**Why Use It**: Automatic unsubscription after N values

---

### 5. skip
**Purpose**: Skip the first N emissions

**When to Use**:
- Skip initial/default values
- Pagination (skip to page N)
- Ignore loading states

**Real-World Example**:
```typescript
// Skip initial empty state
data$.pipe(
  skip(1), // Skip first emission
  // Process actual data
)
```

**Why Use It**: Ignore unwanted initial values

---

### 6. first
**Purpose**: Emit only the first value (or first matching predicate)

**When to Use**:
- Get single item
- Find first match
- One-time fetch

**Real-World Example**:
```typescript
// Get first admin user
users$.pipe(
  first(user => user.role === 'admin')
)
```

**Why Use It**: Automatic completion after first match

---

### 7. last
**Purpose**: Emit only the last value before completion

**When to Use**:
- Get final result
- Aggregate operations
- End-of-stream processing

**Real-World Example**:
```typescript
// Get final calculation result
calculations$.pipe(
  last()
)
```

**Why Use It**: Wait for all data before processing

---

## Combination Operators

### 1. forkJoin
**Purpose**: Wait for all observables to complete, emit last values

**When to Use**:
- Load multiple independent resources
- Dashboard initialization
- Parallel API calls that must all succeed

**Real-World Example**:
```typescript
// Load dashboard data
forkJoin({
  users: this.http.get('/api/users'),
  products: this.http.get('/api/products'),
  orders: this.http.get('/api/orders')
}).subscribe(({ users, products, orders }) => {
  // All data loaded
})
```

**Why Use It**: Efficient parallel loading with single callback

---

### 2. combineLatest
**Purpose**: Emit when any observable emits, combining latest values

**When to Use**:
- Multiple filters/search criteria
- Form validation with multiple fields
- Real-time updates from multiple sources

**Real-World Example**:
```typescript
// Combine search, filter, and sort
combineLatest([
  searchTerm$,
  filterCategory$,
  sortOrder$
]).pipe(
  switchMap(([search, category, sort]) => 
    this.http.get(`/api/products?search=${search}&category=${category}&sort=${sort}`)
  )
)
```

**Why Use It**: React to changes in any input

---

### 3. merge
**Purpose**: Merge multiple observables into one stream

**When to Use**:
- Combine multiple event sources
- Real-time notifications from different channels
- Multiple user actions

**Real-World Example**:
```typescript
// Combine multiple notification sources
merge(
  this.websocket.messages$,
  this.polling.updates$,
  this.localStorage.changes$
)
```

**Why Use It**: Single stream from multiple sources

---

### 4. zip
**Purpose**: Combine observables by pairing emissions by index

**When to Use**:
- Match requests with responses
- Pair related data streams
- Synchronize parallel operations

**Real-World Example**:
```typescript
// Pair user IDs with their details
zip(
  userIds$,
  userDetails$
).pipe(
  map(([id, details]) => ({ id, ...details }))
)
```

**Why Use It**: Maintain correspondence between streams

---

### 5. withLatestFrom
**Purpose**: Combine with latest value from another observable

**When to Use**:
- Add context to events
- Enrich data with current state
- Combine user action with app state

**Real-World Example**:
```typescript
// Add user context to button clicks
buttonClick$.pipe(
  withLatestFrom(currentUser$),
  map(([click, user]) => ({ action: 'click', userId: user.id }))
)
```

**Why Use It**: Augment primary stream with context

---

## Error Handling Operators

### 1. catchError
**Purpose**: Handle errors and return fallback observable

**When to Use**:
- Provide fallback data
- Graceful degradation
- Error recovery

**Real-World Example**:
```typescript
// Fallback to cached data on error
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error('API failed, using cache', error);
    return of(this.cachedData);
  })
)
```

**Why Use It**: Prevent stream termination on errors

---

### 2. retry
**Purpose**: Retry failed observable N times

**When to Use**:
- Network failures
- Transient errors
- Automatic recovery

**Real-World Example**:
```typescript
// Retry failed request 3 times
this.http.get('/api/data').pipe(
  retry(3),
  catchError(error => {
    // Handle after all retries failed
    return throwError(() => error);
  })
)
```

**Why Use It**: Automatic retry for transient failures

---

### 3. retryWhen
**Purpose**: Retry with custom logic (e.g., exponential backoff)

**When to Use**:
- Exponential backoff
- Conditional retry
- Rate limiting

**Real-World Example**:
```typescript
// Exponential backoff retry
this.http.get('/api/data').pipe(
  retryWhen(errors => errors.pipe(
    scan((retryCount, error) => {
      if (retryCount >= 3) throw error;
      return retryCount + 1;
    }, 0),
    delay(1000) // Wait 1 second between retries
  ))
)
```

**Why Use It**: Sophisticated retry strategies

---

## Utility Operators

### 1. tap
**Purpose**: Perform side effects without modifying the stream

**When to Use**:
- Logging
- Debugging
- Analytics tracking
- Update UI state

**Real-World Example**:
```typescript
// Log API calls for debugging
this.http.get('/api/data').pipe(
  tap(data => console.log('Received:', data)),
  tap(() => this.loading = false),
  map(data => this.transform(data))
)
```

**Why Use It**: Side effects without affecting data flow

---

### 2. delay
**Purpose**: Delay emissions by specified time

**When to Use**:
- Simulate network latency
- Throttle operations
- Timed sequences

**Real-World Example**:
```typescript
// Simulate slow network for testing
this.http.get('/api/data').pipe(
  delay(2000) // 2 second delay
)
```

**Why Use It**: Control timing of emissions

---

### 3. timeout
**Purpose**: Error if observable doesn't emit within time limit

**When to Use**:
- API timeout handling
- Prevent hanging requests
- User experience guarantees

**Real-World Example**:
```typescript
// Timeout after 5 seconds
this.http.get('/api/data').pipe(
  timeout(5000),
  catchError(error => {
    if (error.name === 'TimeoutError') {
      return of({ error: 'Request timed out' });
    }
    return throwError(() => error);
  })
)
```

**Why Use It**: Prevent indefinite waiting

---

### 4. finalize
**Purpose**: Execute callback when observable completes or errors

**When to Use**:
- Cleanup operations
- Hide loading spinners
- Release resources

**Real-World Example**:
```typescript
// Always hide loading spinner
this.loading = true;
this.http.get('/api/data').pipe(
  finalize(() => this.loading = false)
).subscribe()
```

**Why Use It**: Guaranteed cleanup regardless of success/error

---

## Creation Operators

### 1. of
**Purpose**: Create observable from values

**When to Use**:
- Mock data for testing
- Return static values
- Synchronous data

**Real-World Example**:
```typescript
// Return mock data
getMockUsers(): Observable<User[]> {
  return of([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]);
}
```

**Why Use It**: Simple observable creation

---

### 2. from
**Purpose**: Convert array, promise, or iterable to observable

**When to Use**:
- Convert promises to observables
- Process arrays reactively
- Integrate with async/await code

**Real-World Example**:
```typescript
// Convert promise to observable
from(fetch('/api/data').then(r => r.json())).pipe(
  // Use RxJS operators
)
```

**Why Use It**: Bridge between promises and observables

---

### 3. interval
**Purpose**: Emit sequential numbers at specified interval

**When to Use**:
- Polling
- Periodic updates
- Timers

**Real-World Example**:
```typescript
// Poll API every 5 seconds
interval(5000).pipe(
  switchMap(() => this.http.get('/api/status'))
).subscribe()
```

**Why Use It**: Automatic periodic emissions

---

### 4. timer
**Purpose**: Emit after delay, optionally at intervals

**When to Use**:
- Delayed execution
- Scheduled tasks
- Countdown timers

**Real-World Example**:
```typescript
// Execute after 3 seconds
timer(3000).pipe(
  switchMap(() => this.http.get('/api/data'))
).subscribe()
```

**Why Use It**: Precise timing control

---

### 5. fromEvent
**Purpose**: Create observable from DOM events

**When to Use**:
- User interactions
- Browser events
- Custom events

**Real-World Example**:
```typescript
// Listen to button clicks
fromEvent(button, 'click').pipe(
  debounceTime(300),
  switchMap(() => this.http.post('/api/action'))
).subscribe()
```

**Why Use It**: Reactive event handling

---

## Quick Reference: When to Use What

| Scenario | Operator | Why |
|----------|----------|-----|
| Search autocomplete | `debounceTime` + `switchMap` | Wait for typing pause, cancel old searches |
| Load dashboard data | `forkJoin` | Wait for all APIs, single callback |
| Transform API response | `map` | Simple data transformation |
| Prevent double-click | `exhaustMap` | Ignore clicks while processing |
| Sequential operations | `concatMap` | Maintain order |
| Parallel operations | `mergeMap` | Maximum throughput |
| Filter results | `filter` | Conditional emission |
| Handle errors | `catchError` | Graceful degradation |
| Retry failed requests | `retry` | Automatic recovery |
| Logging/debugging | `tap` | Side effects without modification |
| Cleanup | `finalize` | Always execute cleanup |
| Multiple filters | `combineLatest` | React to any change |
| Polling | `interval` + `switchMap` | Periodic API calls |

---

## Best Practices

1. **Always unsubscribe** - Use `async` pipe or `takeUntil` pattern
2. **Handle errors** - Always include error handling
3. **Use appropriate operator** - Choose based on use case
4. **Avoid nested subscriptions** - Use higher-order operators
5. **Keep it simple** - Don't over-engineer
6. **Test thoroughly** - Use marble testing for complex streams

---

This guide will be implemented with live, interactive examples in the Angular POC!