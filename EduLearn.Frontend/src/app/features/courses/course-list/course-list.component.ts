import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { resolveMediaUrl } from '../../../core/utils/url.helper';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="catalog-wrapper">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1>Unlock Your Potential with <span>EduLearn</span></h1>
            <p>Browse over 1,000+ professional courses taught by industry experts.</p>
            <div class="search-bar-container glass">
              <span class="search-icon">🔍</span>
              <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="What do you want to learn today?">
              <button class="btn-search">Search</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Filters & Results -->
      <div class="container main-catalog">
        <aside class="filters-sidebar">
          <div class="filter-group">
            <h4>Categories</h4>
            <div class="filter-list">
              <label *ngFor="let cat of categories" class="filter-item">
                <input type="radio" name="category" [value]="cat" [(ngModel)]="selectedCategory" (change)="onFilter()">
                <span>{{ cat }}</span>
              </label>
            </div>
          </div>
          
          <div class="filter-group">
            <h4>Level</h4>
            <div class="filter-list">
              <label *ngFor="let level of ['Beginner', 'Intermediate', 'Advanced']" class="filter-item">
                <input type="checkbox" [value]="level" (change)="toggleLevel(level)" [checked]="selectedLevels.includes(level)">
                <span>{{ level }}</span>
              </label>
            </div>
          </div>
        </aside>

        <main class="results-area">
          <div class="results-header">
            <p>Showing <strong>{{ filteredCourses.length }}</strong> results</p>
            <div class="sort-container">
              <span class="sort-label">🔄 Sort by:</span>
              <select class="sort-select glass" [(ngModel)]="selectedSort" (change)="onSortChange()">
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div class="courses-grid" *ngIf="!loading; else loader">
            <div *ngFor="let course of filteredCourses" class="course-card glass">
              <div class="card-thumb">
                <img [src]="resolveThumb(course.thumbnailUrl)" alt="Course">
                <div class="badge">{{ course.category }}</div>
              </div>
              <div class="card-body">
                <h3 class="course-title">{{ course.title }}</h3>
                <p class="instructor">By <span>{{ course.instructorName || 'Expert Instructor' }}</span></p>
                <div class="meta">
                   <span class="rating">⭐ 4.8</span>
                   <span class="students">👥 {{ course.enrollmentCount || 0 }} Students</span>
                </div>
                <div class="card-footer">
                  <div class="price">₹{{ course.price }}</div>
                  <button class="btn-enroll" [routerLink]="['/courses', course.courseId]">View Details</button>
                </div>
              </div>
            </div>
          </div>

          <ng-template #loader>
            <div class="catalog-loader">
              <div class="spinner"></div>
              <p>Loading amazing courses...</p>
            </div>
          </ng-template>

          <div *ngIf="filteredCourses.length === 0 && !loading" class="no-results">
             <div class="icon">🔍</div>
             <h3>No courses found</h3>
             <p>Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .catalog-wrapper { min-height: 100vh; background: radial-gradient(circle at top right, #1e293b, #0f172a); color: #f1f5f9; padding-bottom: 5rem; }
    .container { max-width: 1300px; margin: 0 auto; padding: 0 2rem; }

    /* Hero Section */
    .hero-section { 
      padding: 6rem 0 4rem; 
      text-align: center;
      background: transparent;
    }
    .hero-content h1 { font-size: 3.5rem; font-weight: 800; letter-spacing: -2px; margin-bottom: 1.5rem; color: #fff; }
    .hero-content h1 span { color: #10b981; text-shadow: 0 0 30px rgba(16, 185, 129, 0.3); }
    .hero-content p { font-size: 1.25rem; color: #94a3b8; margin-bottom: 3rem; }

    .search-bar-container { 
      max-width: 700px; margin: 0 auto; display: flex; align-items: center; 
      padding: 0.5rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);
      background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px);
    }
    .search-icon { padding: 0 1.5rem; font-size: 1.2rem; opacity: 0.6; }
    .search-bar-container input { 
      flex: 1; background: none; border: none; color: #fff; padding: 1rem 0; 
      font-size: 1.1rem; outline: none;
    }
    .btn-search { 
      background: #10b981; color: #fff; border: none; padding: 1rem 2.5rem; 
      border-radius: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    }
    .btn-search:hover { transform: scale(1.05); background: #059669; }

    /* Main Catalog Layout */
    .main-catalog { display: grid; grid-template-columns: 280px 1fr; gap: 4rem; margin-top: 2rem; }

    /* Sidebar Filters */
    .filters-sidebar { display: flex; flex-direction: column; gap: 3rem; }
    .filter-group h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; color: #fff; border-left: 3px solid #10b981; padding-left: 1rem; }
    .filter-list { display: flex; flex-direction: column; gap: 1rem; }
    .filter-item { display: flex; align-items: center; gap: 1rem; cursor: pointer; color: #94a3b8; transition: color 0.2s; }
    .filter-item:hover { color: #fff; }
    .filter-item input { accent-color: #10b981; width: 18px; height: 18px; }

    /* Results Area */
    .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; background: rgba(255, 255, 255, 0.03); padding: 1.5rem 2.5rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
    .sort-container { display: flex; align-items: center; gap: 1rem; background: rgba(15, 23, 42, 0.6); padding: 0.5rem 1.2rem; border-radius: 14px; border: 1px solid rgba(16, 185, 129, 0.2); }
    .sort-label { font-size: 0.75rem; color: #10b981; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 0.5rem; }
    .sort-select { background: transparent; border: none; color: #fff; padding: 0.4rem; outline: none; cursor: pointer; font-weight: 700; font-size: 0.9rem; font-family: 'Inter', sans-serif; }
    .sort-select option { background: #0f172a; color: #fff; }

    /* Course Grid */
    .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2.5rem; }
    .course-card { 
      border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; 
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); background: rgba(255, 255, 255, 0.03);
    }
    .course-card:hover { transform: translateY(-10px); border-color: rgba(16, 185, 129, 0.3); background: rgba(255, 255, 255, 0.05); }
    
    .card-thumb { position: relative; height: 200px; overflow: hidden; }
    .card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    .course-card:hover .card-thumb img { transform: scale(1.1); }
    .badge { position: absolute; top: 1.2rem; left: 1.2rem; background: rgba(16, 185, 129, 0.9); padding: 0.4rem 1rem; border-radius: 10px; font-size: 0.75rem; font-weight: 800; color: #fff; backdrop-filter: blur(10px); }

    .card-body { padding: 1.8rem; }
    .course-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.8rem; color: #fff; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .instructor { font-size: 0.9rem; color: #94a3b8; margin-bottom: 1.5rem; }
    .instructor span { color: #f1f5f9; font-weight: 600; }
    
    .meta { display: flex; gap: 1.5rem; margin-bottom: 1.8rem; font-size: 0.85rem; color: #64748b; }
    .rating { color: #f59e0b; font-weight: 700; }

    .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
    .price { font-size: 1.5rem; font-weight: 800; color: #fff; }
    .btn-enroll { background: none; border: 1.5px solid #10b981; color: #10b981; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
    .btn-enroll:hover { background: #10b981; color: #fff; box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3); }

    .catalog-loader { text-align: center; padding: 8rem 0; color: #94a3b8; }
    .spinner { width: 50px; height: 50px; border: 4px solid rgba(16, 185, 129, 0.1); border-top-color: #10b981; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .no-results { text-align: center; padding: 6rem 2rem; color: #64748b; }
    .no-results .icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.3; }

    .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); }
  `]
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  filteredCourses: any[] = [];
  loading = true;
  searchQuery = '';
  selectedCategory = 'All';
  selectedLevels: string[] = [];
  selectedSort = 'popular';
  categories = ['All', 'Web Development', 'Mobile Apps', 'Data Science', 'Design', 'Marketing', 'DSA'];

  constructor(private courseService: CourseService) {}

  resolveThumb(url: string): string {
    return resolveMediaUrl(url);
  }

  ngOnInit() {
    this.fetchCourses();
  }

  fetchCourses() {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (res) => {
        this.courses = res.data;
        this.filteredCourses = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch courses', err);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onFilter() {
    this.applyFilters();
  }

  onSortChange() {
    this.applySort();
  }

  toggleLevel(level: string) {
    const index = this.selectedLevels.indexOf(level);
    if (index > -1) {
      this.selectedLevels.splice(index, 1);
    } else {
      this.selectedLevels.push(level);
    }
    this.applyFilters();
  }

  applyFilters() {
    let results = this.courses.filter(c => {
      const searchStr = this.searchQuery.toLowerCase();
      const matchesSearch = 
        c.title.toLowerCase().includes(searchStr) || 
        c.category.toLowerCase().includes(searchStr) ||
        (c.description && c.description.toLowerCase().includes(searchStr)) ||
        (c.instructorName && c.instructorName.toLowerCase().includes(searchStr));
        
      const matchesCategory = this.selectedCategory === 'All' || c.category === this.selectedCategory;
      
      const matchesLevel = this.selectedLevels.length === 0 || this.selectedLevels.includes(c.level);

      return matchesSearch && matchesCategory && matchesLevel;
    });

    this.filteredCourses = results;
    this.applySort();
  }

  applySort() {
    if (this.selectedSort === 'popular') {
      this.filteredCourses.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
    } else if (this.selectedSort === 'newest') {
      this.filteredCourses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.selectedSort === 'priceLow') {
      this.filteredCourses.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort === 'priceHigh') {
      this.filteredCourses.sort((a, b) => b.price - a.price);
    }
  }
}
