import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { ContentService } from '../../core/services/content.service';
import { ProgressService } from '../../core/services/progress.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="player-app" *ngIf="course">
      <!-- Main Content Area -->
      <div class="main-content">
        <div class="player-header">
           <a routerLink="/dashboard/student" class="back-btn">← Back</a>
           <h2 class="course-title">{{ course.title }}</h2>
        </div>

        <div class="media-viewport">
          <ng-container [ngSwitch]="selectedLesson?.contentType">
            <!-- Video -->
            <div *ngSwitchCase="'VIDEO'" class="content-box video-box">
               <ng-container *ngIf="selectedLesson?.contentUrl">
                 <iframe *ngIf="isYouTube(selectedLesson.contentUrl)" 
                         [src]="safeUrl" 
                         frameborder="0" 
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                         allowfullscreen 
                         class="media-element"></iframe>
                                  <video *ngIf="!isYouTube(selectedLesson.contentUrl)" 
                         [src]="selectedLesson.contentUrl" 
                         controls 
                         autoplay 
                         (ended)="onVideoEnded()"
                         class="media-element"></video>
               </ng-container>
               <div *ngIf="!selectedLesson?.contentUrl" class="placeholder">Video not available</div>
            </div>

            <!-- PDF -->
            <div *ngSwitchCase="'PDF'" class="content-box pdf-box">
               <iframe *ngIf="safeUrl && selectedLesson?.contentUrl" [src]="safeUrl" class="media-element"></iframe>
               <div *ngIf="!selectedLesson?.contentUrl" class="placeholder-box">
                 <div class="icon">📄</div>
                 <h3>PDF Not Available</h3>
                 <p>The PDF document could not be loaded. Please contact your instructor.</p>
               </div>
            </div>

            <!-- Article -->
            <div *ngSwitchCase="'ARTICLE'" class="content-box article-box glass">
               <div class="article-header">
                 <h2>{{ selectedLesson?.title }}</h2>
                 <a *ngIf="selectedLesson?.contentUrl" [href]="selectedLesson.contentUrl" target="_blank" class="btn btn-outline-white btn-sm">
                   Open in New Tab ↗
                 </a>
               </div>
               <div class="iframe-wrap" *ngIf="selectedLesson?.contentUrl">
                 <iframe [src]="safeUrl" class="media-element"></iframe>
               </div>
               <div *ngIf="!selectedLesson?.contentUrl" class="article-body" [innerHTML]="selectedLesson?.description"></div>
            </div>

            <!-- Empty -->
            <div *ngSwitchDefault class="content-box placeholder-box glass">
               <div class="icon">🎓</div>
               <h3>Welcome to {{ course.title }}</h3>
               <p>Select a lesson from the sidebar to begin.</p>
            </div>
          </ng-container>
        </div>

        <div class="lesson-details" *ngIf="selectedLesson">
           <div class="details-nav">
              <span class="active">Overview</span>
           </div>
           <div class="details-content glass">
              <h3>{{ selectedLesson.title }}</h3>
              <p>{{ selectedLesson.description }}</p>
           </div>
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>Course Curriculum</h3>
        </div>
        <div class="syllabus-scroll">
          <div class="section-group" *ngFor="let section of sections">
             <div class="section-label">{{ section.title }}</div>
             <div class="lesson-item" 
                  *ngFor="let lesson of section.lessons"
                  [class.active]="selectedLesson?.lessonId === lesson.lessonId"
                  [class.is-done]="isCompleted(lesson.lessonId)"
                  (click)="selectLesson(lesson)">
               <span class="l-status" *ngIf="isCompleted(lesson.lessonId)">✓</span>
               <span class="l-icon" *ngIf="!isCompleted(lesson.lessonId)">{{ getIcon(lesson.contentType) }}</span>
               <span class="l-title">{{ lesson.title }}</span>
               <span class="l-dur">{{ lesson.duration }}m</span>
             </div>
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .player-app { display: flex; height: 100vh; background: #070b14; color: #e2e8f0; overflow: hidden; padding-top: 60px; }
    
    /* Main Content */
    .main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; padding: 2rem; }
    .player-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
    .back-btn { color: #64748b; text-decoration: none; font-size: 0.9rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 8px; background: rgba(255,255,255,0.05); }
    .back-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .course-title { font-size: 1.1rem; color: #94a3b8; font-weight: 500; }

    /* Media Viewport - fills full width */
    .media-viewport { width: 100%; min-height: 480px; height: calc(100vh - 220px); max-height: 75vh; background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .content-box { width: 100%; height: 100%; position: relative; }
    .media-element { width: 100%; height: 100%; border: none; display: block; }
    
    .article-box { padding: 3rem; overflow-y: auto; }
    .iframe-wrap { height: 100%; margin-top: 1.5rem; border-radius: 12px; overflow: hidden; }
    
    .placeholder-box { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 1rem; }
    .placeholder-box .icon { font-size: 4rem; }

    .lesson-details { width: 100%; margin: 2rem auto 0; }
    .details-nav { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 1rem; }
    .details-nav span { padding: 0.8rem 1.5rem; color: #6366f1; border-bottom: 2px solid #6366f1; font-weight: 600; }
    
    .mark-complete-btn { 
      padding: 0.6rem 1.2rem; border-radius: 10px; border: 1px solid #10b981; 
      background: transparent; color: #10b981; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .mark-complete-btn:hover { background: rgba(16, 185, 129, 0.1); }
    .mark-complete-btn.completed { background: #10b981; color: #fff; }
    
    .details-content { padding: 2rem; border-radius: 16px; }

    /* Sidebar */
    .sidebar { width: 380px; background: #0f172a; border-left: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; }
    .sidebar-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .syllabus-scroll { flex: 1; overflow-y: auto; padding: 1rem; }
    .section-label { padding: 1rem 1.2rem; font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 1px; }
    .lesson-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.2rem; border-radius: 12px; cursor: pointer; transition: all 0.2s; margin-bottom: 0.2rem; }
    .lesson-item:hover { background: rgba(255,255,255,0.03); }
    .lesson-item.active { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.2); }
    .lesson-item.active .l-title { color: #fff; font-weight: 600; }
    .lesson-item.is-done .l-title { opacity: 0.6; }
    .l-status { color: #10b981; font-weight: 800; font-size: 1.1rem; }
    .l-title { flex: 1; font-size: 0.9rem; color: #94a3b8; }
    .l-dur { font-size: 0.8rem; color: #475569; }
    
    @media (max-width: 1024px) {
      .player-app { flex-direction: column; overflow-y: auto; height: auto; }
      .sidebar { width: 100%; border-left: none; border-top: 1px solid rgba(255,255,255,0.05); }
      .media-viewport { aspect-ratio: 16/9; }
    }
  `]
})
export class CoursePlayerComponent implements OnInit {
  course: any;
  sections: any[] = [];
  selectedLesson: any;
  safeUrl: SafeResourceUrl | null = null;
  activeTab: 'overview' | 'resources' = 'overview';
  
  // Progress State
  courseProgress: any = null;
  loadingProgress = false;
  private completionTimer: any;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private contentService: ContentService,
    private progressService: ProgressService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      const cid = Number(courseId);
      // 1. Get Course Info
      this.courseService.getCourseById(cid).subscribe(res => {
        this.course = res.data;
      });

      // 2. Get Curriculum
      this.contentService.getSectionsByCourse(cid).subscribe((res: any) => {
        this.sections = res.data;
        // Auto-select first lesson if available
        if (this.sections.length > 0 && this.sections[0].lessons.length > 0) {
          this.selectLesson(this.sections[0].lessons[0]);
        }
      });

      // 3. Load Progress
      this.loadProgress(cid);
    }
  }

  selectLesson(lesson: any) {
    if (this.completionTimer) clearTimeout(this.completionTimer);

    this.contentService.getLessonById(lesson.lessonId).subscribe((res: any) => {
      this.selectedLesson = res.data;
      
      let url = this.selectedLesson.contentUrl;
      
      // Filter out fallback image URLs that got stored from failed uploads
      if (url && (url.includes('unsplash.com') || url.includes('placeholder.com'))) {
        url = null;
        this.selectedLesson.contentUrl = null;
      }
      
      if (url) {
        // Resolve local upload paths to full ContentService URL
        if (url.startsWith('/uploads/')) {
          url = 'http://localhost:6003' + url;
          // IMPORTANT: Also update contentUrl so <video [src]="selectedLesson.contentUrl"> works
          this.selectedLesson.contentUrl = url;
        }
        
        if (this.isYouTube(url)) {
          url = this.getYouTubeEmbedUrl(url);
        }
        
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else {
        this.safeUrl = null;
      }

      // Auto-mark as complete for Articles/PDFs after 10 seconds of viewing
      if (this.selectedLesson.contentType === 'ARTICLE' || this.selectedLesson.contentType === 'PDF') {
        this.startAutoCompletionTimer(this.selectedLesson.lessonId);
      }
    });
  }

  startAutoCompletionTimer(lessonId: number) {
    // If already completed, don't start timer
    if (this.isCompleted(lessonId)) return;

    this.completionTimer = setTimeout(() => {
      // Check if the user is still on the same lesson
      if (this.selectedLesson && this.selectedLesson.lessonId === lessonId) {
        this.markAsCompleteInternal(lessonId, true);
      }
    }, 10000); // 10 seconds for documents
  }

  onVideoEnded() {
    if (this.selectedLesson) {
      this.markAsCompleteInternal(this.selectedLesson.lessonId, true);
    }
  }

  isYouTube(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  getYouTubeEmbedUrl(url: string): string {
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('embed/')) {
      return url;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }

  getIcon(type: string): string {
    switch(type) {
      case 'VIDEO': return '▶️';
      case 'ARTICLE': return '📄';
      case 'PDF': return '📚';
      default: return '📖';
    }
  }

  loadProgress(courseId: number) {
    this.progressService.getCourseProgress(courseId).subscribe({
      next: (res) => {
        this.courseProgress = res.data;
      },
      error: (err) => console.error('Error loading progress', err)
    });
  }

  onMarkComplete() {
    if (!this.selectedLesson) return;
    const currentlyDone = this.isCompleted(this.selectedLesson.lessonId);
    this.markAsCompleteInternal(this.selectedLesson.lessonId, !currentlyDone);
  }

  private markAsCompleteInternal(lessonId: number, status: boolean) {
    if (!this.course || this.loadingProgress) return;
    
    this.loadingProgress = true;
    this.progressService.updateLessonProgress(this.course.courseId, lessonId, {
      watchedSeconds: 0,
      isCompleted: status
    }).subscribe({
      next: () => {
        this.loadProgress(this.course.courseId);
        this.loadingProgress = false;
      },
      error: (err) => {
        console.error('Error updating progress', err);
        this.loadingProgress = false;
      }
    });
  }

  isCompleted(lessonId: number): boolean {
    if (!this.courseProgress || !this.courseProgress.lessonProgress) return false;
    const lesson = this.courseProgress.lessonProgress.find((p: any) => p.lessonId === lessonId);
    return lesson ? lesson.isCompleted : false;
  }
}
