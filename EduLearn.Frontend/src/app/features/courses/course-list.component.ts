import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { resolveMediaUrl } from '../../core/utils/url.helper';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="hero-section">
      <div class="hero-content">
        <span class="eyebrow">The Ultimate Learning Platform</span>
        <h1>Unlock Your <span>Potential</span><br>with EduLearn</h1>
        <p>Empowering learners worldwide with expert-led courses, interactive <br>content, and industry-recognized certifications.</p>
        <div class="hero-btns">
          <button class="btn btn-primary btn-lg" [routerLink]="isLoggedIn ? '/courses' : '/register'">Get Started</button>
          <button class="btn btn-outline btn-lg" (click)="scrollToCourses()">Browse All</button>
        </div>
      </div>
      <div class="hero-blob"></div>
    </div>

    <div class="container" id="courses-section">
      <header>
        <h2>Explore Our Courses</h2>
        <p>Choose from our curated selection of high-quality learning paths</p>
      </header>

      <div class="course-grid">
        <div *ngFor="let course of courses" class="glass course-card" [routerLink]="['/course', course.courseId]">
          <div class="thumbnail">
              <img [src]="resolveThumb(course.thumbnailUrl)" alt="course">
          </div>
          <div class="card-content">
            <span class="badge">{{ course.category || 'Technology' }}</span>
            <h3>{{ course.title }}</h3>
            <p class="description">{{ course.description | slice:0:80 }}...</p>
            <div class="card-footer">
              <span class="price">₹{{ course.price }}</span>
              <button class="btn btn-primary btn-sm" [routerLink]="['/course', course.courseId]">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 2rem;
      position: relative;
      overflow: hidden;
      background: radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
                  radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 40%);
    }
    .hero-content { text-align: center; position: relative; z-index: 10; max-width: 800px; }
    .eyebrow { color: var(--primary); font-weight: 600; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; margin-bottom: 1rem; display: block; }
    .hero-content h1 { font-size: 4.5rem; line-height: 1.1; margin-bottom: 1.5rem; background: linear-gradient(to bottom, #fff 40%, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero-content h1 span { color: var(--primary); -webkit-text-fill-color: var(--primary); }
    .hero-content p { color: var(--text-muted); font-size: 1.2rem; margin-bottom: 2.5rem; }
    .hero-btns { display: flex; gap: 1.5rem; justify-content: center; }
    .btn-lg { padding: 1rem 2.5rem; font-size: 1.1rem; cursor: pointer; border-radius: 12px; font-weight: 600; transition: all 0.3s; }
    .btn-outline { background: transparent; border: 1px solid var(--glass-border); color: #fff; }
    .btn-outline:hover { background: var(--glass); transform: translateY(-2px); }

    .hero-blob {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 600px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2));
      filter: blur(80px);
      border-radius: 50%;
      z-index: 1;
      animation: pulse 10s infinite alternate;
    }

    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(1); }
      100% { transform: translate(-50%, -50%) scale(1.2); }
    }

    .container { padding: 6rem 2rem; max-width: 1200px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 4rem; }
    header h2 { font-size: 2.5rem; margin-bottom: 1rem; }
    .course-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    .course-card {
      overflow: hidden;
      transition: transform 0.3s;
      cursor: pointer;
    }
    .course-card:hover { transform: translateY(-10px); }
    .thumbnail img { width: 100%; height: 180px; object-fit: cover; }
    .card-content { padding: 1.5rem; }
    .badge {
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    h3 { margin: 1rem 0 0.5rem; color: #fff; }
    .description { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; }
    .price { font-size: 1.25rem; font-weight: 700; color: #fff; }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.85rem; }
  `]
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  isLoggedIn = false;

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) { }

  resolveThumb(url: string | null | undefined): string {
    return resolveMediaUrl(url);
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.courseService.getCourses().subscribe({
      next: (res) => {
        this.courses = res.data;
      },
      error: (err) => console.error('Failed to load courses', err)
    });
  }

  scrollToCourses() {
    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
  }
}