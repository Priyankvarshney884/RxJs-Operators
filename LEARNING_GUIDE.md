# 🎓 RxJS Operators Learning POC

An interactive Angular 19 application designed to teach RxJS operators through practical examples with real API calls.

## 🌟 Features

- ✅ **30+ RxJS Operators** with live examples
- ✅ **Interactive Code Execution** - Run examples and see results
- ✅ **Visual Marble Diagrams** - Understand data flow
- ✅ **Real API Integration** - Both mock and public APIs
- ✅ **Side-by-Side Comparisons** - Compare similar operators
- ✅ **Search Functionality** - Find operators by use case
- ✅ **Comprehensive Explanations** - Learn when and why to use each operator
- ✅ **Modern UI** - Clean, responsive interface
- ✅ **TypeScript** - Full type safety

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Angular CLI** (v19)

```bash
# Install Angular CLI globally
npm install -g @angular/cli@19
```

## 🚀 Quick Start

### 1. Clone or Navigate to Project

```bash
cd c:/Users/PriyankVarshney/Documents/RxJs
```

### 2. Create Angular 19 Project

```bash
# This will be done during implementation
ng new rxjs-learning-poc --standalone --routing --style=scss
```

### 3. Install Dependencies

```bash
cd rxjs-learning-poc
npm install
```

### 4. Run Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser.

## 📚 Learning Path

### 🟢 Beginner Level (Start Here!)

**Goal**: Understand basic RxJS concepts and simple operators

1. **Creation Operators**
   - [`of`](src/app/features/creation/of) - Create observables from values
   - [`from`](src/app/features/creation/from) - Convert arrays/promises to observables

2. **Basic Transformation**
   - [`map`](src/app/features/transformation/map) - Transform each value

3. **Simple Filtering**
   - [`filter`](src/app/features/filtering/filter) - Filter values by condition
   - [`take`](src/app/features/filtering/take) - Take first N values

**Practice Project**: Build a simple user list with filtering

---

### 🟡 Intermediate Level

**Goal**: Handle asynchronous operations and API calls

1. **Advanced Transformation**
   - [`switchMap`](src/app/features/transformation/switchMap) - Search autocomplete
   - [`mergeMap`](src/app/features/transformation/mergeMap) - Parallel API calls
   - [`concatMap`](src/app/features/transformation/concatMap) - Sequential operations

2. **Timing Operators**
   - [`debounceTime`](src/app/features/filtering/debounceTime) - Wait for pause
   - [`distinctUntilChanged`](src/app/features/filtering/distinctUntilChanged) - Prevent duplicates

3. **Combination Operators**
   - [`forkJoin`](src/app/features/combination/forkJoin) - Wait for all
   - [`combineLatest`](src/app/features/combination/combineLatest) - Multiple filters

4. **Error Handling**
   - [`catchError`](src/app/features/error-handling/catchError) - Handle errors
   - [`retry`](src/app/features/error-handling/retry) - Retry failed requests

**Practice Project**: Build a product search with filters and error handling

---

### 🔴 Advanced Level

**Goal**: Master complex scenarios and performance optimization

1. **Advanced Transformation**
   - [`exhaustMap`](src/app/features/transformation/exhaustMap) - Prevent double-clicks
   - Comparison: `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap`

2. **Advanced Combination**
   - [`zip`](src/app/features/combination/zip) - Pair by index
   - [`withLatestFrom`](src/app/features/combination/withLatestFrom) - Add context

3. **Utility Operators**
   - [`tap`](src/app/features/utility/tap) - Side effects
   - [`finalize`](src/app/features/utility/finalize) - Cleanup
   - [`timeout`](src/app/features/utility/timeout) - Time limits

4. **Advanced Error Handling**
   - [`retryWhen`](src/app/features/error-handling/retryWhen) - Exponential backoff

**Practice Project**: Build a real-time dashboard with multiple data sources

---

## 🎯 Operator Categories

### 1. Transformation Operators
Transform emitted values

| Operator | Use Case | Difficulty |
|----------|----------|------------|
| `map` | Simple transformation | 🟢 Beginner |
| `switchMap` | Cancel previous, switch to new | 🟡 Intermediate |
| `mergeMap` | Process all in parallel | 🟡 Intermediate |
| `concatMap` | Process sequentially | 🟡 Intermediate |
| `exhaustMap` | Ignore new until complete | 🔴 Advanced |

### 2. Filtering Operators
Filter or limit emissions

| Operator | Use Case | Difficulty |
|----------|----------|------------|
| `filter` | Conditional emission | 🟢 Beginner |
| `debounceTime` | Wait for pause | 🟡 Intermediate |
| `distinctUntilChanged` | Emit only on change | 🟡 Intermediate |
| `take` | Take first N | 🟢 Beginner |
| `skip` | Skip first N | 🟢 Beginner |
| `first` | Take first match | 🟢 Beginner |
| `last` | Take last value | 🟢 Beginner |

### 3. Combination Operators
Combine multiple observables

| Operator | Use Case | Difficulty |
|----------|----------|------------|
| `forkJoin` | Wait for all to complete | 🟡 Intermediate |
| `combineLatest` | Emit when any changes | 🟡 Intermediate |
| `merge` | Merge multiple streams | 🟡 Intermediate |
| `zip` | Pair by index | 🔴 Advanced |
| `withLatestFrom` | Add context | 🔴 Advanced |

