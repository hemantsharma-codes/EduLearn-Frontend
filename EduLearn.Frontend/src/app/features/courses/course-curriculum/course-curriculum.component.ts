import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../../../core/services/content.service';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-curriculum',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="curriculum-wrapper">
      <div class="container">
        <!-- Header -->
        <header class="page-header">
          <div class="header-content">
            <a routerLink="/dashboard/instructor" class="back-link">← Back to Dashboard</a>
            <h1>Curriculum Builder</h1>
            <p>Manage sections and lessons for <strong>{{ course?.title }}</strong></p>
          </div>
          <div class="header-actions">
            <button class="btn-outline-white" routerLink="/dashboard/instructor">Finish & Dashboard</button>
            <button class="btn-primary" (click)="showAddSection = true" *ngIf="!showAddSection">+ Add Section</button>
          </div>
        </header>

        <main class="builder-main">
          
          <!-- Add Section Form -->
          <div class="add-section-form" *ngIf="showAddSection">
            <input type="text" [(ngModel)]="newSectionTitle" placeholder="Section Title (e.g. Introduction to HTML)" class="form-control">
            <div class="actions">
              <button class="btn-secondary" (click)="showAddSection = false">Cancel</button>
              <button class="btn-primary" (click)="onAddSection()">Save Section</button>
            </div>
          </div>

          <!-- Sections List -->
          <div class="sections-list">
            <div *ngFor="let section of sections; let i = index" class="section-card">
              <div class="section-header">
                <div class="section-title">
                  <span class="index">Section {{ i + 1 }}:</span>
                  <h3 *ngIf="editingSectionId !== section.sectionId">{{ section.title }}</h3>
                  <input *ngIf="editingSectionId === section.sectionId" type="text" [(ngModel)]="section.title" (blur)="onUpdateSection(section)" class="inline-edit-input">
                </div>
                <div class="section-actions">
                   <button class="btn-text-sm" (click)="editingSectionId = section.sectionId">Edit</button>
                   <button class="btn-text-sm text-danger" (click)="onDeleteSection(section.sectionId)">Delete</button>
                   <button class="btn-text-sm" (click)="activeSectionId = section.sectionId">Add Lesson</button>
                </div>
              </div>

              <!-- Lessons inside Section -->
              <div class="lessons-list">
                <div *ngFor="let lesson of section.lessons" class="lesson-row">
                  <span class="lesson-icon">{{ lesson.contentType === 'VIDEO' ? '📹' : '📄' }}</span>
                  <span class="lesson-title">{{ lesson.title }}</span>
                  <div class="lesson-actions-inline">
                    <button class="btn-icon-sm" (click)="onPreviewLesson(lesson)" title="Preview Content">👁️</button>
                    <button class="btn-icon-sm text-danger" (click)="onDeleteLesson(lesson.lessonId)" title="Delete Lesson">🗑️</button>
                    <span class="lesson-meta">{{ lesson.contentType }}</span>
                  </div>
                </div>
                
                <!-- Empty state for lessons -->
                <div *ngIf="section.lessons?.length === 0" class="empty-lessons">
                  No lessons yet. Add your first lesson below.
                </div>
              </div>

              <!-- Add Lesson Form (Dynamic for each section) -->
              <div class="add-lesson-area" *ngIf="activeSectionId === section.sectionId">
                 <div class="lesson-form-card">
                    <h4>Add New Lesson</h4>
                    <div class="form-group">
                       <label>Lesson Title</label>
                       <input type="text" [(ngModel)]="newLesson.title" class="form-control" placeholder="e.g. Setting up Environment">
                    </div>

                    <div class="form-grid">
                      <div class="form-group">
                         <label>Type</label>
                         <select [(ngModel)]="newLesson.contentType" class="form-control">
                            <option value="VIDEO">Video (Internal / YouTube)</option>
                            <option value="PDF">PDF / Documents</option>
                            <option value="ARTICLE">Article / Web Link</option>
                         </select>
                      </div>
                      <div class="form-group">
                         <label>Content Source</label>
                         <div class="source-toggle">
                            <button [class.active]="!useExternalUrl" (click)="useExternalUrl = false">Upload File</button>
                            <button [class.active]="useExternalUrl" (click)="useExternalUrl = true">External URL</button>
                         </div>
                      </div>
                    </div>

                    <div class="form-group" *ngIf="!useExternalUrl">
                       <label>Select File (Video/PDF)</label>
                       <input type="file" (change)="onFileSelected($event)" class="form-control" accept="video/*,.pdf">
                       <small class="hint">Max size: Video (500MB), PDF (5MB)</small>
                    </div>

                    <div class="form-group" *ngIf="useExternalUrl">
                       <label>External URL (YouTube, Vimeo, etc.)</label>
                       <input type="text" [(ngModel)]="newLesson.contentUrl" placeholder="https://..." class="form-control">
                       <small class="hint">Paste the full URL of the content.</small>
                    </div>

                    <div class="form-actions">
                       <button class="btn-secondary btn-sm" (click)="activeSectionId = null">Cancel</button>
                       <button class="btn-primary btn-sm" [disabled]="loading" (click)="onAddLesson(section.sectionId)">
                          {{ loading ? 'Saving...' : 'Save Lesson' }}
                       </button>
                    </div>
                 </div>
              </div>

            </div>
          </div>

          <!-- Empty state -->
          <div *ngIf="sections.length === 0 && !showAddSection" class="empty-curriculum">
             <div class="icon">📁</div>
             <h3>No Curriculum Found</h3>
             <p>Start by adding sections and lessons to your course.</p>
             <button class="btn-primary" (click)="showAddSection = true">Add Your First Section</button>
          </div>

        </main>
      </div>

      <!-- Preview Modal Overlay -->
      <div *ngIf="previewLesson" class="preview-overlay" (click)="previewLesson = null">
        <div class="preview-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Preview: {{ previewLesson.title }}</h3>
            <button class="close-btn" (click)="previewLesson = null">×</button>
          </div>
          <div class="modal-body">
            <!-- Video Player -->
            <div *ngIf="previewLesson.contentType === 'VIDEO'" class="video-container">
               <div class="media-card">
                  <video *ngIf="!previewLesson.contentUrl?.includes('youtube') && !previewLesson.contentUrl?.includes('youtu.be')" [src]="previewLesson.contentUrl" controls autoplay class="preview-media"></video>
                  <iframe *ngIf="previewLesson.contentUrl?.includes('youtube') || previewLesson.contentUrl?.includes('youtu.be')" [src]="getSafeUrl(previewLesson.contentUrl)" frameborder="0" allowfullscreen class="preview-media"></iframe>
               </div>
            </div>

            <!-- PDF Viewer -->
            <div *ngIf="previewLesson.contentType === 'PDF'" class="pdf-preview-card">
               <div class="doc-icon">📄</div>
               <div class="doc-info">
                  <h4>{{ previewLesson.title }}</h4>
                  <p>PDF Document • Ready for students</p>
               </div>
               <div class="doc-actions">
                  <a [href]="previewLesson.contentUrl" target="_blank" class="btn-primary">View Full Document</a>
               </div>
               <div class="iframe-preview-mini">
                  <iframe [src]="getSafeUrl(previewLesson.contentUrl)" class="mini-pdf-frame"></iframe>
               </div>
            </div>

            <!-- Article / Link -->
            <div *ngIf="previewLesson.contentType === 'ARTICLE'" class="article-preview-card">
               <div class="link-icon">🔗</div>
               <div class="link-details">
                  <h4>External Resource</h4>
                  <code>{{ previewLesson.contentUrl }}</code>
                  <p>Students will be redirected to this link to read the article or access the resource.</p>
               </div>
               <a [href]="previewLesson.contentUrl" target="_blank" class="btn-outline-premium">Verify External Link</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .curriculum-wrapper { min-height: 100vh; background: radial-gradient(circle at bottom left, #1e293b, #0f172a); color: #f1f5f9; padding: 4rem 1rem; font-family: 'Outfit', sans-serif; }
    .container { max-width: 1000px; margin: 0 auto; }
    
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; }
    .header-content h1 { font-size: 2.5rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: -1px; }
    .header-content p { color: #94a3b8; margin: 0.8rem 0 0; font-size: 1.1rem; }
    .header-content strong { color: #10b981; text-shadow: 0 0 15px rgba(16, 185, 129, 0.3); }
    .header-actions { display: flex; gap: 1rem; align-items: center; }
    .btn-outline-white { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-outline-white:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
    .back-link { color: #64748b; text-decoration: none; font-size: 0.9rem; display: block; margin-bottom: 1rem; font-weight: 600; transition: color 0.2s; }
    .back-link:hover { color: #fff; }

    .add-section-form { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(20px); padding: 2rem; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3); margin-bottom: 3rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .add-section-form .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }

    .sections-list { display: flex; flex-direction: column; gap: 2rem; }
    .section-card { background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(10px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; transition: all 0.3s; }
    .section-card:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-3px); }
    .section-header { padding: 1.8rem 2.5rem; background: rgba(15, 23, 42, 0.5); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .section-title { display: flex; align-items: center; gap: 1rem; }
    .section-title h3 { margin: 0; font-size: 1.2rem; font-weight: 700; color: #fff; }
    .index { color: #10b981; font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }

    .lessons-list { padding: 1.5rem 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .lesson-row { display: flex; align-items: center; padding: 1.2rem 1.5rem; background: rgba(15, 23, 42, 0.3); border-radius: 16px; border: 1px solid rgba(255,255,255,0.03); transition: all 0.2s; }
    .lesson-row:hover { background: rgba(255,255,255,0.03); transform: scale(1.01); }
    .lesson-icon { font-size: 1.2rem; margin-right: 1.2rem; opacity: 0.8; }
    .lesson-title { flex: 1; font-size: 1rem; font-weight: 500; color: #e2e8f0; }
    .lesson-meta { font-size: 0.75rem; font-weight: 700; color: #94a3b8; background: rgba(255,255,255,0.05); padding: 0.3rem 0.8rem; border-radius: 8px; text-transform: uppercase; }
    .empty-lessons { padding: 3rem; text-align: center; color: #64748b; font-style: italic; border: 2px dashed rgba(255,255,255,0.05); border-radius: 16px; margin: 1rem; }

    .add-lesson-area { padding: 2.5rem; background: rgba(15, 23, 42, 0.4); border-top: 1px solid rgba(255,255,255,0.05); }
    .lesson-form-card { background: rgba(30, 41, 59, 0.6); padding: 2.5rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
    .lesson-form-card h4 { margin: 0 0 2rem; font-size: 1.3rem; font-weight: 800; color: #fff; }

    .form-group { margin-bottom: 1.8rem; }
    .form-group label { display: block; margin-bottom: 0.8rem; color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .form-control { width: 100%; padding: 1rem 1.2rem; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; outline: none; transition: all 0.2s; font-size: 1rem; }
    .form-control:focus { border-color: #10b981; background: rgba(15, 23, 42, 0.8); box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    
    .lesson-actions-inline { display: flex; align-items: center; gap: 1.2rem; }
    .btn-icon-sm { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #10b981; cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; transition: all 0.2s; }
    .btn-icon-sm:hover { background: rgba(16, 185, 129, 0.15); transform: scale(1.1); }

    /* Modal Styles */
    .preview-overlay { 
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(15, 23, 42, 0.9); display: flex; align-items: center; justify-content: center; z-index: 1000;
      backdrop-filter: blur(15px);
    }
    .preview-modal { 
      background: #1e293b; width: 90%; max-width: 850px; border-radius: 28px; 
      overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 30px 60px rgba(0,0,0,0.5);
      animation: modalSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes modalSlide { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

    .modal-header { padding: 2rem 2.5rem; background: rgba(15, 23, 42, 0.5); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .modal-header h3 { margin: 0; font-size: 1.3rem; font-weight: 800; color: #fff; }
    .close-btn { background: rgba(255,255,255,0.05); border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .close-btn:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    
    .modal-body { padding: 2.5rem; max-height: 80vh; overflow-y: auto; }
    .preview-media { width: 100%; max-height: 480px; aspect-ratio: 16/9; border-radius: 20px; background: #000; border: none; box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
    
    /* PDF Card Refined */
    .pdf-preview-card { background: rgba(15, 23, 42, 0.4); padding: 2rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); text-align: center; }
    .doc-icon { font-size: 3rem; margin-bottom: 1rem; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); }
    .doc-info h4 { font-size: 1.3rem; margin: 0 0 0.5rem; color: #fff; font-weight: 800; }
    .doc-info p { color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .iframe-preview-mini { margin-top: 1.5rem; border-radius: 16px; overflow: hidden; height: 350px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 15px 35px rgba(0,0,0,0.3); }
    .mini-pdf-frame { width: 100%; height: 100%; border: none; }

    /* Article Card Refined */
    .article-preview-card { background: rgba(15, 23, 42, 0.4); padding: 3rem 2rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; text-align: center; }
    .link-icon { font-size: 3rem; margin-bottom: 1rem; }
    .link-details h4 { font-size: 1.4rem; font-weight: 800; margin: 0 0 0.5rem; color: #fff; }
    .link-details code { display: inline-block; background: rgba(16, 185, 129, 0.1); padding: 0.6rem 1.2rem; border-radius: 12px; color: #10b981; margin: 1rem 0; font-size: 0.85rem; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.2); word-break: break-all; }
    .link-details p { color: #64748b; font-size: 1rem; margin-bottom: 2rem; max-width: 450px; line-height: 1.5; }
    
    .btn-outline-premium { 
      padding: 1.2rem 3rem; border: 2px solid #10b981; color: #10b981; 
      background: none; border-radius: 16px; font-weight: 800; cursor: pointer; 
      text-decoration: none; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px;
    }
    .btn-outline-premium:hover { background: #10b981; color: #fff; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4); transform: translateY(-3px); }

    .btn-text-sm { background: none; border: none; color: #94a3b8; font-weight: 700; cursor: pointer; font-size: 0.75rem; margin-left: 1rem; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; }
    .btn-text-sm:hover { color: #10b981; transform: scale(1.05); }
    .inline-edit-input { background: rgba(15, 23, 42, 0.8); border: 1px solid #10b981; color: #fff; padding: 0.5rem 1rem; border-radius: 10px; font-size: 1.2rem; font-weight: 700; width: 400px; outline: none; }
    
    .source-toggle { display: flex; background: rgba(15, 23, 42, 0.6); padding: 0.3rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
    .source-toggle button { flex: 1; padding: 0.8rem; border: none; background: none; color: #64748b; cursor: pointer; font-size: 0.85rem; font-weight: 700; transition: all 0.3s; border-radius: 10px; }
    .source-toggle button.active { background: #10b981; color: #fff; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); }

    .form-actions { display: flex; justify-content: flex-end; gap: 1.2rem; margin-top: 2rem; }

    .btn-primary { background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; padding: 1rem 2.5rem; border-radius: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3); }
    .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 1rem 2.5rem; border-radius: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
    .btn-sm { padding: 0.7rem 1.5rem; font-size: 0.85rem; }
    .text-danger { color: #ef4444 !important; }
    .text-danger:hover { color: #f87171 !important; }

    .empty-curriculum { text-align: center; padding: 4rem 2rem; color: #64748b; }
    .empty-curriculum .icon { font-size: 4rem; margin-bottom: 1rem; }
  `]
})
export class CourseCurriculumComponent implements OnInit {
  courseId: number = 0;
  course: any;
  sections: any[] = [];
  loading = false;
  previewLesson: any = null;
  editingSectionId: number | null = null;

  showAddSection = false;
  newSectionTitle = '';
  
  activeSectionId: number | null = null;
  useExternalUrl = false;
  newLesson: any = {
    title: '',
    contentType: 'VIDEO',
    contentUrl: '',
    isPreview: false
  };
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService,
    private courseService: CourseService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.courseId) {
      this.loadCourse();
      this.loadCurriculum();
    }
  }

  loadCourse() {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (res) => this.course = res.data,
      error: (err) => console.error('Failed to load course')
    });
  }

  loadCurriculum() {
    this.contentService.getSectionsByCourse(this.courseId).subscribe({
      next: (res) => this.sections = res.data,
      error: (err) => console.error('Failed to load curriculum')
    });
  }

  onAddSection() {
    if (!this.newSectionTitle) return;
    const sectionData = { courseId: this.courseId, title: this.newSectionTitle, order: this.sections.length + 1 };
    this.contentService.createSection(sectionData).subscribe({
      next: () => { this.newSectionTitle = ''; this.showAddSection = false; this.loadCurriculum(); },
      error: () => alert('Failed to add section')
    });
  }

  onUpdateSection(section: any) {
    this.editingSectionId = null;
    this.contentService.updateSection(section.sectionId, { courseId: this.courseId, title: section.title, order: section.order }).subscribe({
      next: () => this.loadCurriculum(),
      error: () => alert('Failed to update section')
    });
  }

  onDeleteSection(id: number) {
    if (confirm('Delete this section?')) {
      this.contentService.deleteSection(id).subscribe({ next: () => this.loadCurriculum(), error: () => alert('Failed to delete') });
    }
  }

  onPreviewLesson(lesson: any) {
    // Resolve local upload paths to full ContentService URL
    if (lesson.contentUrl && lesson.contentUrl.startsWith('/uploads/')) {
      this.previewLesson = { ...lesson, contentUrl: 'http://localhost:6003' + lesson.contentUrl };
    } else {
      this.previewLesson = lesson;
    }
  }

  getSafeUrl(url: string): SafeResourceUrl {
    if (!url) return '';
    let safeUrl = url;
    // Resolve local uploads
    if (safeUrl.startsWith('/uploads/')) safeUrl = 'http://localhost:6003' + safeUrl;
    // YouTube embed conversion
    if (safeUrl.includes('youtube.com/watch?v=')) safeUrl = safeUrl.replace('watch?v=', 'embed/');
    else if (safeUrl.includes('youtu.be/')) safeUrl = 'https://www.youtube.com/embed/' + safeUrl.split('youtu.be/')[1]?.split('?')[0];
    return this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onAddLesson(sectionId: number) {
    if (!this.newLesson.title) return;
    this.loading = true;
    const formData = new FormData();
    formData.append('sectionId', sectionId.toString());
    formData.append('title', this.newLesson.title);
    formData.append('contentType', this.newLesson.contentType);
    formData.append('isPreview', this.newLesson.isPreview.toString());
    formData.append('displayOrder', (this.sections.find(s => s.sectionId === sectionId)?.lessons?.length + 1 || 1).toString());

    if (this.useExternalUrl) formData.append('contentUrl', this.newLesson.contentUrl);
    else if (this.selectedFile) formData.append('file', this.selectedFile);

    this.contentService.createLesson(formData).subscribe({
      next: () => {
        this.loading = false; this.activeSectionId = null;
        this.newLesson = { title: '', contentType: 'VIDEO', contentUrl: '', isPreview: false };
        this.selectedFile = null; this.useExternalUrl = false;
        this.loadCurriculum();
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.error?.title || 'Error';
        alert('Failed to save lesson: ' + errorMsg);
        this.loading = false;
      }
    });
  }

  onDeleteLesson(id: number) {
    if (confirm('Delete this lesson?')) {
      this.contentService.deleteLesson(id).subscribe({ next: () => this.loadCurriculum(), error: () => alert('Failed to delete') });
    }
  }
}
