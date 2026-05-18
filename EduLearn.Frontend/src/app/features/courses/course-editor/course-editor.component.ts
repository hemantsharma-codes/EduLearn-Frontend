import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { resolveMediaUrl } from '../../../core/utils/url.helper';

@Component({
  selector: 'app-course-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="editor-wrapper">
      <div class="container">
        <header class="page-header">
          <div class="header-content">
            <a routerLink="/dashboard/instructor" class="back-link">← Back to Dashboard</a>
            <h1>{{ isEditMode ? 'Edit Course Settings' : 'Create New Course Draft' }}</h1>
            <p>{{ isEditMode ? 'Update your course details and thumbnail.' : 'Start by filling in the basic information about your course.' }}</p>
          </div>
        </header>

        <main class="form-container">
          <div class="form-card">
            <div class="card-header">
              <h3>Course Basics</h3>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label>Course Title</label>
                <input type="text" [(ngModel)]="courseData.title" class="form-control" placeholder="e.g. Complete Web Development Bootcamp">
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="courseData.description" class="form-control" rows="5" placeholder="What will students learn?"></textarea>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Category</label>
                  <select [(ngModel)]="courseData.category" class="form-control">
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="DSA">DSA</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Level</label>
                  <select [(ngModel)]="courseData.level" class="form-control">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Price (INR)</label>
                  <input type="number" [(ngModel)]="courseData.price" class="form-control">
                </div>
                <div class="form-group">
                  <label>Language</label>
                  <input type="text" [(ngModel)]="courseData.language" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label>Course Thumbnail</label>
                <div class="thumbnail-uploader">
                  <div class="preview" *ngIf="thumbPreview">
                    <img [src]="resolveThumb(thumbPreview)" alt="Course Thumbnail">
                    <button class="btn-tool" (click)="thumbUpload.click()" title="Change Image">✏️</button>
                  </div>
                  <div class="upload-placeholder" *ngIf="!thumbPreview" (click)="thumbUpload.click()">
                    <span>📸</span>
                    <p>Click to upload thumbnail</p>
                  </div>
                  <input type="file" #thumbUpload (change)="onFileSelected($event)" hidden accept="image/*">
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button class="btn-secondary" routerLink="/dashboard/instructor">Cancel</button>
              <button class="btn-primary" (click)="onSubmit()" [disabled]="loading">
                {{ loading ? 'Saving...' : (isEditMode ? 'Update Course' : 'Save and Continue') }}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .editor-wrapper { min-height: 100vh; background: #0f172a; color: #f1f5f9; padding: 3rem 1rem; }
    .container { max-width: 700px; margin: 0 auto; }
    .page-header { margin-bottom: 2.5rem; }
    .header-content { display: flex; flex-direction: column; gap: 0.5rem; }
    .back-link { color: #94a3b8; text-decoration: none; font-size: 0.9rem; }
    .page-header h1 { font-size: 2rem; color: #fff; margin: 0; }
    .page-header p { color: #94a3b8; margin: 0; }
    .form-card { background: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; }
    .card-header { padding: 1.5rem; background: #0f172a; border-bottom: 1px solid #334155; }
    .card-header h3 { margin: 0; font-size: 1.1rem; color: #fff; }
    .card-body { padding: 2rem; }
    .card-footer { padding: 1.5rem; background: #0f172a; border-top: 1px solid #334155; display: flex; justify-content: flex-end; gap: 1rem; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; color: #94a3b8; font-size: 0.85rem; }
    .form-control { width: 100%; padding: 0.75rem 1rem; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #fff; outline: none; transition: border-color 0.2s; }
    .form-control:focus { border-color: #10b981; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .thumbnail-uploader { width: 100%; height: 200px; border: 2px dashed #334155; border-radius: 12px; position: relative; overflow: hidden; }
    .thumbnail-uploader:hover { border-color: #10b981; }
    .preview { width: 100%; height: 100%; position: relative; }
    .preview img { width: 100%; height: 100%; object-fit: cover; }
    .btn-tool { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); border: none; padding: 0.5rem; border-radius: 50%; cursor: pointer; }
    .upload-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; }
    .upload-placeholder span { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .upload-placeholder p { color: #64748b; font-size: 0.9rem; margin: 0; }
    .btn-primary { background: #10b981; color: #fff; border: none; padding: 0.8rem 2rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
    .btn-primary:hover { background: #0da371; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { background: #334155; color: #fff; border: none; padding: 0.8rem 2rem; border-radius: 8px; font-weight: 700; cursor: pointer; }
  `]
})
export class CourseEditorComponent implements OnInit {
  courseId: number | null = null;
  isEditMode = false;
  loading = false;
  courseData = { title: '', description: '', category: 'Web Development', level: 'Beginner', price: 499, language: 'English' };
  selectedFile: File | null = null;
  thumbPreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  resolveThumb(url: string | null | undefined): string {
    return resolveMediaUrl(url);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId = Number(id);
      this.isEditMode = true;
      this.loadCourseData();
    }
  }

  loadCourseData() {
    if (!this.courseId) return;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (res: any) => {
        const data = res.data;
        this.courseData = { title: data.title, description: data.description, category: data.category, level: data.level, price: data.price, language: data.language };
        this.thumbPreview = data.thumbnailUrl;
      },
      error: (err: any) => alert('Failed to load course data')
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.thumbPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.courseData.title || !this.courseData.description) {
      alert('Please fill in all required fields.');
      return;
    }
    this.loading = true;
    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, this.courseData).subscribe({
        next: () => { alert('Course updated successfully!'); this.router.navigate(['/dashboard/instructor']); },
        error: (err: any) => { alert('Failed to update course'); this.loading = false; }
      });
      return;
    }
    const formData = new FormData();
    formData.append('title', this.courseData.title);
    formData.append('description', this.courseData.description);
    formData.append('category', this.courseData.category);
    formData.append('level', this.courseData.level);
    formData.append('price', this.courseData.price.toString());
    formData.append('language', this.courseData.language);
    if (this.selectedFile) formData.append('thumbnail', this.selectedFile);

    this.courseService.createCourse(formData).subscribe({
      next: (res: any) => { alert('Course created successfully!'); this.router.navigate(['/instructor/courses', res.data.courseId, 'curriculum']); },
      error: (err: any) => { alert('Failed to create course'); this.loading = false; }
    });
  }
}
