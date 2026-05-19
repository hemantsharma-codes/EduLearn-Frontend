import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="glass login-card">
        <h2>Welcome Back</h2>
        <p class="subtitle">Login to continue your learning journey</p>
        
        <form *ngIf="!forgotMode" (ngSubmit)="onLogin()">
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
            <div class="forgot-link">
               <a (click)="forgotMode = true">Forgot Password?</a>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>

          <div class="divider">
            <span>OR</span>
          </div>

          <button type="button" class="btn btn-outline w-100 google-btn" (click)="redirectToGoogle()">
            <svg xmlns="http://www.w3.org/2000/api/svg" viewBox="0 0 48 48" width="20px" height="20px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C40.483,35.58,44,30.2,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Sign in with Google
          </button>
        </form>

        <!-- Forgot Password / Reset Steps -->
        <div *ngIf="forgotMode" class="forgot-view fade-in">
          <div *ngIf="!resetStep">
            <h2>Forgot Password?</h2>
            <p class="subtitle">Enter your email to verify your account</p>
            
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" [(ngModel)]="resetEmail" name="resetEmail" placeholder="Enter your registered email" required>
            </div>
            
            <button (click)="handleVerifyEmail()" class="btn btn-primary w-100" [disabled]="loading">
              {{ loading ? 'Verifying...' : 'Verify Email' }}
            </button>
          </div>

          <div *ngIf="resetStep">
            <h2>Set New Password</h2>
            <p class="subtitle">Email verified! Now choose a strong password</p>
            
            <div class="form-group">
              <label>New Password</label>
              <input type="password" [(ngModel)]="newPassword" name="newPassword" placeholder="••••••••" required>
            </div>
            
            <button (click)="handleResetFinal()" class="btn btn-primary w-100" [disabled]="loading">
              {{ loading ? 'Updating...' : 'Reset Password' }}
            </button>
          </div>
          
          <button (click)="cancelReset()" class="btn-text w-100 mt-3">Back to Login</button>
        </div>
        
        <p class="footer-text">Don't have an account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.15), transparent),
                  radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.1), transparent);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
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
    .footer-text { margin-top: 1.5rem; font-size: 0.85rem; color: #94a3b8; }
    .forgot-link { text-align: right; margin-top: 0.5rem; }
    .forgot-link a { font-size: 0.8rem; color: #94a3b8; font-weight: 500; cursor: pointer; transition: 0.3s; }
    .forgot-link a:hover { color: var(--primary); }
    .btn-text { background: none; border: none; color: #94a3b8; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
    .btn-text:hover { color: #fff; }
    .mt-3 { margin-top: 1rem; }
    .fade-in { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    a { color: var(--primary); font-weight: 600; cursor: pointer; text-decoration: none; }

    /* New Google Login Styles */
    .divider { margin: 1.5rem 0; display: flex; align-items: center; gap: 1rem; color: #64748b; font-size: 0.8rem; font-weight: 600; }
    .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
    
    .google-btn { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 0.8rem; 
      background: rgba(255, 255, 255, 0.03); 
      border: 1px solid rgba(255, 255, 255, 0.1); 
      padding: 0.8rem; 
      border-radius: 12px; 
      font-weight: 600; 
      color: white;
      cursor: pointer;
      transition: all 0.3s ease; 
    }
    .google-btn img { width: 20px; height: 20px; }
    .google-btn:hover { 
      background: rgba(255, 255, 255, 0.08); 
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .google-btn:active { transform: translateY(0); }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  resetEmail = '';
  newPassword = '';
  resetToken = '';
  loading = false;
  showPassword = false;
  forgotMode = false;
  resetStep = false;

  constructor(private authService: AuthService, private router: Router) {}

  redirectToGoogle() {
    window.location.href = `${environment.apiUrl}/auth/google-login`;
  }

  onLogin() {
    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        const role = response.data.user.role.toLowerCase();
        this.router.navigate([`/dashboard/${role}`]);
      },
      error: (err) => {
        alert('Login failed: ' + err.error.message);
        this.loading = false;
      }
    });
  }

  handleVerifyEmail() {
    if (!this.resetEmail) return;
    this.loading = true;
    this.authService.forgotPassword(this.resetEmail).subscribe({
      next: (res: any) => {
        this.resetToken = res.data.resetToken;
        this.resetStep = true;
        this.loading = false;
      },
      error: (err: any) => {
        alert(err.error?.message || 'Verification failed');
        this.loading = false;
      }
    });
  }

  handleResetFinal() {
    if (!this.newPassword) return;
    this.loading = true;
    this.authService.resetPassword({
      email: this.resetEmail,
      token: this.resetToken,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        alert('Password changed successfully! You can now login.');
        this.cancelReset();
        this.loading = false;
      },
      error: (err: any) => {
        alert(err.error?.message || 'Reset failed');
        this.loading = false;
      }
    });
  }

  cancelReset() {
    this.forgotMode = false;
    this.resetStep = false;
    this.resetEmail = '';
    this.newPassword = '';
    this.resetToken = '';
  }
}
