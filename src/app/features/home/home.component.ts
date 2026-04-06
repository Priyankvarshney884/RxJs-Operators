import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <header class="hero">
        <h1>🎓 RxJS Operators Learning Platform</h1>
        <p class="subtitle">Master RxJS through interactive examples with real API calls</p>
      </header>

      <section class="features">
        <div class="feature-card">
          <div class="icon">🔄</div>
          <h3>30+ Operators</h3>
          <p>Learn all major RxJS operators with practical examples</p>
        </div>
        <div class="feature-card">
          <div class="icon">🌐</div>
          <h3>Real APIs</h3>
          <p>Work with both mock and public APIs</p>
        </div>
        <div class="feature-card">
          <div class="icon">📊</div>
          <h3>Visual Learning</h3>
          <p>Marble diagrams and interactive code execution</p>
        </div>
        <div class="feature-card">
          <div class="icon">🎯</div>
          <h3>Structured Path</h3>
          <p>From beginner to advanced, step by step</p>
        </div>
      </section>

      <section class="categories">
        <h2>Operator Categories</h2>
        <div class="category-grid">
          <a routerLink="/transformation" class="category-card transformation">
            <h3>🔄 Transformation</h3>
            <p>map, switchMap, mergeMap, concatMap, exhaustMap</p>
            <span class="badge">5 operators</span>
          </a>
          
          <a routerLink="/filtering" class="category-card filtering">
            <h3>🔍 Filtering</h3>
            <p>filter, debounceTime, distinctUntilChanged, take, skip</p>
            <span class="badge">5 operators</span>
          </a>
          
          <a routerLink="/combination" class="category-card combination">
            <h3>🔗 Combination</h3>
            <p>forkJoin, combineLatest, merge, zip</p>
            <span class="badge">4 operators</span>
          </a>
          
          <a routerLink="/error-handling" class="category-card error">
            <h3>⚠️ Error Handling</h3>
            <p>catchError, retry, retryWhen</p>
            <span class="badge">3 operators</span>
          </a>
          
          <a routerLink="/utility" class="category-card utility">
            <h3>🛠️ Utility</h3>
            <p>tap, delay, timeout, finalize</p>
            <span class="badge">4 operators</span>
          </a>
          
          <a routerLink="/creation" class="category-card creation">
            <h3>✨ Creation</h3>
            <p>of, from, interval, timer, fromEvent</p>
            <span class="badge">5 operators</span>
          </a>
        </div>
      </section>

      <section class="learning-path">
        <h2>📚 Learning Path</h2>
        <div class="path-steps">
          <div class="step beginner">
            <div class="step-number">1</div>
            <h3>🟢 Beginner</h3>
            <p>Start with Creation and basic Transformation operators</p>
          </div>
          <div class="step intermediate">
            <div class="step-number">2</div>
            <h3>🟡 Intermediate</h3>
            <p>Master Filtering, Combination, and Error Handling</p>
          </div>
          <div class="step advanced">
            <div class="step-number">3</div>
            <h3>🔴 Advanced</h3>
            <p>Deep dive into complex scenarios and performance</p>
          </div>
        </div>
      </section>

      <section class="cta">
        <h2>Ready to Start Learning?</h2>
        <p>Choose a category above or start with the basics</p>
        <a routerLink="/creation/of" class="cta-button">Start with Creation Operators →</a>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      text-align: center;
      padding: 3rem 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      margin-bottom: 3rem;
    }

    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .categories h2 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .category-card {
      padding: 2rem;
      border-radius: 8px;
      text-decoration: none;
      color: white;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    .category-card h3 {
      margin-bottom: 0.5rem;
    }

    .category-card p {
      opacity: 0.9;
      margin-bottom: 1rem;
    }

    .badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    .transformation { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .filtering { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .combination { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .error { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    .utility { background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); }
    .creation { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; }

    .learning-path {
      margin: 3rem 0;
    }

    .learning-path h2 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .path-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .step {
      padding: 2rem;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }

    .step-number {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
    }

    .beginner .step-number { background: #10b981; }
    .intermediate .step-number { background: #f59e0b; }
    .advanced .step-number { background: #ef4444; }

    .cta {
      text-align: center;
      padding: 3rem;
      background: #f9fafb;
      border-radius: 12px;
      margin-top: 3rem;
    }

    .cta h2 {
      margin-bottom: 1rem;
    }

    .cta-button {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .cta-button:hover {
      transform: scale(1.05);
    }
  `]
})
export class HomeComponent {}

// Made with Bob
