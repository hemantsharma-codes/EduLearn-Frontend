import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="glass login-card">
        <h2>Join EduLearn</h2>
        <p class="subtitle">Create your account and start learning today</p>
        
        <form (ngSubmit)="onRegister()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="fullName" name="fullName" placeholder="Enter your name" required>
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <div class="input-with-icon">
               <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password" placeholder="••••••••" required>
               <button type="button" class="suffix-icon" (click)="showPassword = !showPassword">
                  {{ showPassword ? '👁️' : '🔒' }}
               </button>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
        
        <p class="footer-text">Already have an account? <a routerLink="/login">Login</a></p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.15), transparent),
                  radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.1), transparent);
    }
    .login-card {
      width: 100%;
      max-width: 450px;
      padding: 2.5rem;
      text-align: center;
    }
    h2 { margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); margin-bottom: 2rem; font-size: 0.9rem; }
    .form-group { text-align: left; margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; }
    
    .input-with-icon { position: relative; display: flex; align-items: center; }
    .suffix-icon { position: absolute; right: 12px; background: none; border: none; color: #94a3b8; cursor: pointer; padding: 4px; font-size: 1.1rem; z-index: 10; }

    input {
      width: 100%;
      padding: 0.75rem 1rem;
      padding-right: 3rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      outline: none;
      transition: border 0.3s;
    }
    input:focus { border-color: var(--primary); }
    .w-100 { width: 100%; justify-content: center; margin-top: 1rem; }
    .footer-text { margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-muted); }
    a { color: var(--primary); font-weight: 600; cursor: pointer; text-decoration: none; }
  `]
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.loading = true;
    const userData = {
        FullName: this.fullName,
        Email: this.email,
        Password: this.password,
        role: 'STUDENT'
    };
    
    this.authService.register(userData).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Registration failed: ' + err.error.message);
        this.loading = false;
      }
    });
  }
}
