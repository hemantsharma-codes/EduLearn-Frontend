import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-wrapper">
      <!-- NAVIGATION -->
      <nav class="glass-nav fade-in">
        <div class="logo">
          <div class="logo-icon">E</div>
          <span>EduLearn</span>
        </div>
        <div class="nav-links">
          <a routerLink="/courses">Browse Courses</a>
          <a routerLink="/login" class="btn-login">Sign In</a>
          <a routerLink="/register" class="btn-primary">Get Started</a>
        </div>
      </nav>

      <!-- HERO SECTION -->
      <header class="hero-section">
        <div class="hero-content slide-up">
          <span class="badge">🚀 The Future of Learning</span>
          <h1>Master New Skills with <span>EduLearn</span></h1>
          <p>Join thousands of students learning from industry experts. Premium courses, lifetime access, and career-transforming content.</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" routerLink="/courses">Explore Courses</button>
            <button class="btn btn-outline btn-lg" routerLink="/register">Join for Free</button>
          </div>
          <div class="hero-stats">
            <div class="stat"><b>10k+</b> <span>Students</span></div>
            <div class="stat"><b>500+</b> <span>Courses</span></div>
            <div class="stat"><b>4.9⭐</b> <span>Rating</span></div>
          </div>
        </div>
        <div class="hero-visual glass">
           <!-- Abstract UI elements to represent the platform -->
           <div class="mock-card">
              <div class="shimmer-line"></div>
              <div class="shimmer-box"></div>
              <div class="shimmer-line short"></div>
           </div>
           <div class="mock-card floating">
              <div class="shimmer-line"></div>
              <div class="shimmer-box"></div>
           </div>
        </div>
      </header>

      <!-- FEATURED PREVIEW -->
      <section class="features-preview">
         <div class="section-title">
            <h2>Why Choose EduLearn?</h2>
            <p>Experience a platform built for modern learners.</p>
         </div>
         <div class="feature-grid">
            <div class="feature-card glass">
               <span class="feat-icon">🎯</span>
               <h3>Expert Led</h3>
               <p>Learn from professionals with real-world experience.</p>
            </div>
            <div class="feature-card glass">
               <span class="feat-icon">💎</span>
               <h3>Premium UI</h3>
               <p>Clean, focus-oriented interface for better learning.</p>
            </div>
            <div class="feature-card glass">
               <span class="feat-icon">📜</span>
               <h3>Certificates</h3>
               <p>Get recognized for your hard work and new skills.</p>
            </div>
         </div>
      </section>

      <!-- FOOTER -->
      <footer class="footer">
        <p>&copy; 2026 EduLearn Platform. Built for Excellence.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing-wrapper { min-height: 100vh; background: #0b0e14; color: #e2e8f0; font-family: 'Inter', sans-serif; overflow-x: hidden; }
    
    /* NAV */
    .glass-nav { position: fixed; top: 0; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5rem; z-index: 1000; backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
    .logo { display: flex; align-items: center; gap: 0.8rem; font-weight: 800; font-size: 1.5rem; }
    .logo-icon { width: 35px; height: 35px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; }
    .nav-links { display: flex; align-items: center; gap: 2rem; }
    .nav-links a { color: #94a3b8; text-decoration: none; font-weight: 500; transition: 0.3s; font-size: 0.95rem; }
    .nav-links a:hover { color: #fff; }
    .btn-login { margin-left: 1rem; }

    /* HERO */
    .hero-section { min-height: 100vh; display: flex; align-items: center; justify-content: space-between; padding: 0 10%; background: radial-gradient(circle at top right, #1e293b, #0b0e14); position: relative; }
    .hero-content { max-width: 600px; z-index: 10; }
    .badge { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.5rem 1.2rem; border-radius: 20px; font-weight: 700; font-size: 0.8rem; margin-bottom: 1.5rem; display: inline-block; }
    .hero-content h1 { font-size: 4.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; color: #fff; }
    .hero-content h1 span { color: #10b981; }
    .hero-content p { font-size: 1.2rem; color: #94a3b8; line-height: 1.6; margin-bottom: 2.5rem; }
    
    .hero-actions { display: flex; gap: 1.5rem; margin-bottom: 4rem; }
    .hero-stats { display: flex; gap: 3rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2rem; }
    .stat { display: flex; flex-direction: column; }
    .stat b { font-size: 1.8rem; color: #fff; }
    .stat span { color: #64748b; font-size: 0.9rem; }

    .hero-visual { width: 450px; height: 550px; border-radius: 40px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .mock-card { width: 300px; height: 180px; background: rgba(255,255,255,0.03); border-radius: 20px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border: 1px solid rgba(255,255,255,0.05); }
    .mock-card.floating { position: absolute; bottom: 50px; right: -50px; transform: rotate(5deg); background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
    .shimmer-line { height: 10px; width: 100%; background: rgba(255,255,255,0.05); border-radius: 5px; }
    .shimmer-line.short { width: 60%; }
    .shimmer-box { height: 60px; width: 100%; background: rgba(255,255,255,0.05); border-radius: 10px; }

    /* FEATURES */
    .features-preview { padding: 8rem 10%; }
    .section-title { text-align: center; margin-bottom: 4rem; }
    .section-title h2 { font-size: 2.5rem; margin-bottom: 1rem; }
    .section-title p { color: #94a3b8; }
    .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
    .feature-card { padding: 3rem; border-radius: 24px; text-align: center; border: 1px solid rgba(255,255,255,0.05); transition: 0.3s; }
    .feature-card:hover { transform: translateY(-10px); border-color: #10b981; }
    .feat-icon { font-size: 2.5rem; margin-bottom: 1.5rem; display: block; }
    .feature-card h3 { font-size: 1.4rem; margin-bottom: 1rem; }
    .feature-card p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }

    /* BUTTONS */
    .btn { padding: 1rem 2rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; border: none; font-size: 1rem; }
    .btn-primary { background: #10b981; color: white; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
    .btn-primary:hover { background: #059669; transform: translateY(-2px); }
    .btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: white; }
    .btn-outline:hover { background: rgba(255,255,255,0.05); }
    .btn-lg { padding: 1.2rem 2.5rem; font-size: 1.1rem; }

    .footer { padding: 4rem 10%; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); color: #64748b; font-size: 0.9rem; }

    .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); }
    .fade-in { animation: fadeIn 1s ease-out; }
    .slide-up { animation: slideUp 0.8s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 1100px) {
       .hero-section { flex-direction: column; text-align: center; padding-top: 10rem; padding-bottom: 5rem; }
       .hero-visual { display: none; }
       .hero-actions { justify-content: center; }
       .hero-stats { justify-content: center; }
       .feature-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class LandingPageComponent {}
