# Missing Operators Analysis

## Current Implementation Status

### ✅ Completed Categories

#### Transformation (5/5)
- ✅ map
- ✅ switchMap
- ✅ mergeMap
- ✅ concatMap
- ✅ exhaustMap

#### Filtering (5/7)
- ✅ filter
- ✅ debounceTime
- ✅ distinctUntilChanged
- ✅ take
- ✅ skip
- ❌ **first** (mentioned in ARCHITECTURE.md)
- ❌ **last** (mentioned in ARCHITECTURE.md)

#### Combination (4/5)
- ✅ forkJoin
- ✅ combineLatest
- ✅ merge
- ✅ zip
- ❌ **withLatestFrom** (mentioned in ARCHITECTURE.md)

#### Error Handling (3/3)
- ✅ catchError
- ✅ retry
- ✅ retryWhen

#### Utility (3/4)
- ✅ tap
- ✅ delay
- ✅ finalize
- ❌ **timeout** (mentioned in ARCHITECTURE.md)

#### Creation (4/5)
- ✅ of
- ✅ from
- ✅ interval
- ✅ timer
- ❌ **fromEvent** (mentioned in ARCHITECTURE.md)

### ❌ Missing Category: Subjects

The ARCHITECTURE.md mentions Subjects in the technology integration diagram but there's no dedicated category for them:
- ❌ **Subject**
- ❌ **BehaviorSubject**
- ❌ **ReplaySubject**
- ❌ **AsyncSubject**

## Implementation Plan

### Phase 1: Complete Existing Categories (6 operators)
1. **Filtering Operators** (2)
   - first - Emits only the first value (or first value that meets condition)
   - last - Emits only the last value (or last value that meets condition)

2. **Combination Operators** (1)
   - withLatestFrom - Combines source with latest values from other observables

3. **Utility Operators** (1)
   - timeout - Errors if observable doesn't emit within specified time

4. **Creation Operators** (1)
   - fromEvent - Creates observable from DOM events

### Phase 2: Add Subjects Category (4 operators)
5. **Subjects** (New Category)
   - Subject - Basic subject for multicasting
   - BehaviorSubject - Subject that requires initial value and emits current value
   - ReplaySubject - Subject that replays specified number of emissions
   - AsyncSubject - Subject that only emits last value on completion

## Additional Popular Operators to Consider

### High Priority (Commonly Used)
- **scan** - Accumulator function (like reduce but emits intermediate values)
- **startWith** - Emit specified value before source emissions
- **takeUntil** - Take values until notifier emits
- **takeWhile** - Take values while condition is true
- **throttleTime** - Emit value then ignore for duration
- **share** - Share single subscription among multiple subscribers
- **shareReplay** - Share and replay emissions

### Medium Priority
- **pluck** - Select nested property
- **mapTo** - Map every emission to constant value
- **mergeAll** - Flatten higher-order observable
- **concatAll** - Flatten higher-order observable sequentially
- **switchAll** - Switch to latest inner observable
- **partition** - Split observable into two based on predicate
- **groupBy** - Group emissions by key

### Advanced/Specialized
- **buffer** - Collect emissions into arrays
- **bufferTime** - Collect emissions into arrays by time
- **window** - Collect emissions into nested observables
- **audit** - Emit most recent value after duration
- **sample** - Emit most recent value when notifier emits
- **pairwise** - Emit previous and current value as array

## Recommended Implementation Order

### Immediate (Complete ARCHITECTURE.md operators)
1. first (Filtering)
2. last (Filtering)
3. withLatestFrom (Combination)
4. timeout (Utility)
5. fromEvent (Creation)

### Next Priority (Subjects)
6. Subject
7. BehaviorSubject
8. ReplaySubject
9. AsyncSubject

### Future Enhancements (Most Useful)
10. scan
11. startWith
12. takeUntil
13. throttleTime
14. share/shareReplay

## Total Operators Summary

- **Currently Implemented**: 20 operators
- **Missing from ARCHITECTURE.md**: 6 operators
- **Subjects (new category)**: 4 operators
- **Recommended additions**: 10+ operators

**Grand Total Potential**: 40+ operators for comprehensive learning platform