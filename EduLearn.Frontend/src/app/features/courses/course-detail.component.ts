import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { resolveMediaUrl } from '../../core/utils/url.helper';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Admin Review Toolbar -->
    <div class="admin-toolbar glass fade-in" *ngIf="isAdmin && course">
       <div class="toolbar-content">
          <div class="status-info">
             <span class="pulse-icon"></span>
             <span class="mode-text">ADMIN PREVIEW MODE</span>
             <span class="status-label" [class.pending]="!course.isApproved">
                {{ course.isApproved ? 'Approved & Live' : 'Pending Review' }}
             </span>
          </div>
          <div class="toolbar-actions">
             <button class="btn-delete-icon" (click)="onDelete()" title="Delete Course">🗑️</button>
             <button class="btn btn-outline btn-sm" (click)="goBack()">Back to Dashboard</button>
             <button class="btn btn-primary btn-sm" *ngIf="!course.isApproved" (click)="onApprove()">Approve Course</button>
          </div>
       </div>
    </div>

    <div class="detail-container" *ngIf="course" [style.padding-top]="isAdmin ? '12rem' : '8rem'">
      <div class="glass banner">
        <div class="banner-content">
          <span class="badge">{{ course.category }}</span>
          <h1>{{ course.title }}</h1>
          <p class="description">{{ course.description }}</p>
          
          <div class="meta">
             <span><i class="icon">👤</i> {{ course.instructorName || 'Expert Instructor' }}</span>
             <span><i class="icon">🌐</i> {{ course.language }}</span>
             <span><i class="icon">📊</i> {{ course.level }}</span>
          </div>
        </div>
        
        <div class="glass pricing-card">
          <img [src]="resolveThumb(course.thumbnailUrl)" alt="thumbnail">
          <div class="p-4">
            <span class="price">₹{{ course.price }}</span>
            
            <ng-container *ngIf="!isAdmin">
              <button class="btn btn-primary w-100" (click)="onEnroll()">
                {{ isLoggedIn ? (alreadyEnrolled ? 'Go to Course' : 'Enroll Now') : 'Login to Enroll' }}
              </button>
            </ng-container>
            
            <ng-container *ngIf="isAdmin">
              <button class="btn btn-primary w-100" disabled>Admin View</button>
            </ng-container>

            <p class="money-back">30-Day Money-Back Guarantee</p>
            
            <div class="features">
              <p>✓ Lifetime Access</p>
              <p>✓ Certificate of Completion</p>
              <p>✓ Support from Instructor</p>
            </div>
          </div>
        </div>
      </div>

      <div class="content-grid">
         <div class="main-content">
            <section class="glass about-section">
               <h2>What you'll learn</h2>
               <p>Master the core concepts of {{ course.title }} through hands-on projects and expert guidance. This course is designed to take you from beginner to advanced level.</p>
            </section>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-toolbar { position: fixed; top: 80px; left: 0; right: 0; z-index: 1000; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); border-radius: 0; }
    .toolbar-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; }
    .status-info { display: flex; align-items: center; gap: 1.2rem; }
    .mode-text { font-weight: 800; font-size: 0.8rem; letter-spacing: 1.5px; color: #94a3b8; }
    .status-label { padding: 0.3rem 0.8rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .status-label.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .pulse-icon { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
    
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .toolbar-actions { display: flex; gap: 1rem; align-items: center; }
    .btn-delete-icon { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; width: 36px; height: 36px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .btn-delete-icon:hover { background: #ef4444; color: #fff; transform: scale(1.1); }

    .detail-container { padding: 8rem 2rem 4rem; max-width: 1200px; margin: 0 auto; transition: all 0.3s; }
    .banner { display: grid; grid-template-columns: 1fr 380px; gap: 4rem; padding: 4rem; border-radius: 30px; position: relative; }
    .banner-content h1 { font-size: 3.5rem; margin: 1.5rem 0; -webkit-text-fill-color: white; }
    .description { font-size: 1.2rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; }
    
    .badge { background: var(--primary); color: #fff; padding: 0.4rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.9rem; }
    .meta { display: flex; gap: 2rem; color: var(--text-muted); }
    .icon { margin-right: 0.5rem; filter: grayscale(1); }

    .pricing-card { position: absolute; top: 4rem; right: 4rem; width: 380px; padding: 0; overflow: hidden; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .pricing-card img { width: 100%; height: 220px; object-fit: cover; }
    .p-4 { padding: 2rem; }
    .price { display: block; font-size: 2.5rem; font-weight: 800; margin-bottom: 1.5rem; color: #fff; }
    .w-100 { width: 100%; justify-content: center; padding: 1rem; font-size: 1.1rem; }
    .money-back { text-align: center; font-size: 0.8rem; color: var(--text-muted); margin-top: 1rem; }
    
    .features { margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem; }
    .features p { font-size: 0.9rem; margin-bottom: 0.8rem; color: #ddd; }

    .content-grid { margin-top: 4rem; display: grid; grid-template-columns: 1fr 380px; gap: 4rem; }
    .about-section { padding: 2.5rem; }
    .about-section h2 { margin-bottom: 1.5rem; }

    .btn-sm { padding: 0.6rem 1.2rem; font-size: 0.85rem; }
  `]
})
export class CourseDetailComponent implements OnInit {
  course: any;
  isLoggedIn = false;
  isAdmin = false;
  alreadyEnrolled = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private authService: AuthService,
    private enrollmentService: EnrollmentService,
    private router: Router
  ) {}

  resolveThumb(url: string | null | undefined): string {
    return resolveMediaUrl(url);
  }

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      const id = Number(courseId);
      this.loadCourse(id);
      this.checkEnrollment(id);
    }
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.getUserRole() === 'ADMIN';
  }

  loadCourse(id: number) {
    this.courseService.getCourseById(id).subscribe(res => {
      this.course = res.data;
    });
  }

  checkEnrollment(id: number) {
    if (this.authService.isLoggedIn() && this.authService.getUserRole() === 'STUDENT') {
      this.enrollmentService.isEnrolled(id).subscribe(res => {
        this.alreadyEnrolled = res.data;
      });
    }
  }

  onApprove() {
    if (confirm('Approve this course for public visibility?')) {
      this.courseService.approveCourse(this.course.courseId).subscribe({
        next: () => {
          alert('Course approved successfully!');
          this.loadCourse(this.course.courseId);
        },
        error: () => alert('Failed to approve course.')
      });
    }
  }

  onDelete() {
    if (confirm('Are you sure you want to PERMANENTLY delete this course?')) {
      this.courseService.deleteCourse(this.course.courseId).subscribe({
        next: () => {
          alert('Course deleted.');
          this.goBack();
        },
        error: () => alert('Failed to delete course.')
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/admin']);
  }

  onEnroll() {
    if (this.isAdmin) return;
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.alreadyEnrolled) {
      this.router.navigate(['/dashboard/student']);
    } else {
      this.router.navigate(['/checkout', this.course.courseId]);
    }
  }
}
