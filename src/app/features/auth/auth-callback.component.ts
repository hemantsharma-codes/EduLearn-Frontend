import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="loader-card glass">
        <div class="spinner"></div>
        <h2>Authenticating with Google...</h2>
        <p>Please wait while we secure your session.</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: white; }
    .loader-card { padding: 3rem; border-radius: 24px; text-align: center; max-width: 400px; width: 90%; }
    .spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #10b981; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 2rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { margin-bottom: 1rem; }
    p { color: #94a3b8; }
    .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
  `]
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.handleExternalLogin(token).subscribe({
          next: (response) => {
            if (response.success) {
              const role = response.data.role.toLowerCase();
              this.router.navigate([`/dashboard/${role}`]);
            } else {
              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            console.error('External login error:', err);
            this.router.navigate(['/login']);
          }
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
