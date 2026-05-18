import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { ProgressService } from '../../core/services/progress.service';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { resolveMediaUrl } from '../../core/utils/url.helper';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dashboard-wrapper">
      <!-- SIDEBAR -->
      <aside class="glass sidebar" [class.mobile-open]="mobileMenuOpen">
        <div class="sidebar-header">
          <div class="panel-title">Student <span>Panel</span></div>
          <div class="user-mini-profile">
            <div class="mini-avatar" (click)="fileInput.click()">
               <img [src]="resolveMediaUrl(user?.avatarUrl, 'https://ui-avatars.com/api/?name=' + user?.fullName)" alt="Avatar">
               <div class="avatar-overlay-mini">📷</div>
            </div>
            <div class="mini-info">
               <span class="user-name">{{ user?.fullName }}</span>
               <span class="user-role">Learner</span>
            </div>
            <input type="file" #fileInput (change)="onAvatarSelected($event)" hidden accept="image/*">
          </div>
        </div>

        <nav class="nav-menu">
          <button class="nav-item" [class.active]="activeTab === 'overview'" (click)="activeTab = 'overview'">
            <span class="icon">🏠</span> Dashboard
          </button>
          <button class="nav-item" [class.active]="activeTab === 'courses'" (click)="activeTab = 'courses'">
            <span class="icon">📚</span> My Learning
          </button>
          <button class="nav-item" [class.active]="activeTab === 'certificates'" (click)="activeTab = 'certificates'">
            <span class="icon">📜</span> Certificates
          </button>
          <button class="nav-item" [class.active]="activeTab === 'settings'" (click)="activeTab = 'settings'">
            <span class="icon">⚙️</span> Settings
          </button>
        </nav>
      </aside>

      <!-- MOBILE OVERLAY -->
      <div class="mobile-overlay" *ngIf="mobileMenuOpen" (click)="mobileMenuOpen = false"></div>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        <header class="top-bar">
          <button class="mobile-toggle" (click)="mobileMenuOpen = !mobileMenuOpen">☰</button>
          <div class="breadcrumb">
            <span>Pages</span> / <span class="active">{{ activeTab | titlecase }}</span>
          </div>
          <div class="header-actions">
             <button class="btn btn-outline" routerLink="/courses">Explore Courses</button>
          </div>
        </header>

        <div [ngSwitch]="activeTab" class="tab-content animate-fade-in">
          
          <!-- OVERVIEW TAB -->
          <div *ngSwitchCase="'overview'">
             <div class="welcome-card glass">
               <div class="welcome-text">
                 <h1>Welcome back, {{ user?.fullName }}! 👋</h1>
                 <p>You have completed <b>{{ completionRate }}%</b> of your learning goals this month. Keep it up!</p>
               </div>
               <div class="welcome-stats">
                  <div class="mini-stat">
                    <span class="val">{{ enrolledCourses.length }}</span>
                    <span class="lab">Enrolled</span>
                  </div>
                  <div class="mini-stat">
                    <span class="val">{{ completedCount }}</span>
                    <span class="lab">Completed</span>
                  </div>
               </div>
             </div>

             <section class="recent-courses mt-4">
                <div class="section-header">
                  <h2>Continue Learning</h2>
                  <button class="btn-text" (click)="activeTab = 'courses'">View All</button>
                </div>

                <div class="course-grid" *ngIf="enrolledCourses.length > 0; else noRecentCourses">
                  <div *ngFor="let course of enrolledCourses.slice(0, 3)" class="course-card glass hover-lift" [routerLink]="['/learn', course.courseId]">
                    <div class="course-thumb">
                      <img [src]="resolveMediaUrl(course.courseThumbnail)" alt="Course">
                      <div class="course-badge">{{ course.progressPercent }}%</div>
                    </div>
                    <div class="course-info">
                      <h3>{{ course.courseTitle }}</h3>
                      <div class="progress-bar-container">
                        <div class="progress-bar" [style.width.%]="course.progressPercent"></div>
                      </div>
                      <button class="btn btn-primary w-100 mt-2">Resume</button>
                    </div>
                  </div>
                </div>

                <ng-template #noRecentCourses>
                  <div class="empty-state glass mini">
                    <p>You haven't started any courses yet.</p>
                    <button class="btn-text" routerLink="/courses">Browse Catalog</button>
                  </div>
                </ng-template>
             </section>
          </div>

          <!-- COURSES TAB -->
          <div *ngSwitchCase="'courses'">
             <div class="section-header">
               <h1>My Learning Journey</h1>
               <div class="filter-tabs">
                 <button class="filter-btn" [class.active]="currentFilter === 'all'" (click)="currentFilter = 'all'">All Courses</button>
                 <button class="filter-btn" [class.active]="currentFilter === 'active'" (click)="currentFilter = 'active'">In Progress</button>
                 <button class="filter-btn" [class.active]="currentFilter === 'completed'" (click)="currentFilter = 'completed'">Completed</button>
               </div>
             </div>
             
             <div class="course-list-vertical" *ngIf="filteredCourses.length > 0; else noCourses">
               <div *ngFor="let course of filteredCourses" class="list-item glass hover-glow" [routerLink]="['/learn', course.courseId]">
                  <img [src]="resolveMediaUrl(course.courseThumbnail)" alt="thumb">
                  <div class="item-details">
                    <h3>{{ course.courseTitle }}</h3>
                    <p class="status-text">{{ course.status }} • Joined {{ course.enrolledAt | date }}</p>
                    <div class="item-progress">
                       <div class="progress-bar-container"><div class="progress-bar" [style.width.%]="course.progressPercent"></div></div>
                       <span>{{ course.progressPercent }}%</span>
                    </div>
                  </div>
                  <button class="btn btn-primary">Continue</button>
               </div>
             </div>
             <ng-template #noCourses>
               <div class="empty-state glass">
                 <div class="empty-icon">📚</div>
                 <h3>No courses yet</h3>
                 <p>Start your learning journey by exploring our course catalog.</p>
                 <button class="btn btn-primary" routerLink="/courses">Browse Courses</button>
               </div>
             </ng-template>
          </div>

          <div *ngSwitchCase="'certificates'">
            <div class="section-header">
              <h1>My Certificates</h1>
            </div>
            <div class="certificates-grid" *ngIf="certificates.length > 0; else noCertificates">
              <div *ngFor="let cert of certificates" class="cert-card glass">
                 <div class="cert-icon">🎓</div>
                 <div class="cert-body">
                   <h3>{{ cert.courseTitle || 'Course Completion' }}</h3>
                   <p class="cert-num">ID: {{ cert.certificateNumber }}</p>
                   <p class="cert-date">Issued on {{ cert.issuedAt | date }}</p>
                   <div class="cert-actions">
                     <button [routerLink]="['/certificate', cert.certificateNumber]" class="btn btn-primary btn-sm">View Certificate</button>
                   </div>
                 </div>
              </div>
            </div>
            <ng-template #noCertificates>
              <div class="empty-state glass">
                <div class="empty-icon">📜</div>
                <h3>No certificates earned yet</h3>
                <p>Complete a course with 100% progress to earn your official certificate.</p>
                <button class="btn btn-outline" (click)="activeTab = 'courses'">Check Progress</button>
              </div>
            </ng-template>
          </div>

          <!-- SETTINGS TAB -->
          <div *ngSwitchCase="'settings'" class="tab-content settings-pane">
             <header class="top-bar">
                <div class="welcome-text">
                  <h2>Account Settings</h2>
                  <p>Manage your learning profile and security</p>
                </div>
             </header>

             <div class="settings-layout">
                <!-- Avatar Section -->
                <section class="avatar-card glass fade-in">
                   <div class="avatar-wrapper">
                      <img [src]="resolveMediaUrl(user?.avatarUrl, 'https://ui-avatars.com/api/?name=' + user?.fullName)" alt="Avatar" class="profile-avatar">
                      <label class="upload-overlay" title="Upload New Photo">
                         <span class="icon">📷</span>
                         <input type="file" (change)="onAvatarSelected($event)" hidden accept="image/*">
                      </label>
                   </div>
                   <div class="avatar-info">
                      <h3>{{ user?.fullName }}</h3>
                      <p>Learning Student</p>
                      <button class="btn-text-sm" (click)="avatarInput.click()">Change Profile Picture</button>
                      <input #avatarInput type="file" (change)="onAvatarSelected($event)" hidden accept="image/*">
                   </div>
                </section>

                <div class="settings-grid">
                   <!-- Profile Section -->
                   <section class="settings-card glass fade-in">
                      <h3>My Profile</h3>
                      <div class="form-group">
                         <label>Full Name</label>
                         <input type="text" [(ngModel)]="editProfile.fullName" class="form-control" placeholder="Your Name">
                      </div>
                      <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" [value]="user?.email" class="form-control" disabled style="opacity: 0.6; cursor: not-allowed;">
                      </div>
                      <div class="form-group">
                        <label>Bio (Optional)</label>
                        <textarea [(ngModel)]="editProfile.bio" name="bio" class="form-control" rows="3" placeholder="Tell us about yourself..."></textarea>
                      </div>
                      <button class="btn-primary btn-sm" (click)="onUpdateProfile()" [disabled]="loading">Update Profile</button>
                   </section>

                   <!-- Password Section -->
                   <section class="settings-card glass fade-in">
                      <h3>Security & Privacy</h3>
                      
                      <div class="form-group">
                         <label>Current Password</label>
                         <div class="input-with-icon">
                            <input [type]="showPasswords.current ? 'text' : 'password'" [(ngModel)]="passwordForm.currentPassword" class="form-control" placeholder="Current password">
                            <button class="suffix-icon" (click)="showPasswords.current = !showPasswords.current" type="button">
                               {{ showPasswords.current ? '👁️' : '🔒' }}
                            </button>
                         </div>
                      </div>

                      <div class="form-group">
                         <label>New Password</label>
                         <div class="input-with-icon">
                            <input [type]="showPasswords.new ? 'text' : 'password'" [(ngModel)]="passwordForm.newPassword" class="form-control" placeholder="New password">
                            <button class="suffix-icon" (click)="showPasswords.new = !showPasswords.new" type="button">
                               {{ showPasswords.new ? '👁️' : '🔒' }}
                            </button>
                         </div>
                      </div>

                      <div class="form-group">
                         <label>Confirm New Password</label>
                         <div class="input-with-icon">
                            <input [type]="showPasswords.confirm ? 'text' : 'password'" [(ngModel)]="passwordForm.confirmPassword" class="form-control" placeholder="Confirm password">
                            <button class="suffix-icon" (click)="showPasswords.confirm = !showPasswords.confirm" type="button">
                               {{ showPasswords.confirm ? '👁️' : '🔒' }}
                            </button>
                         </div>
                      </div>

                      <button class="btn-outline btn-sm" (click)="onChangePassword()" [disabled]="loading">Change Password</button>
                   </section>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { --sidebar-width: 280px; --primary: #10b981; --primary-hover: #059669; --glass: rgba(15, 23, 42, 0.6); --glass-border: rgba(255, 255, 255, 0.05); }
    .dashboard-wrapper { display: flex; min-height: 100vh; background: radial-gradient(circle at top right, #1e293b, #0f172a); color: #e2e8f0; font-family: 'Inter', sans-serif; }

    /* SIDEBAR */
    .sidebar { width: var(--sidebar-width); background: rgba(15, 23, 42, 0.95); border-right: 1px solid var(--glass-border); display: flex; flex-direction: column; transition: 0.3s; z-index: 1000; height: 100vh; position: fixed; left: 0; top: 0; backdrop-filter: blur(20px); }
    
    .sidebar-header { padding: 2rem 1.5rem; border-bottom: 1px solid var(--glass-border); margin-bottom: 1.5rem; }
    .panel-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 2rem; letter-spacing: -0.5px; }
    .panel-title span { color: var(--primary); }

    .user-mini-profile { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
    .mini-avatar { width: 48px; height: 48px; border-radius: 12px; overflow: hidden; border: 2px solid var(--primary); position: relative; cursor: pointer; }
    .mini-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-overlay-mini { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; font-size: 0.8rem; }
    .mini-avatar:hover .avatar-overlay-mini { opacity: 1; }
    
    .mini-info { display: flex; flex-direction: column; gap: 2px; }
    .user-name { font-weight: 700; color: #fff; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }
    .user-role { font-size: 0.75rem; color: var(--primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    .nav-menu { flex: 1; padding: 0 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.2rem; border-radius: 12px; border: none; background: transparent; color: #94a3b8; cursor: pointer; transition: 0.3s; font-weight: 600; text-align: left; width: 100%; }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .nav-item.active { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2); }
    .nav-item .icon { font-size: 1.2rem; }

    /* MAIN CONTENT */
    .main-content { flex: 1; margin-left: var(--sidebar-width); padding: 2rem 3rem; min-width: 0; }
    .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem; }
    .breadcrumb { font-size: 0.9rem; color: #64748b; }
    .breadcrumb .active { color: white; font-weight: 600; }
    .mobile-toggle { display: none; background: var(--glass); border: 1px solid var(--glass-border); color: white; padding: 0.5rem 0.8rem; border-radius: 8px; font-size: 1.2rem; cursor: pointer; z-index: 1001; }
    .mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 998; animation: fadeIn 0.3s ease; }

    /* Settings Styles */
    .settings-pane { padding-top: 1rem; }
    .settings-layout { display: flex; flex-direction: column; gap: 2.5rem; }
    .avatar-card { display: flex; align-items: center; gap: 2.5rem; padding: 2.5rem; border-radius: 30px; border: 1px solid var(--glass-border); }
    .avatar-wrapper { position: relative; width: 120px; height: 120px; border-radius: 50%; border: 3px solid var(--primary); padding: 5px; }
    .profile-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
    .upload-overlay { position: absolute; inset: 5px; background: rgba(0,0,0,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; cursor: pointer; }
    .avatar-wrapper:hover .upload-overlay { opacity: 1; }
    .avatar-info h3 { font-size: 1.8rem; margin: 0; color: #fff; font-weight: 800; }
    .avatar-info p { color: var(--primary); font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin: 0.3rem 0 1rem; }
    .btn-text-sm { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; font-size: 0.85rem; padding: 0; }
    .btn-text-sm:hover { color: #fff; text-decoration: underline; }

    .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2.5rem; }
    .settings-card { padding: 2.5rem; border-radius: 24px; border: 1px solid var(--glass-border); }
    .settings-card h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 2rem; color: #fff; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.6rem; color: #94a3b8; font-size: 0.85rem; font-weight: 600; }
    .form-control { width: 100%; padding: 1rem; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; outline: none; transition: 0.3s; }
    .form-control:focus { border-color: var(--primary); }

    .input-with-icon { position: relative; display: flex; align-items: center; }
    .suffix-icon { position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; padding: 0.5rem; font-size: 1.1rem; filter: grayscale(1); opacity: 0.6; transition: opacity 0.2s; color: white; }
    .suffix-icon:hover { opacity: 1; }

    .btn-primary { background: var(--primary); color: #fff; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2); }
    .btn-primary:hover { background: var(--primary-hover); transform: translateY(-2px); }
    .btn-outline { border: 1px solid rgba(255,255,255,0.1); color: #fff; background: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
    .btn-outline:hover { background: rgba(255,255,255,0.05); border-color: var(--primary); }
    .btn-sm { font-size: 0.85rem; }

    .glass { background: var(--glass); backdrop-filter: blur(20px); }
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* OVERVIEW & COURSES STYLES */
    .welcome-card { display: flex; justify-content: space-between; align-items: center; padding: 2.5rem; border-radius: 24px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); border: 1px solid var(--glass-border); }
    .welcome-text h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .welcome-text p { color: #94a3b8; font-size: 1.1rem; }
    .welcome-stats { display: flex; gap: 2rem; }
    .mini-stat { text-align: center; }
    .mini-stat .val { display: block; font-size: 2rem; font-weight: 800; color: var(--primary); }
    .mini-stat .lab { font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    
    .filter-tabs { display: flex; gap: 0.5rem; background: rgba(255,255,255,0.03); padding: 0.4rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
    .filter-btn { padding: 0.5rem 1.2rem; border-radius: 8px; border: none; background: transparent; color: #64748b; cursor: pointer; transition: 0.3s; font-weight: 600; font-size: 0.85rem; }
    .filter-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
    .filter-btn.active { background: var(--primary); color: white; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2); }

    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .btn-text { background: none; border: none; color: var(--primary); font-weight: 600; cursor: pointer; }

    .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .course-card { border-radius: 20px; overflow: hidden; cursor: pointer; border: 1px solid var(--glass-border); transition: 0.3s; }
    .course-thumb { position: relative; height: 180px; }
    .course-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .course-badge { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; backdrop-filter: blur(4px); }
    .course-info { padding: 1.5rem; }
    .course-info h3 { font-size: 1.1rem; margin-bottom: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .progress-bar-container { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
    .progress-bar { height: 100%; background: var(--primary); border-radius: 10px; transition: width 1s ease-in-out; }

    .course-list-vertical { display: flex; flex-direction: column; gap: 1rem; }
    .list-item { display: flex; align-items: center; gap: 1.5rem; padding: 1.2rem; border-radius: 16px; border: 1px solid var(--glass-border); cursor: pointer; transition: 0.3s; }
    .list-item img { width: 100px; height: 60px; border-radius: 8px; object-fit: cover; }
    .item-details { flex: 1; }
    .item-details h3 { font-size: 1.1rem; margin-bottom: 0.3rem; }
    .status-text { font-size: 0.8rem; color: #64748b; margin-bottom: 0.8rem; }
    .item-progress { display: flex; align-items: center; gap: 1rem; font-size: 0.85rem; color: #94a3b8; }
    .item-progress .progress-bar-container { flex: 1; max-width: 200px; }

    .empty-state { padding: 4rem; text-align: center; border-radius: 24px; border: 1px dashed var(--glass-border); }
    .empty-state.mini { padding: 2rem; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }

    /* Certificates Grid */
    .certificates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .cert-card { padding: 2rem; border-radius: 20px; text-align: center; border: 1px solid var(--glass-border); position: relative; overflow: hidden; }
    .cert-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--primary); }
    .cert-icon { font-size: 3rem; margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.4)); }
    .cert-body h3 { font-size: 1.2rem; margin-bottom: 0.5rem; color: #fff; }
    .cert-num { font-size: 0.75rem; color: #64748b; font-family: monospace; margin-bottom: 0.2rem; }
    .cert-date { font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem; }
    .cert-actions { display: flex; justify-content: center; }
    @media (max-width: 1024px) {
      .sidebar { position: fixed; left: 0; top: 0; bottom: 0; width: 280px; z-index: 999; transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); height: 100vh; }
      .sidebar.mobile-open { transform: translateX(0); box-shadow: 20px 0 50px rgba(0,0,0,0.5); }
      .main-content { margin-left: 0; padding: 1.5rem; width: 100%; }
      .mobile-toggle { display: block; margin-right: 1rem; }
      .top-bar { justify-content: flex-start; }
      .settings-grid { grid-template-columns: 1fr; }
      .avatar-card { flex-direction: column; text-align: center; gap: 1.5rem; }
      .welcome-card { flex-direction: column; text-align: center; gap: 2rem; }
      .welcome-stats { width: 100%; justify-content: space-around; }
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  resolveMediaUrl = resolveMediaUrl;
  activeTab = 'overview';
  mobileMenuOpen = false;
  loading = false;
  user: any;
  enrolledCourses: any[] = [];
  certificates: any[] = [];
  currentFilter: 'all' | 'active' | 'completed' = 'all';
  
  // Stats
  completedCount = 0;
  completionRate = 0;

  // Settings
  editProfile = { fullName: '', bio: '' };
  passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  showPasswords = { current: false, new: false, confirm: false };

  constructor(
    private enrollmentService: EnrollmentService,
    private progressService: ProgressService,
    private authService: AuthService,
    private router: Router
  ) {}

  resolveThumb(url: string | null | undefined): string {
    return resolveMediaUrl(url);
  }

  get filteredCourses() {
    if (this.currentFilter === 'active') {
      return this.enrolledCourses.filter(c => c.progressPercent < 100);
    } else if (this.currentFilter === 'completed') {
      return this.enrolledCourses.filter(c => c.progressPercent === 100);
    }
    return this.enrolledCourses;
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.editProfile.fullName = user.fullName || '';
        // Bio is not in auth yet, but we'll simulate it or it can be added later
      }
    });

    this.loadEnrollments();
    this.loadCertificates();
  }

  loadCertificates() {
    this.progressService.getMyCertificates().subscribe({
      next: (res) => {
        this.certificates = res.data;
      },
      error: (err) => console.error('Failed to load certificates', err)
    });
  }

  loadEnrollments() {
    this.enrollmentService.getMyEnrollments().subscribe({
      next: (res) => {
        this.enrolledCourses = res.data;
        this.calculateStats();
      },
      error: (err) => console.error('Failed to load enrollments', err)
    });
  }

  calculateStats() {
    if (this.enrolledCourses.length === 0) return;
    this.completedCount = this.enrolledCourses.filter(c => c.progressPercent === 100).length;
    const totalProgress = this.enrolledCourses.reduce((sum, c) => sum + c.progressPercent, 0);
    this.completionRate = Math.round(totalProgress / this.enrolledCourses.length);
  }

  onUpdateProfile() {
    this.loading = true;
    this.authService.updateProfile(this.editProfile).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.loading = false;
      },
      error: (err) => {
        alert('Failed to update profile: ' + (err.error?.message || 'Unknown error'));
        this.loading = false;
      }
    });
  }

  onChangePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    this.loading = true;
    this.authService.changePassword(this.passwordForm).subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.loading = false;
      },
      error: (err) => {
        alert('Failed to change password: ' + (err.error?.message || 'Unknown error'));
        this.loading = false;
      }
    });
  }

  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.authService.uploadAvatar(file).subscribe({
        next: (res) => {
          if (this.user) {
             this.user.avatarUrl = res.data.url; 
             this.authService.updateCurrentUser(this.user);
          }
          alert('Avatar uploaded successfully!');
        },
        error: (err) => alert('Avatar upload failed')
      });
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
