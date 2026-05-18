import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { resolveMediaUrl } from '../../core/utils/url.helper';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="panel-title">Admin <span>Portal</span></div>
          <div class="user-mini-profile">
            <div class="mini-avatar">
               <img [src]="resolveMediaUrl(profileData.avatarUrl, 'https://ui-avatars.com/api/?name=' + profileData.fullName)" alt="A">
            </div>
            <div class="mini-info">
               <span class="user-name">{{ profileData.fullName }}</span>
               <span class="user-role">System Admin</span>
            </div>
          </div>
        </div>
        <nav>
          <button (click)="activeTab = 'overview'" [class.active]="activeTab === 'overview'">📊 Overview</button>
          <button (click)="activeTab = 'approvals'" [class.active]="activeTab === 'approvals'">⚖️ Pending Approvals</button>
          <button (click)="activeTab = 'courses'" [class.active]="activeTab === 'courses'">📚 Manage All Courses</button>
          <button (click)="activeTab = 'users'" [class.active]="activeTab === 'users'">👥 User Management</button>
          <button (click)="activeTab = 'settings'" [class.active]="activeTab === 'settings'">⚙️ System Settings</button>
        </nav>
      </aside>

      <main class="content">
        <div class="main-layout" [ngSwitch]="activeTab">
          
          <!-- Overview Tab -->
          <div *ngSwitchCase="'overview'" class="tab-content fade-in">
            <header class="top-bar">
               <h2>Welcome back, {{ profileData.fullName }}!</h2>
               <p>Here is what's happening on the platform today.</p>
            </header>
            
            <div class="stats-grid">
               <div class="stat-card glass">
                  <span class="icon">📚</span>
                  <div class="stat-info">
                     <h3>{{ totalCourses }}</h3>
                     <p>Total Courses</p>
                  </div>
               </div>
               <div class="stat-card glass">
                  <span class="icon">👥</span>
                  <div class="stat-info">
                     <h3>{{ totalUsers }}</h3>
                     <p>Registered Users</p>
                  </div>
               </div>
               <div class="stat-card glass warning">
                  <span class="icon">⏳</span>
                  <div class="stat-info">
                     <h3>{{ pendingApprovals.length }}</h3>
                     <p>Pending Approvals</p>
                  </div>
               </div>
               <div class="stat-card glass success">
                  <span class="icon">💰</span>
                  <div class="stat-info">
                     <h3>₹ {{ totalRevenue | number:'1.0-0' }}</h3>
                     <p>Total Revenue</p>
                  </div>
               </div>
            </div>

            <div class="recent-activity-section fade-in" style="margin-top: 3rem;">
               <div class="section-header-inline">
                  <h3>System Health Monitor</h3>
               </div>
               <div class="health-grid">
                  <div class="health-card glass" [class.online]="healthStatus.gateway">
                     <div class="status-dot"></div>
                     <span class="service-name">API Gateway</span>
                  </div>
                  <div class="health-card glass" [class.online]="healthStatus.auth">
                     <div class="status-dot"></div>
                     <span class="service-name">Auth Service</span>
                  </div>
                  <div class="health-card glass" [class.online]="healthStatus.course">
                     <div class="status-dot"></div>
                     <span class="service-name">Course Service</span>
                  </div>
                  <div class="health-card glass" [class.online]="healthStatus.content">
                     <div class="status-dot"></div>
                     <span class="service-name">Content Service</span>
                  </div>
                  <div class="health-card glass" [class.online]="healthStatus.enrollment">
                     <div class="status-dot"></div>
                     <span class="service-name">Enrollment Service</span>
                  </div>
                  <div class="health-card glass" [class.online]="healthStatus.payment">
                     <div class="status-dot"></div>
                     <span class="service-name">Payment Service</span>
                  </div>
                  <div class="health-card glass" [class.online]="healthStatus.progress">
                     <div class="status-dot"></div>
                     <span class="service-name">Progress Service</span>
                  </div>
                  <div class="health-card glass" [class.online]="healthStatus.notification">
                     <div class="status-dot"></div>
                     <span class="service-name">Notification Service</span>
                  </div>
               </div>
            </div>

            <div class="recent-activity-section fade-in" style="margin-top: 3rem;">
               <div class="section-header-inline">
                  <h3>Recent Pending Approvals</h3>
                  <button class="btn-link" (click)="activeTab = 'approvals'">View All Approvals →</button>
               </div>
               
               <div class="activity-list" *ngIf="pendingApprovals.length > 0; else noPending">
                  <div *ngFor="let c of pendingApprovals.slice(0, 4)" class="activity-card glass">
                     <div class="activity-info">
                        <div class="activity-icon">⏳</div>
                        <div class="activity-text">
                           <span class="course-name">{{ c.title }}</span>
                           <span class="instructor-sub">By {{ c.instructorName }}</span>
                        </div>
                     </div>
                     <button class="btn-action-round" (click)="activeTab = 'approvals'" title="Review Course">⚖️</button>
                  </div>
               </div>
               <ng-template #noPending>
                  <div class="empty-mini glass">
                     <p>Everything is up to date! No pending approvals.</p>
                  </div>
               </ng-template>
            </div>
          </div>

          <!-- Course Approvals Tab -->
          <div *ngSwitchCase="'approvals'" class="tab-content fade-in">
             <header class="top-bar">
                <h2>Pending Approvals</h2>
                <p>Review and publish courses to the marketplace</p>
             </header>

             <div class="approval-list" *ngIf="pendingApprovals.length > 0; else emptyApprovals">
                <div *ngFor="let course of pendingApprovals" class="glass approval-row">
                   <div class="course-meta">
                      <h4>{{ course.title }}</h4>
                      <p>By <strong>{{ course.instructorName || 'Unknown' }}</strong> • {{ course.category }}</p>
                   </div>
                   <div class="actions">
                      <button class="btn-outline btn-sm" (click)="onPreview(course.courseId)">Preview</button>
                      <button class="btn-primary btn-sm" (click)="onApprove(course.courseId)">Approve</button>
                      <button class="btn-icon text-danger" (click)="onDeleteCourse(course.courseId)" title="Delete Course">🗑️</button>
                   </div>
                </div>
             </div>
             <ng-template #emptyApprovals>
                <div class="empty-state">
                   <div class="icon">✅</div>
                   <h3>All caught up!</h3>
                   <p>No courses are currently waiting for approval.</p>
                </div>
             </ng-template>
          </div>

          <!-- All Courses Tab -->
          <div *ngSwitchCase="'courses'" class="tab-content fade-in">
             <header class="top-bar">
                <h2>All Platform Courses</h2>
                <p>Manage and monitor every course on the marketplace</p>
             </header>

             <div class="approval-list" *ngIf="allCourses.length > 0; else noCourses">
                <div *ngFor="let course of allCourses" class="glass approval-row">
                   <div class="course-meta">
                      <h4>{{ course.title }}</h4>
                      <p>By <strong>{{ course.instructorName || 'Unknown' }}</strong> • {{ course.category }} • 
                         <span [class]="course.isApproved ? 'text-success' : 'text-warning'" style="font-weight: 700;">
                            {{ course.isApproved ? 'Approved' : 'Pending' }}
                         </span>
                      </p>
                   </div>
                   <div class="actions">
                      <button class="btn-outline btn-sm" (click)="onPreview(course.courseId)">View</button>
                      <button class="btn-icon text-danger" (click)="onDeleteCourse(course.courseId)" title="Delete Course">🗑️</button>
                   </div>
                </div>
             </div>
             <ng-template #noCourses><div class="empty-state"><h3>No courses found.</h3></div></ng-template>
          </div>

          <!-- User Management Tab -->
          <div *ngSwitchCase="'users'" class="tab-content fade-in">
             <header class="top-bar">
                <div class="flex-between">
                   <h2>User Management</h2>
                   <div class="search-box glass">
                      <span class="icon">🔍</span>
                      <input type="text" [(ngModel)]="userSearchTerm" placeholder="Search by name or email...">
                   </div>
                </div>
             </header>
             <div class="user-table-wrapper glass">
                <table class="user-table">
                   <thead>
                      <tr>
                         <th>Name</th>
                         <th>Email</th>
                         <th>Role</th>
                         <th>Actions</th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr *ngFor="let user of filteredUsers()">
                         <td>{{ user.fullName }}</td>
                         <td>{{ user.email }}</td>
                         <td>
                            <select class="role-select" 
                                    [value]="user.role" 
                                    [disabled]="isProtected(user)"
                                    (change)="onChangeRole(user.userId, $event)">
                               <option value="STUDENT">STUDENT</option>
                               <option value="INSTRUCTOR">INSTRUCTOR</option>
                               <option value="ADMIN">ADMIN</option>
                            </select>
                         </td>
                         <td>
                            <button class="btn-icon text-danger" 
                                    [disabled]="isProtected(user)"
                                    [class.disabled]="isProtected(user)"
                                    (click)="onDeleteUser(user.userId)" 
                                    title="Delete User">🗑️</button>
                         </td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>

          <!-- System Settings Tab -->
          <div *ngSwitchCase="'settings'" class="tab-content settings-pane">
             <header class="top-bar">
                <div class="welcome-text">
                  <h2>System & Account Settings</h2>
                  <p>Manage your administrative profile and security</p>
                </div>
             </header>

             <div class="settings-layout">
                <!-- Avatar Section -->
                <section class="avatar-card glass fade-in">
                   <div class="avatar-wrapper">
                      <img [src]="resolveMediaUrl(profileData.avatarUrl, 'https://ui-avatars.com/api/?name=' + profileData.fullName)" alt="Avatar" class="profile-avatar">
                      <label class="upload-overlay" title="Upload New Photo">
                         <span class="icon">📷</span>
                         <input type="file" (change)="onAvatarSelected($event)" hidden accept="image/*">
                      </label>
                   </div>
                   <div class="avatar-info">
                      <h3>{{ profileData.fullName }}</h3>
                      <p>Platform Administrator</p>
                      <button class="btn-text-sm" (click)="avatarInput.click()">Change Profile Picture</button>
                      <input #avatarInput type="file" (change)="onAvatarSelected($event)" hidden accept="image/*">
                   </div>
                </section>

                <div class="settings-grid">
                   <!-- Profile Section -->
                   <section class="settings-card glass fade-in">
                      <h3>Admin Profile</h3>
                      <div class="form-group">
                         <label>Full Name</label>
                         <input type="text" [(ngModel)]="profileData.fullName" class="form-control" placeholder="Your Name">
                      </div>
                      <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" [value]="profileData.email" class="form-control" disabled style="opacity: 0.6; cursor: not-allowed;">
                      </div>
                      <p class="hint-text">Your name is used for approval signatures and logs.</p>
                      <button class="btn-primary btn-sm" (click)="onUpdateProfile()">Update Admin Profile</button>
                   </section>

                   <!-- Password Section -->
                   <section class="settings-card glass fade-in">
                      <h3>Security & Privacy</h3>
                      
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

                      <button class="btn-outline btn-sm" (click)="onChangePassword()">Change Admin Password</button>
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
    .sidebar { width: 280px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(30px); padding: 2rem; border-right: 1px solid rgba(255,255,255,0.05); position: sticky; top: 0; height: 100vh; z-index: 1000; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(16, 185, 129, 0.3) transparent; }
    
    /* Custom Scrollbar for Sidebar */
    .sidebar::-webkit-scrollbar { width: 4px; }
    .sidebar::-webkit-scrollbar-track { background: transparent; }
    .sidebar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.3); border-radius: 10px; }
    .sidebar::-webkit-scrollbar-thumb:hover { background: #10b981; }

    .sidebar-header { margin-bottom: 3.5rem; }
    .panel-title { font-size: 1.4rem; font-weight: 900; color: #fff; letter-spacing: -0.5px; margin-bottom: 1.8rem; }
    .panel-title span { color: #10b981; }
    
    .user-mini-profile { display: flex; align-items: center; gap: 1rem; padding: 1.2rem; background: rgba(255,255,255,0.03); border-radius: 18px; border: 1px solid rgba(255,255,255,0.05); }
    .mini-avatar { width: 42px; height: 42px; border-radius: 12px; overflow: hidden; border: 1px solid #10b981; }
    .mini-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .mini-info { display: flex; flex-direction: column; }
    .user-name { font-size: 0.9rem; font-weight: 700; color: #fff; }
    .user-role { font-size: 0.7rem; color: #10b981; font-weight: 600; text-transform: uppercase; }

    nav { display: flex; flex-direction: column; gap: 0.8rem; }
    nav button { padding: 1.2rem; color: #94a3b8; text-align: left; background: none; border: none; border-radius: 14px; cursor: pointer; transition: all 0.3s; font-weight: 500; font-size: 1rem; width: 100%; }
    nav button:hover { background: rgba(255,255,255,0.03); color: #fff; transform: translateX(5px); }
    nav button.active { background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05)); color: #10b981; box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.2); }

    .content { flex: 1; padding: 4rem; overflow-y: auto; }
    .top-bar { margin-bottom: 3rem; }
    .top-bar h2 { font-size: 2.5rem; font-weight: 800; margin: 0; color: #fff; letter-spacing: -1px; }
    .top-bar p { color: #94a3b8; font-size: 1.1rem; margin-top: 0.5rem; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; margin-top: 3rem; }
    .stat-card { padding: 2rem; border-radius: 24px; display: flex; align-items: center; gap: 1.5rem; border: 1px solid rgba(255,255,255,0.05); }
    .stat-card .icon { font-size: 2.5rem; background: rgba(255,255,255,0.05); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 16px; }
    .stat-info h3 { font-size: 1.8rem; font-weight: 800; margin: 0; color: #fff; }
    .stat-info p { margin: 0; color: #94a3b8; font-size: 0.9rem; font-weight: 600; }
    .warning .icon { color: #f59e0b; }
    .success .icon { color: #10b981; }

    .section-header-inline { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .section-header-inline h3 { font-size: 1.2rem; font-weight: 800; color: #fff; margin: 0; }
    .btn-link { background: none; border: none; color: #10b981; font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
    .btn-link:hover { color: #fff; transform: translateX(5px); }

    .activity-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
    .activity-card { padding: 1.5rem; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.03); transition: all 0.3s; }
    .activity-card:hover { transform: translateY(-5px); border-color: rgba(16, 185, 129, 0.3); background: rgba(30, 41, 59, 0.6); }
    .activity-info { display: flex; align-items: center; gap: 1.2rem; }
    .activity-icon { font-size: 1.5rem; }
    .activity-text { display: flex; flex-direction: column; }
    .course-name { font-weight: 700; color: #fff; font-size: 0.95rem; }
    .instructor-sub { font-size: 0.75rem; color: #64748b; font-weight: 600; margin-top: 0.2rem; }
    .btn-action-round { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .btn-action-round:hover { background: #10b981; border-color: #10b981; transform: rotate(15deg); }

    .empty-mini { padding: 3rem; text-align: center; border-radius: 20px; color: #64748b; font-size: 0.9rem; }

    /* Redesigned Compact Health Monitor */
    .health-grid { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 1rem; 
      margin-bottom: 2rem; 
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .health-card { 
      padding: 0.6rem 1.2rem; 
      border-radius: 100px; 
      display: flex; 
      align-items: center; 
      gap: 0.8rem; 
      border: 1px solid rgba(255, 255, 255, 0.05); 
      background: rgba(15, 23, 42, 0.4);
      transition: all 0.3s ease;
      min-width: 160px;
    }
    .status-dot { 
      width: 8px; 
      height: 8px; 
      border-radius: 50%; 
      background: #64748b; 
    }
    .health-card.online { 
      border-color: rgba(16, 185, 129, 0.3);
      background: rgba(16, 185, 129, 0.05);
    }
    .health-card.online .status-dot { 
      background: #10b981; 
      box-shadow: 0 0 12px #10b981;
      animation: pulse 2s infinite;
    }
    .service-name { 
      font-size: 0.75rem; 
      font-weight: 700; 
      color: #94a3b8; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .online .service-name { color: #fff; }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }

    /* Search Box Styles */
    .flex-between { display: flex; justify-content: space-between; align-items: center; width: 100%; }
    .search-box { display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); width: 350px; }
    .search-box input { background: none; border: none; color: #fff; outline: none; width: 100%; font-size: 0.9rem; }
    .search-box .icon { font-size: 1rem; opacity: 0.6; }

    .approval-list { display: flex; flex-direction: column; gap: 1.2rem; margin-top: 2rem; }
    .approval-row { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
    .course-meta h4 { margin: 0; color: #fff; font-size: 1.1rem; }
    .course-meta p { margin: 0.3rem 0 0; color: #64748b; font-size: 0.9rem; }
    .actions { display: flex; gap: 1rem; }

    .user-table-wrapper { margin-top: 2rem; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
    .user-table { width: 100%; border-collapse: collapse; text-align: left; }
    .user-table th { padding: 1.5rem; background: rgba(15, 23, 42, 0.5); font-size: 0.85rem; color: #64748b; text-transform: uppercase; }
    .user-table td { padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.03); }
    
    .role-select { background: rgba(15, 23, 42, 0.6); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 10px; outline: none; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
    .role-select:focus { border-color: #10b981; }

    .btn-icon { background: rgba(255,255,255,0.03); border: none; cursor: pointer; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .btn-icon:hover { background: rgba(239, 68, 68, 0.1); transform: scale(1.1); }

    /* Settings Styles */
    .settings-pane { padding-top: 1rem; }
    .settings-layout { display: flex; flex-direction: column; gap: 2.5rem; }
    .avatar-card { display: flex; align-items: center; gap: 2.5rem; padding: 2.5rem; border-radius: 30px; border: 1px solid rgba(255,255,255,0.05); }
    .avatar-wrapper { position: relative; width: 120px; height: 120px; border-radius: 50%; border: 3px solid #10b981; padding: 5px; }
    .profile-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
    .upload-overlay { position: absolute; inset: 5px; background: rgba(0,0,0,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; cursor: pointer; }
    .avatar-wrapper:hover .upload-overlay { opacity: 1; }
    .avatar-info h3 { font-size: 1.8rem; margin: 0; color: #fff; font-weight: 800; }
    .avatar-info p { color: #10b981; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin: 0.3rem 0 1rem; }
    .btn-text-sm { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; font-size: 0.85rem; padding: 0; }
    .btn-text-sm:hover { color: #fff; text-decoration: underline; }

    .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2.5rem; }
    .settings-card { padding: 2.5rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); }
    .settings-card h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 2rem; color: #fff; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.6rem; color: #94a3b8; font-size: 0.85rem; font-weight: 600; }
    .form-control { width: 100%; padding: 1rem; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; outline: none; }
    .form-control:focus { border-color: #10b981; }
    .hint-text { font-size: 0.8rem; color: #64748b; margin: -1rem 0 1.5rem; }

    .input-with-icon { position: relative; display: flex; align-items: center; }
    .suffix-icon { position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer; padding: 0.5rem; font-size: 1.1rem; filter: grayscale(1); opacity: 0.6; transition: opacity 0.2s; }
    .suffix-icon:hover { opacity: 1; }

    .btn-primary { background: #10b981; color: #fff; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; }
    .btn-outline { border: 1px solid rgba(255,255,255,0.1); color: #fff; background: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; }
    .btn-text-sm { background: none; border: none; color: #10b981; cursor: pointer; font-weight: 600; font-size: 0.85rem; margin-right: 1rem; }
    .btn-sm { font-size: 0.85rem; }
    .text-danger { color: #ef4444 !important; }
    .empty-state { text-align: center; padding: 6rem 0; color: #64748b; }
    .empty-state .icon { font-size: 3rem; margin-bottom: 1rem; }
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .glass { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(20px); }

    /* --- RESPONSIVENESS --- */
    @media (max-width: 1024px) {
       .dashboard-container { flex-direction: column; }
       .sidebar { width: 100%; height: auto; position: relative; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; }
       .sidebar-header { margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
       .user-mini-profile { padding: 0.8rem; }
       nav { flex-direction: row; overflow-x: auto; padding-bottom: 0.5rem; gap: 0.5rem; }
       nav button { white-space: nowrap; padding: 0.8rem 1.2rem; font-size: 0.9rem; }
       .content { padding: 2rem; }
    }

    @media (max-width: 768px) {
       .top-bar h2 { font-size: 1.8rem; }
       .stats-grid { grid-template-columns: 1fr 1fr; }
       .settings-grid { grid-template-columns: 1fr; }
       .activity-list { grid-template-columns: 1fr; }
       .approval-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
       .approval-row .actions { width: 100%; justify-content: flex-end; }
       .avatar-card { flex-direction: column; text-align: center; gap: 1.5rem; }
    }

    @media (max-width: 480px) {
       .stats-grid { grid-template-columns: 1fr; }
       .top-bar h2 { font-size: 1.5rem; }
       .user-table-wrapper { overflow-x: auto; margin-left: -1rem; margin-right: -1rem; border-radius: 0; }
       .user-table th, .user-table td { padding: 1rem 0.8rem; font-size: 0.8rem; }
       .sidebar-header { flex-direction: column; gap: 1rem; text-align: center; }
       .panel-title { margin-bottom: 0; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  resolveMediaUrl = resolveMediaUrl;
  activeTab = 'overview';
  profileData = { fullName: '', avatarUrl: '', userId: 0, email: '' };
  currentUserId = 0;
  passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
  
  // Search & Filtering
  userSearchTerm = '';
  
  // Health Monitoring
  healthStatus = {
    gateway: true,
    auth: true,
    course: true,
    content: true,
    enrollment: true,
    payment: true,
    progress: true,
    notification: true
  };
  
  // Visibility toggles
  showCurrent = false;
  showNew = false;
  showConfirm = false;
  
  // Stats
  totalCourses = 0;
  totalUsers = 0;
  totalRevenue = 0;
  allCourses: any[] = [];
  pendingApprovals: any[] = [];
  users: any[] = [];

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadAdminData();
    this.checkHealth();
  }

  checkHealth() {
    // Simulated health check (in real world, this would hit /health endpoints)
    setTimeout(() => {
      this.healthStatus = { 
        gateway: true,
        auth: true, 
        course: true, 
        content: true, 
        enrollment: true,
        payment: true,
        progress: true,
        notification: true
      };
    }, 1000);
  }

  filteredUsers() {
    if (!this.userSearchTerm) return this.users;
    const term = this.userSearchTerm.toLowerCase();
    return this.users.filter(u => 
      u.fullName.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term)
    );
  }

  loadProfile() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.profileData = { ...user };
        this.currentUserId = user.userId;
      }
    });
  }

  isProtected(user: any): boolean {
    // 1. Protection for self
    if (user.userId === this.currentUserId) return true;
    
    // 2. Protection for SuperAdmin (Checking by email pattern or specific email)
    const superAdminEmail = 'golub'; // We can use a partial match or full email
    if (user.email && user.email.toLowerCase().includes(superAdminEmail)) return true;
    
    return false;
  }

  loadAdminData() {
    // Load all courses (including unapproved) using the admin endpoint
    this.courseService.getAllCoursesForAdmin().subscribe({
      next: (res) => {
        this.allCourses = res.data || [];
        this.totalCourses = this.allCourses.length;
        // Calculate dynamic revenue
        this.totalRevenue = this.allCourses.reduce((sum: number, course: any) => sum + (course.price * (course.enrollmentCount || 0)), 0);
        // Identify courses that are Published but NOT yet Approved
        this.pendingApprovals = this.allCourses.filter((c: any) => c.isPublished && !c.isApproved);
      },
      error: () => console.error('Failed to load admin course data.')
    });

    // Load users (Admin only endpoint)
    this.authService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || [];
        this.totalUsers = this.users.length;
      },
      error: () => console.error('Failed to load users. Ensure you have ADMIN role.')
    });
  }

  onApprove(id: number) {
    if (confirm('Approve this course for the public marketplace?')) {
      this.courseService.approveCourse(id).subscribe({
        next: () => {
          alert('Course approved successfully!');
          this.loadAdminData();
        },
        error: () => alert('Failed to approve course.')
      });
    }
  }

  onPreview(id: number) {
    // Redirect to course view in preview mode
    window.open(`/courses/${id}`, '_blank');
  }

  onDeleteCourse(id: number) {
    if (confirm('Are you sure you want to PERMANENTLY delete this course? This will remove all related content.')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          alert('Course deleted successfully.');
          this.loadAdminData();
        },
        error: () => alert('Failed to delete course.')
      });
    }
  }

  onDeleteUser(id: number) {
    if (confirm('Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.')) {
      this.authService.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully.');
          this.loadAdminData();
        },
        error: (err) => alert(err.error?.message || 'Failed to delete user.')
      });
    }
  }

  onChangeRole(userId: number, event: any) {
    const newRole = event.target.value;
    if (confirm(`Change user role to ${newRole}?`)) {
      this.authService.changeUserRole(userId, newRole).subscribe({
        next: () => {
          alert('User role updated successfully.');
          this.loadAdminData();
        },
        error: (err) => alert(err.error?.message || 'Failed to update role.')
      });
    } else {
      this.loadAdminData(); // Reset dropdown if cancelled
    }
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
