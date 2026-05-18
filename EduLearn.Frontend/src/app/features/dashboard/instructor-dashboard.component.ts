import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { resolveMediaUrl } from '../../core/utils/url.helper';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="panel-title">Instructor <span>Panel</span></div>
          <div class="user-mini-profile">
            <div class="mini-avatar">
               <img [src]="resolveMediaUrl(profileData.avatarUrl, 'https://ui-avatars.com/api/?name=' + profileData.fullName)" alt="U">
            </div>
            <div class="mini-info">
               <span class="user-name">{{ profileData.fullName }}</span>
               <span class="user-role">Lead Instructor</span>
            </div>
          </div>
        </div>
        <nav>
          <button (click)="activeTab = 'overview'" [class.active]="activeTab === 'overview'">📊 Overview</button>
          <button (click)="activeTab = 'courses'" [class.active]="activeTab === 'courses'">📚 My Courses</button>
          <button (click)="activeTab = 'profile'" [class.active]="activeTab === 'profile'">⚙️ Settings</button>
        </nav>
      </aside>

      <main class="content">
        <div class="main-layout" [ngSwitch]="activeTab">
           
           <!-- Overview / Welcome Tab -->
           <div *ngSwitchCase="'overview'" class="tab-content welcome-pane">
              <header class="top-bar">
                 <div class="welcome-text">
                   <h2>Welcome back, {{ profileData.fullName }}!</h2>
                   <p>What would you like to build today?</p>
                 </div>
              </header>
              <div class="quick-actions-grid">
                 <div class="action-card" (click)="activeTab = 'courses'">
                    <span class="icon">📚</span>
                    <h4>View My Courses</h4>
                    <p>Manage your existing content and drafts</p>
                 </div>
                 <div class="action-card" routerLink="/instructor/courses/new">
                    <span class="icon">✨</span>
                    <h4>{{ courses.length === 0 ? 'Create your first Course' : 'Create New Course' }}</h4>
                    <p>Start building a new learning experience</p>
                 </div>
              </div>
           </div>

           <!-- My Courses Tab -->
           <div *ngSwitchCase="'courses'" class="tab-content">
              <header class="top-bar">
                 <div class="welcome-text">
                   <h2>My Course Library</h2>
                   <p>Track, manage, and publish your content</p>
                 </div>
                 <button class="btn-primary" routerLink="/instructor/courses/new">
                   <span class="icon">+</span> New Course
                 </button>
              </header>

              <div class="courses-section">
                <div class="section-header-row">
                   <div class="title-group">
                      <h3>Active Catalog</h3>
                      <span class="count-badge">{{ courses.length }} Courses</span>
                      <button class="btn-refresh" (click)="loadInstructorCourses()" title="Refresh List">🔄</button>
                   </div>
                   <div class="filter-group">
                     <span class="filter" [class.active]="activeFilter === 'all'" (click)="activeFilter = 'all'">All</span>
                     <span class="filter" [class.active]="activeFilter === 'published'" (click)="activeFilter = 'published'">Published</span>
                     <span class="filter" [class.active]="activeFilter === 'drafts'" (click)="activeFilter = 'drafts'">Drafts</span>
                   </div>
                </div>

                <div class="course-list-instructor" *ngIf="filteredCourses.length > 0; else noCourses">
                   <div *ngFor="let course of filteredCourses" class="glass course-row" [class.active-row]="menuOpenId === course.courseId">
                     <div class="course-info-main">
                       <div class="thumb-container">
                          <img [src]="resolveMediaUrl(course.thumbnailUrl)" alt="thumb">
                       </div>
                       <div class="details">
                         <h4>{{ course.title }}</h4>
                         <p>{{ course.category }} • {{ course.enrollmentCount || 0 }} Enrolled</p>
                       </div>
                     </div>
                     <div class="status-col">
                       <span class="status-badge" [class.published]="course.isPublished" [class.draft]="!course.isPublished">
                         {{ course.isPublished ? 'Published' : 'Draft' }}
                       </span>
                     </div>
                     <div class="actions">
                       <button class="btn btn-outline btn-sm" [routerLink]="['/instructor/courses', course.courseId, 'curriculum']">Curriculum</button>
                       <div class="menu-container" [class.active]="menuOpenId === course.courseId">
                         <button class="btn btn-icon" (click)="toggleMenu(course.courseId)">⋮</button>
                         <div class="simple-dropdown" *ngIf="menuOpenId === course.courseId">
                           <button (click)="onPublish(course.courseId)" [disabled]="course.isPublished">Publish Course</button>
                           <button [routerLink]="['/instructor/courses', course.courseId, 'edit']">Edit Details</button>
                           <button (click)="onDelete(course.courseId)" class="text-danger">Delete Course</button>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>

                <ng-template #noCourses>
                   <div class="empty-state">
                     <div class="empty-icon">📂</div>
                     <h3>No courses found</h3>
                     <p>You haven't created any courses yet. Start your journey today!</p>
                     <button class="btn-primary btn-sm" style="margin-top: 1.5rem;" routerLink="/instructor/courses/new">+ Create Your First Course</button>
                   </div>
                </ng-template>
              </div>
           </div>

           <!-- Settings Tab -->
           <div *ngSwitchCase="'profile'" class="tab-content settings-pane">
              <header class="top-bar">
                 <div class="welcome-text">
                   <h2>Account Settings</h2>
                   <p>Manage your public profile and account security</p>
                 </div>
              </header>

              <div class="settings-layout">
                 <!-- Avatar Section -->
                 <section class="avatar-card glass">
                    <div class="avatar-wrapper">
                       <img [src]="resolveMediaUrl(profileData.avatarUrl, 'https://ui-avatars.com/api/?name=' + profileData.fullName)" alt="Avatar" class="profile-avatar">
                       <label class="upload-overlay" title="Upload New Photo">
                          <span class="icon">📷</span>
                          <input type="file" (change)="onAvatarSelected($event)" hidden accept="image/*">
                       </label>
                    </div>
                    <div class="avatar-info">
                       <h3>{{ profileData.fullName }}</h3>
                       <p>Instructor Account</p>
                       <button class="btn-text-sm" (click)="avatarInput.click()">Change Photo</button>
                       <input #avatarInput type="file" (change)="onAvatarSelected($event)" hidden accept="image/*">
                    </div>
                 </section>

                 <div class="settings-grid">
                    <!-- Profile Section -->
                    <section class="settings-card glass">
                       <h3>Public Profile</h3>
                       <div class="form-group">
                          <label>Full Name</label>
                          <input type="text" [(ngModel)]="profileData.fullName" class="form-control" placeholder="Your Full Name">
                       </div>
                       <p class="hint-text">Updating your name will change how it appears to students.</p>
                       <button class="btn-primary btn-sm" (click)="onUpdateProfile()">Update Profile</button>
                    </section>

                    <!-- Password Section -->
                    <section class="settings-card glass">
                       <h3>Security & Password</h3>
                       
                       <div class="form-group">
                          <label>Current Password</label>
                          <div class="input-with-icon">
                             <input [type]="showCurrent ? 'text' : 'password'" [(ngModel)]="passwordData.oldPassword" class="form-control" placeholder="Current password">
                             <button class="suffix-icon" (click)="showCurrent = !showCurrent" type="button">
                                {{ showCurrent ? '👁️' : '🔒' }}
                             </button>
                          </div>
                       </div>

                       <div class="form-group">
                          <label>New Password</label>
                          <div class="input-with-icon">
                             <input [type]="showNew ? 'text' : 'password'" [(ngModel)]="passwordData.newPassword" class="form-control" placeholder="New password">
                             <button class="suffix-icon" (click)="showNew = !showNew" type="button">
                                {{ showNew ? '👁️' : '🔒' }}
                             </button>
                          </div>
                       </div>

                       <div class="form-group">
                          <label>Confirm New Password</label>
                          <div class="input-with-icon">
                             <input [type]="showConfirm ? 'text' : 'password'" [(ngModel)]="passwordData.confirmPassword" class="form-control" placeholder="Confirm password">
                             <button class="suffix-icon" (click)="showConfirm = !showConfirm" type="button">
                                {{ showConfirm ? '👁️' : '🔒' }}
                             </button>
                          </div>
                       </div>

                       <button class="btn-outline btn-sm" (click)="onChangePassword()">Change Password</button>
                    </section>
                 </div>
              </div>
           </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; min-height: 100vh; background: radial-gradient(circle at top right, #1e293b, #0f172a); color: #f1f5f9; font-family: 'Inter', sans-serif; }
    .sidebar { width: 280px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(30px); padding: 2rem; border-right: 1px solid rgba(255,255,255,0.05); position: sticky; top: 0; height: 100vh; z-index: 1000; }
    
    .sidebar-header { margin-bottom: 3.5rem; }
    .panel-title { font-size: 1.4rem; font-weight: 900; color: #fff; letter-spacing: -0.5px; margin-bottom: 1.8rem; }
    .panel-title span { color: #10b981; }
    
    .user-mini-profile { display: flex; align-items: center; gap: 1rem; padding: 1.2rem; background: rgba(255,255,255,0.03); border-radius: 18px; border: 1px solid rgba(255,255,255,0.05); }
    .mini-avatar { width: 42px; height: 42px; border-radius: 12px; overflow: hidden; border: 1px solid #10b981; }
    .mini-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .mini-info { display: flex; flex-direction: column; }
    .user-name { font-size: 0.9rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
    .user-role { font-size: 0.7rem; color: #10b981; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    
    nav { display: flex; flex-direction: column; gap: 0.8rem; }
    nav button { padding: 1.2rem; color: #94a3b8; text-align: left; background: none; border: none; border-radius: 14px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-weight: 500; font-size: 1rem; width: 100%; }
    nav button:hover { background: rgba(255,255,255,0.03); color: #fff; transform: translateX(5px); }
    nav button.active { background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05)); color: #10b981; box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.2); }

    .welcome-pane { padding: 2rem 0; animation: fadeIn 0.5s ease-out; }
    .quick-actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.5rem; margin-top: 3rem; }
    .action-card { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(10px); padding: 3rem; border-radius: 30px; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-align: center; }
    .action-card:hover { transform: translateY(-10px); background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.3); }
    .action-card .icon { font-size: 3.5rem; display: block; margin-bottom: 1.5rem; }
    .action-card h4 { font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 0.8rem; }
    .action-card p { color: #64748b; font-size: 1rem; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .content { flex: 1; padding: 4rem; overflow-y: auto; }
    .top-bar { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
    .welcome-text h2 { font-size: 2.5rem; font-weight: 800; margin: 0; color: #fff; letter-spacing: -1px; }
    .welcome-text p { color: #64748b; margin: 0.5rem 0 0; font-size: 1.1rem; }
    
    .courses-section { background: rgba(30, 41, 59, 0.3); padding: 2.5rem; border-radius: 30px; border: 1px solid rgba(255,255,255,0.03); }

    /* Earnings Specific Styles */
    .earnings-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 2.5rem; }
    .stat-card { padding: 2.5rem; border-radius: 24px; display: flex; flex-direction: column; gap: 0.5rem; transition: 0.3s; background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255,255,255,0.05); }
    .stat-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.05); }
    .stat-card.gold { border-left: 5px solid #fbbf24; background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), transparent); }
    .stat-card.primary { border-left: 5px solid #10b981; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent); }
    .stat-label { font-size: 0.85rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .stat-value { font-size: 2.2rem; font-weight: 900; color: #fff; }
    .stat-trend { font-size: 0.85rem; font-weight: 700; }
    .stat-trend.positive { color: #10b981; }
    .stat-hint { font-size: 0.8rem; color: #64748b; }

    .transactions-section { padding: 2.5rem; border-radius: 24px; background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255,255,255,0.05); }
    .table-container { overflow-x: auto; margin-top: 1.5rem; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th { padding: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: #64748b; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
    .data-table td { padding: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 0.95rem; }
    .data-table .amt { font-weight: 700; color: #10b981; }
    .data-table .amt.neg { color: #f43f5e; }
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
    .badge.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .badge.pending { background: rgba(251, 191, 36, 0.1); color: #fbbf24; }
    .section-header { display: flex; justify-content: space-between; align-items: center; }

    .mt-4 { margin-top: 2rem; }
    .btn-text { background: none; border: none; color: #10b981; font-weight: 600; cursor: pointer; }

    .empty-transactions { padding: 3rem; text-align: center; color: #64748b; }
    .empty-transactions .icon { font-size: 3rem; display: block; margin-bottom: 1rem; opacity: 0.3; }
    .section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
    
    .title-group { display: flex; align-items: center; gap: 1rem; }
    .title-group h3 { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
    .count-badge { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.3rem 0.8rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.2); }

    .filter-group { display: flex; background: rgba(15, 23, 42, 0.6); padding: 0.4rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
    .filter { padding: 0.6rem 1.5rem; cursor: pointer; border-radius: 10px; font-size: 0.85rem; color: #94a3b8; font-weight: 600; transition: all 0.2s; }
    .filter.active { background: #10b981; color: #fff; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }

    .course-list-instructor { display: flex; flex-direction: column; gap: 1.2rem; }
    .course-row { position: relative; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1; }
    .course-row:hover { background: rgba(30, 41, 59, 0.6); border-color: rgba(16, 185, 129, 0.3); transform: scale(1.01); }
    .course-row.active-row { z-index: 100 !important; border-color: rgba(16, 185, 129, 0.5); }
    
    .course-info-main { display: flex; gap: 1.8rem; align-items: center; }
    .thumb-container { width: 80px; height: 80px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05); }
    .thumb-container img { width: 100%; height: 100%; object-fit: cover; }
    
    .details h4 { margin: 0; color: #fff; font-size: 1.2rem; font-weight: 700; }
    .details p { margin: 0.5rem 0 0; color: #64748b; font-size: 0.9rem; font-weight: 500; }

    .status-col { text-align: center; }
    .status-badge { padding: 0.6rem 1.5rem; border-radius: 30px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; }
    .published { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .draft { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }

    .actions { display: flex; gap: 1.5rem; align-items: center; }
    .menu-container { position: relative; }

    .btn-icon { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #94a3b8; font-size: 1.4rem; cursor: pointer; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 14px; transition: all 0.2s; }
    .btn-icon:hover { background: #10b981; color: #fff; border-color: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }

    .simple-dropdown { position: absolute; right: 0; top: 110%; width: 200px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; z-index: 1000; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    .simple-dropdown button { width: 100%; padding: 1.1rem 1.5rem; text-align: left; background: none; border: none; color: #f1f5f9; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .simple-dropdown button:hover:not(:disabled) { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    .btn-primary { background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; padding: 1.1rem 2.5rem; border-radius: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); transition: all 0.3s; font-size: 1rem; }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4); }
    .btn-outline { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 0.8rem 1.8rem; border-radius: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
    .btn-outline:hover { background: #fff; color: #0f172a; border-color: #fff; }

    /* Settings Styles */
    .avatar-card { display: flex; align-items: center; gap: 2.5rem; padding: 2.5rem; border-radius: 30px; margin-bottom: 2.5rem; border: 1px solid rgba(255,255,255,0.05); }
    .avatar-wrapper { position: relative; width: 120px; height: 120px; border-radius: 50%; border: 3px solid #10b981; padding: 5px; box-shadow: 0 0 30px rgba(16, 185, 129, 0.2); }
    .profile-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
    .upload-overlay { position: absolute; inset: 5px; background: rgba(0,0,0,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; cursor: pointer; }
    .avatar-wrapper:hover .upload-overlay { opacity: 1; }
    .avatar-info h3 { font-size: 1.8rem; margin: 0; color: #fff; font-weight: 800; }
    .avatar-info p { color: #10b981; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin: 0.3rem 0 1rem; }
    .btn-text-sm { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; font-size: 0.85rem; padding: 0; }
    .btn-text-sm:hover { color: #fff; text-decoration: underline; }

    .settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.5rem; }
    .settings-card { padding: 2.5rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); }
    .settings-card h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 2rem; color: #fff; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.6rem; color: #94a3b8; font-size: 0.85rem; font-weight: 600; }
    .form-control { width: 100%; padding: 1rem; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; outline: none; }
    .form-control:focus { border-color: #10b981; }
    .hint-text { font-size: 0.8rem; color: #64748b; margin: -1rem 0 1.5rem; }

    /* Input Icons */
    .input-with-icon { position: relative; display: flex; align-items: center; }
    .suffix-icon { position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; padding: 0.5rem; font-size: 1.1rem; filter: grayscale(1); opacity: 0.6; transition: opacity 0.2s; }
    .suffix-icon:hover { opacity: 1; }
    .form-control { padding-right: 3rem; }

    .empty-state { text-align: center; padding: 6rem 0; color: #64748b; background: rgba(15, 23, 42, 0.2); border-radius: 20px; border: 1px dashed rgba(255,255,255,0.1); }
    .empty-state h3 { color: #fff; margin: 1rem 0 0.5rem; }
    .btn-refresh { background: none; border: none; font-size: 1.2rem; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; margin-left: 0.5rem; }
    .btn-refresh:hover { opacity: 1; transform: rotate(180deg); }
    .text-danger { color: #ef4444 !important; }
  `]
})
export class InstructorDashboardComponent implements OnInit {
  resolveMediaUrl = resolveMediaUrl;
  activeTab = 'overview';
  activeFilter = 'all';
  courses: any[] = [];
  menuOpenId: number | null = null;
  profileData = { fullName: '', avatarUrl: '' };
  passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
  stats: any = {};
  
  // Visibility toggles
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadInstructorCourses();
    this.loadProfile();

    // Reset to courses tab if navigating to dashboard fresh or from navbar
    this.route.queryParams.subscribe((params: any) => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  get filteredCourses(): any[] {
    if (this.activeFilter === 'published') return this.courses.filter(c => c.isPublished);
    if (this.activeFilter === 'drafts') return this.courses.filter(c => !c.isPublished);
    return this.courses;
  }

  resolveThumb(url: string): string {
    return resolveMediaUrl(url);
  }

  loadInstructorCourses() {
    this.courseService.getInstructorCourses().subscribe({
      next: (res: any) => {
        this.courses = res.data || [];
        console.log('Courses loaded:', this.courses);
      },
      error: (err: any) => alert('Failed to load courses. Please check your connection.')
    });
  }

  requestPayout() {
    alert('Payout request submitted! It will be processed within 3-5 business days.');
  }

  loadProfile() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.profileData.fullName = user.fullName;
        this.profileData.avatarUrl = user.avatarUrl;
      }
    });
  }

  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.authService.uploadAvatar(file).subscribe({
        next: (res: any) => {
          this.profileData.avatarUrl = res.data.url;
          this.authService.updateCurrentUser({ ...this.authService.currentUserValue, avatarUrl: res.data.url });
        },
        error: () => alert('Failed to upload avatar')
      });
    }
  }

  toggleMenu(id: number) {
    this.menuOpenId = this.menuOpenId === id ? null : id;
  }

  onPublish(id: number) {
    if (confirm('Publish this course? It will be sent for approval.')) {
      this.courseService.publishCourse(id).subscribe({
        next: () => {
          alert('Course submitted for approval.');
          this.menuOpenId = null;
          this.loadInstructorCourses();
        },
        error: (err: any) => alert('Failed to publish')
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          alert('Course deleted successfully.');
          this.menuOpenId = null;
          this.loadInstructorCourses();
        },
        error: (err: any) => alert('Failed to delete')
      });
    }
  }

  onUpdateProfile() {
    this.authService.updateProfile(this.profileData).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.authService.updateCurrentUser({ ...this.authService.currentUserValue, fullName: this.profileData.fullName });
      },
      error: () => alert('Failed to update profile')
    });
  }

  onChangePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    const changePwdDto = {
      oldPassword: this.passwordData.oldPassword,
      newPassword: this.passwordData.newPassword
    };

    this.authService.changePassword(changePwdDto).subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || 'Failed to change password.';
        alert(errorMsg);
      }
    });
  }
}
