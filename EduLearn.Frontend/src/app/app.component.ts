import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="main-nav glass" *ngIf="showNavbar">
      <div class="nav-container">
        <div class="logo" routerLink="/">
          <div class="logo-icon">E</div>
          <span>EduLearn</span>
        </div>
        
        <div class="nav-links">
          <a routerLink="/courses" routerLinkActive="active">All Courses</a>
          
          <ng-container *ngIf="!isLoggedIn">
            <a routerLink="/login" class="nav-item">Login</a>
            <button class="btn btn-primary btn-sm" routerLink="/register">Get Started</button>
          </ng-container>

          <ng-container *ngIf="isLoggedIn">
            <button class="btn btn-outline btn-sm" (click)="goToDashboard()">My Dashboard</button>
            <button class="btn btn-ghost btn-sm" (click)="logout()" title="Sign Out">Logout</button>
          </ng-container>
        </div>
      </div>
    </nav>

    <main [class.has-nav]="showNavbar">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host { --primary: #10b981; --primary-hover: #059669; }
    .main-nav { position: fixed; top: 0; left: 0; right: 0; height: 70px; z-index: 1000; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .nav-container { max-width: 1400px; margin: 0 auto; height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; }
    
    .logo { display: flex; align-items: center; gap: 0.8rem; cursor: pointer; font-weight: 800; font-size: 1.3rem; color: #fff; }
    .logo-icon { width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: white; }
    
    .nav-links { display: flex; align-items: center; gap: 2rem; }
    .nav-links a { text-decoration: none; color: #94a3b8; font-size: 0.95rem; font-weight: 500; transition: 0.3s; }
    .nav-links a:hover, .nav-links a.active { color: var(--primary); }
    

    .btn { padding: 0.6rem 1.2rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.3s; border: none; font-size: 0.9rem; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: white; }
    .btn-outline:hover { background: rgba(255,255,255,0.05); }
    .btn-ghost { background: transparent; color: #94a3b8; }
    .btn-ghost:hover { color: #fff; background: rgba(255,255,255,0.05); }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.85rem; }

    .glass { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); }
    main.has-nav { padding-top: 70px; }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userAvatar = '';
  showNavbar = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userAvatar = user?.avatarUrl || '';
    });

    // Hide navbar on specific pages if needed
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.showNavbar = !(url.includes('/login') || url.includes('/register'));
    });
  }

  goToDashboard() {
    const role = this.authService.getUserRole();
    if (role === 'ADMIN') this.router.navigate(['/dashboard/admin']);
    else if (role === 'INSTRUCTOR') this.router.navigate(['/dashboard/instructor']);
    else this.router.navigate(['/dashboard/student']);
  }

  logout() {
    this.authService.logout();
  }
}
