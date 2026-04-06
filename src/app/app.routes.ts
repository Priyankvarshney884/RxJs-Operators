import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'transformation/map',
    loadComponent: () => import('./features/transformation/map-example/map-example.component').then(m => m.MapExampleComponent)
  },
  {
    path: 'transformation/switchmap',
    loadComponent: () => import('./features/transformation/switchmap-example/switchmap-example.component').then(m => m.SwitchMapExampleComponent)
  },
  {
    path: 'transformation/mergemap',
    loadComponent: () => import('./features/transformation/mergemap-example/mergemap-example.component').then(m => m.MergeMapExampleComponent)
  },
  {
    path: 'transformation/concatmap',
    loadComponent: () => import('./features/transformation/concatmap-example/concatmap-example.component').then(m => m.ConcatMapExampleComponent)
  },
  {
    path: 'transformation/exhaustmap',
    loadComponent: () => import('./features/transformation/exhaustmap-example/exhaustmap-example.component').then(m => m.ExhaustMapExampleComponent)
  },
  {
    path: 'filtering/filter',
    loadComponent: () => import('./features/filtering/filter-example/filter-example.component').then(m => m.FilterExampleComponent)
  },
  {
    path: 'filtering/debouncetime',
    loadComponent: () => import('./features/filtering/debouncetime-example/debouncetime-example.component').then(m => m.DebounceTimeExampleComponent)
  },
  {
    path: 'filtering/distinctuntilchanged',
    loadComponent: () => import('./features/filtering/distinctuntilchanged-example/distinctuntilchanged-example.component').then(m => m.DistinctUntilChangedExampleComponent)
  },
  {
    path: 'filtering/take',
    loadComponent: () => import('./features/filtering/take-example/take-example.component').then(m => m.TakeExampleComponent)
  },
  {
    path: 'filtering/skip',
    loadComponent: () => import('./features/filtering/skip-example/skip-example.component').then(m => m.SkipExampleComponent)
  },
  {
    path: 'combination/forkjoin',
    loadComponent: () => import('./features/combination/forkjoin-example/forkjoin-example.component').then(m => m.ForkJoinExampleComponent)
  },
  {
    path: 'combination/combinelatest',
    loadComponent: () => import('./features/combination/combinelatest-example/combinelatest-example.component').then(m => m.CombineLatestExampleComponent)
  },
  {
    path: 'combination/merge',
    loadComponent: () => import('./features/combination/merge-example/merge-example.component').then(m => m.MergeExampleComponent)
  },
  {
    path: 'combination/zip',
    loadComponent: () => import('./features/combination/zip-example/zip-example.component').then(m => m.ZipExampleComponent)
  },
  {
    path: 'error-handling/catcherror',
    loadComponent: () => import('./features/error-handling/catcherror-example/catcherror-example.component').then(m => m.CatchErrorExampleComponent)
  },
  {
    path: 'error-handling/retry',
    loadComponent: () => import('./features/error-handling/retry-example/retry-example.component').then(m => m.RetryExampleComponent)
  },
  {
    path: 'error-handling/retrywhen',
    loadComponent: () => import('./features/error-handling/retrywhen-example/retrywhen-example.component').then(m => m.RetryWhenExampleComponent)
  },
  {
    path: 'utility/tap',
    loadComponent: () => import('./features/utility/tap-example/tap-example.component').then(m => m.TapExampleComponent)
  },
  {
    path: 'utility/delay',
    loadComponent: () => import('./features/utility/delay-example/delay-example.component').then(m => m.DelayExampleComponent)
  },
  {
    path: 'utility/finalize',
    loadComponent: () => import('./features/utility/finalize-example/finalize-example.component').then(m => m.FinalizeExampleComponent)
  },
  {
    path: 'error-handling/catcherror',
    loadComponent: () => import('./features/error-handling/catcherror-example/catcherror-example.component').then(m => m.CatchErrorExampleComponent)
  },
  {
    path: 'error-handling/retry',
    loadComponent: () => import('./features/error-handling/retry-example/retry-example.component').then(m => m.RetryExampleComponent)
  },
  {
    path: 'error-handling/retrywhen',
    loadComponent: () => import('./features/error-handling/retrywhen-example/retrywhen-example.component').then(m => m.RetryWhenExampleComponent)
  },
  {
    path: 'utility/tap',
    loadComponent: () => import('./features/utility/tap-example/tap-example.component').then(m => m.TapExampleComponent)
  },
  {
    path: 'utility/delay',
    loadComponent: () => import('./features/utility/delay-example/delay-example.component').then(m => m.DelayExampleComponent)
  },
  {
    path: 'utility/finalize',
    loadComponent: () => import('./features/utility/finalize-example/finalize-example.component').then(m => m.FinalizeExampleComponent)
  },
  {
    path: 'creation/of',
    loadComponent: () => import('./features/creation/of-example/of-example.component').then(m => m.OfExampleComponent)
  },
  {
    path: 'creation/from',
    loadComponent: () => import('./features/creation/from-example/from-example.component').then(m => m.FromExampleComponent)
  },
  {
    path: 'creation/interval',
    loadComponent: () => import('./features/creation/interval-example/interval-example.component').then(m => m.IntervalExampleComponent)
  },
  {
    path: 'creation/timer',
    loadComponent: () => import('./features/creation/timer-example/timer-example.component').then(m => m.TimerExampleComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

// Made with Bob