### 4. Error Handling Operators
Handle errors gracefully

| Operator | Use Case | Difficulty |
|----------|----------|------------|
| `catchError` | Fallback on error | 🟡 Intermediate |
| `retry` | Retry N times | 🟡 Intermediate |
| `retryWhen` | Conditional retry | 🔴 Advanced |

### 5. Utility Operators
Side effects and debugging

| Operator | Use Case | Difficulty |
|----------|----------|------------|
| `tap` | Side effects | 🟡 Intermediate |
| `delay` | Delay emissions | 🟢 Beginner |
| `timeout` | Set time limit | 🟡 Intermediate |
| `finalize` | Cleanup | 🟡 Intermediate |

### 6. Creation Operators
Create observables

| Operator | Use Case | Difficulty |
|----------|----------|------------|
| `of` | From values | 🟢 Beginner |
| `from` | From array/promise | 🟢 Beginner |
| `interval` | Periodic emissions | 🟢 Beginner |
| `timer` | Delayed emission | 🟢 Beginner |
| `fromEvent` | From DOM events | 🟡 Intermediate |

## 🔧 Project Structure

```
rxjs-learning-poc/
├── src/
│   ├── app/
│   │   ├── core/                    # Core services and models
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── dummy-api.service.ts
│   │   │   │   └── public-api.service.ts
│   │   │   └── models/
│   │   ├── features/                # Operator examples by category
│   │   │   ├── transformation/
│   │   │   ├── filtering/
│   │   │   ├── combination/
│   │   │   ├── error-handling/
│   │   │   ├── utility/
│   │   │   └── creation/
│   │   ├── shared/                  # Shared components
│   │   │   ├── components/
│   │   │   │   ├── code-viewer/
│   │   │   │   ├── operator-demo/
│   │   │   │   ├── marble-diagram/
│   │   │   │   └── result-panel/
│   │   │   └── pipes/
│   │   ├── layout/                  # Layout components
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   └── main-layout/
│   │   └── app.component.ts
│   ├── assets/
│   └── styles/
├── PROJECT_PLAN.md                  # Detailed project plan
├── ARCHITECTURE.md                  # System architecture
├── OPERATOR_GUIDE.md                # Complete operator reference
└── README.md                        # This file
```

## 🌐 API Integration

### Mock APIs (Dummy Data)
- User management
- Product catalog
- Order processing
- Real-time notifications (simulated)

### Public APIs
- **JSONPlaceholder** - Users, posts, comments
- **GitHub API** - Repositories, users
- **OpenWeatherMap** - Weather data (requires API key)
- **REST Countries** - Country information

## 💡 How to Use This POC

### 1. Browse Operators
- Use the sidebar to navigate operator categories
- Click on any operator to see its example

### 2. Understand the Operator
- Read the explanation panel
- Study the visual marble diagram
- Review the code example

### 3. Execute the Example
- Click "Run Example" button
- Watch the loading state
- See the API response
- Observe error handling (if applicable)

### 4. Experiment
- Modify parameters (if available)
- Compare with similar operators
- Try different scenarios

### 5. Practice
- Build your own examples
- Combine multiple operators
- Solve real-world problems

## 🎨 UI Features

### Code Viewer
- Syntax highlighted TypeScript code
- Copy to clipboard functionality
- Line numbers for reference

### Result Panel
- JSON formatted API responses
- Loading states
- Error messages
- Execution time

### Marble Diagram
- Visual representation of data flow
- Input/output visualization
- Operator behavior animation

### Comparison View
- Side-by-side operator comparison
- Performance metrics
- Use case differences

## 📖 Additional Resources

### Documentation
- [RxJS Official Documentation](https://rxjs.dev/)
- [Angular Documentation](https://angular.dev/)
- [PROJECT_PLAN.md](PROJECT_PLAN.md) - Detailed implementation plan
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [OPERATOR_GUIDE.md](OPERATOR_GUIDE.md) - Complete operator reference

### Learning Resources
- RxJS Marbles - Interactive diagrams
- Learn RxJS - Operator examples
- Angular University - RxJS course

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new operator examples
- Improve explanations
- Add more API integrations
- Enhance UI/UX

## 📝 License

This project is for educational purposes.

## 🎯 Next Steps

1. **Review the Plan** - Read [PROJECT_PLAN.md](PROJECT_PLAN.md)
2. **Understand Architecture** - Study [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Learn Operators** - Reference [OPERATOR_GUIDE.md](OPERATOR_GUIDE.md)
4. **Start Implementation** - Switch to Code mode
5. **Build and Learn** - Follow the learning path

---

## 🚀 Ready to Start?

Once you approve this plan, we'll switch to **Code mode** to implement:

1. ✅ Angular 19 project setup
2. ✅ Project structure and routing
3. ✅ Core services (API, mock data)
4. ✅ Shared components (code viewer, result panel)
5. ✅ Operator examples (all categories)
6. ✅ Interactive UI with explanations
7. ✅ Visual diagrams and animations
8. ✅ Complete documentation

**Let's build an amazing RxJS learning platform! 🎉**