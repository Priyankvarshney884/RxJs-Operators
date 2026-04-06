# RxJS Learning POC - Architecture

## System Architecture Overview

```mermaid
graph TB
    subgraph "Angular 19 Application"
        A[App Component] --> B[Main Layout]
        B --> C[Header]
        B --> D[Sidebar Navigation]
        B --> E[Content Area]
        
        E --> F[Operator Category Routes]
        
        F --> G[Transformation Operators]
        F --> H[Filtering Operators]
        F --> I[Combination Operators]
        F --> J[Error Handling Operators]
        F --> K[Utility Operators]
        F --> L[Creation Operators]
        
        G --> M[Operator Demo Component]
        H --> M
        I --> M
        J --> M
        K --> M
        L --> M
        
        M --> N[Code Viewer]
        M --> O[Result Panel]
        M --> P[Marble Diagram]
        M --> Q[Explanation Panel]
    end
    
    subgraph "Services Layer"
        R[API Service] --> S[Dummy API Service]
        R --> T[Public API Service]
        
        S --> U[Mock Data Store]
        T --> V[External APIs]
    end
    
    M --> R
    
    subgraph "External APIs"
        V --> W[JSONPlaceholder]
        V --> X[GitHub API]
        V --> Y[OpenWeather API]
        V --> Z[REST Countries]
    end
```

## Component Hierarchy

```mermaid
graph TD
    A[app.component] --> B[main-layout.component]
    B --> C[header.component]
    B --> D[sidebar.component]
    B --> E[router-outlet]
    
    E --> F[transformation.component]
    E --> G[filtering.component]
    E --> H[combination.component]
    E --> I[error-handling.component]
    E --> J[utility.component]
    E --> K[creation.component]
    
    F --> L[operator-demo.component]
    G --> L
    H --> L
    I --> L
    J --> L
    K --> L
    
    L --> M[code-viewer.component]
    L --> N[result-panel.component]
    L --> O[marble-diagram.component]
    L --> P[explanation-panel.component]
    
    D --> Q[operator-search.component]
    D --> R[category-list.component]
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant S as Service
    participant API as External API
    participant RxJS as RxJS Operators
    
    U->>C: Click Execute Button
    C->>S: Call API Method
    S->>API: HTTP Request
    API-->>S: HTTP Response
    S->>RxJS: Apply Operators
    RxJS->>RxJS: Transform Data
    RxJS-->>C: Emit Final Result
    C->>U: Display Result + Explanation
```

## Operator Example Flow

```mermaid
graph LR
    A[User Input] --> B[Observable Creation]
    B --> C[Operator Chain]
    C --> D[Transformation]
    D --> E[Filtering]
    E --> F[Error Handling]
    F --> G[Side Effects]
    G --> H[Final Result]
    H --> I[UI Display]
    
    style C fill:#f9f,stroke:#333,stroke-width:4px
    style H fill:#9f9,stroke:#333,stroke-width:2px
```

## Service Architecture

```mermaid
classDiagram
    class ApiService {
        -http: HttpClient
        +get(url: string)
        +post(url: string, data: any)
        +handleError(error: any)
    }
    
    class DummyApiService {
        -mockData: any
        +getUsers()
        +getProducts()
        +getOrders()
        +simulateDelay()
    }
    
    class PublicApiService {
        +getJSONPlaceholderUsers()
        +getGitHubRepos()
        +getWeatherData()
        +getCountries()
    }
    
    ApiService <|-- DummyApiService
    ApiService <|-- PublicApiService
```

## Operator Categories Structure

```mermaid
mindmap
  root((RxJS Operators))
    Transformation
      map
      switchMap
      mergeMap
      concatMap
      exhaustMap
    Filtering
      filter
      debounceTime
      distinctUntilChanged
      take
      skip
      first
      last
    Combination
      forkJoin
      combineLatest
      merge
      zip
      withLatestFrom
    Error Handling
      catchError
      retry
      retryWhen
    Utility
      tap
      delay
      timeout
      finalize
    Creation
      of
      from
      interval
      timer
      fromEvent
```

## State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: Execute Operator
    Loading --> Success: API Success
    Loading --> Error: API Error
    Success --> Idle: Reset
    Error --> Idle: Reset
    Error --> Loading: Retry
    
    Success --> DisplayResult
    DisplayResult --> ShowCode
    DisplayResult --> ShowDiagram
    DisplayResult --> ShowExplanation
```

## Routing Structure

```
/
├── /transformation
│   ├── /map
│   ├── /switchMap
│   ├── /mergeMap
│   ├── /concatMap
│   └── /exhaustMap
├── /filtering
│   ├── /filter
│   ├── /debounceTime
│   ├── /distinctUntilChanged
│   ├── /take
│   └── /skip
├── /combination
│   ├── /forkJoin
│   ├── /combineLatest
│   ├── /merge
│   └── /zip
├── /error-handling
│   ├── /catchError
│   ├── /retry
│   └── /retryWhen
├── /utility
│   ├── /tap
│   ├── /delay
│   └── /finalize
└── /creation
    ├── /of
    ├── /from
    ├── /interval
    └── /timer
```

## Key Design Patterns

### 1. Service Pattern
- Centralized API logic
- Reusable across components
- Easy to test and mock

### 2. Component Pattern
- Standalone components (Angular 19)
- Reusable operator demo template
- Separation of concerns

### 3. Observable Pattern
- Reactive data flow
- Automatic cleanup
- Error handling built-in

### 4. Strategy Pattern
- Different operators for different scenarios
- Pluggable operator examples
- Easy to extend

## Technology Integration

```mermaid
graph TB
    A[Angular 19] --> B[TypeScript]
    A --> C[RxJS 7+]
    A --> D[Angular Material/Tailwind]
    
    C --> E[Operators]
    C --> F[Observables]
    C --> G[Subjects]
    
    D --> H[UI Components]
    D --> I[Styling]
    
    B --> J[Type Safety]
    B --> K[Interfaces]
    
    E --> L[Demo Examples]
    F --> L
    G --> L
    
    H --> L
    I --> L
    J --> L
    K --> L
```

## Performance Considerations

1. **Lazy Loading**: Load operator modules on demand
2. **Change Detection**: OnPush strategy for better performance
3. **Unsubscribe**: Automatic cleanup with async pipe
4. **Caching**: Cache API responses where appropriate
5. **Debouncing**: Prevent excessive API calls

## Security Considerations

1. **API Keys**: Store in environment files (not committed)
2. **CORS**: Handle cross-origin requests properly
3. **Input Validation**: Sanitize user inputs
4. **Error Messages**: Don't expose sensitive information

---

This architecture ensures:
- ✅ Scalability - Easy to add new operators
- ✅ Maintainability - Clear separation of concerns
- ✅ Testability - Services and components are testable
- ✅ Reusability - Shared components across examples
- ✅ Learning - Clear structure for understanding