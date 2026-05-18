import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProgressService } from '../../core/services/progress.service';
import { CourseService } from '../../core/services/course.service';

@Component({
  selector: 'app-certificate-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cert-page">
      <div class="nav-header">
        <a routerLink="/dashboard/student" class="back-link">← Back to Dashboard</a>
        <button class="btn-print" (click)="printCert()">Download / Print PDF</button>
      </div>

      <div class="certificate-container glass-effect" id="certificate">
        <div class="border-outer">
          <div class="border-inner">
            <div class="cert-content">
              <div class="logo">EduLearn</div>
              <div class="cert-title">Certificate of Achievement</div>
              <div class="cert-subtitle">This is to certify that</div>
              
              <div class="student-name">{{ studentName }}</div>
              
              <div class="cert-text">
                This certificate recognizes the dedication, hard work, and academic excellence 
                demonstrated throughout the duration of this program. By completing all required 
                modules and assessments, the recipient has proven their proficiency and 
                mastery in the subject matter of
              </div>
              
              <div class="course-name">{{ courseTitle }}</div>
              
              <div class="cert-details">
                <div class="detail-item">
                  <span class="label">Issue Date</span>
                  <span class="val">{{ issueDate | date:'longDate' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Instructor</span>
                  <span class="val">{{ instructorName }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Certificate ID</span>
                  <span class="val">{{ certId }}</span>
                </div>
              </div>

              <div class="footer-sign">
                <div class="signature">
                  <div class="sign-line"></div>
                  <span>Academic Director</span>
                </div>
                <div class="seal">
                  <div class="seal-inner">OFFICIAL SEAL</div>
                </div>
                <div class="signature">
                  <div class="sign-line"></div>
                  <span>Lead Instructor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cert-page { min-height: 100vh; background: #0f172a; padding: 2rem; display: flex; flex-direction: column; align-items: center; }
    .nav-header { width: 100%; max-width: 1000px; display: flex; justify-content: space-between; margin-bottom: 2rem; }
    .back-link { color: #94a3b8; text-decoration: none; font-weight: 600; }
    .btn-print { background: #10b981; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 700; transition: 0.3s; }
    .btn-print:hover { background: #059669; transform: translateY(-2px); }

    .certificate-container { 
      width: 100%; max-width: 900px; height: 636px;
      background: #fff; color: #1e293b; padding: 25px; position: relative; 
      box-shadow: 0 50px 100px rgba(0,0,0,0.5); overflow: hidden;
    }
    
    .border-outer { border: 12px solid #1e293b; height: 100%; padding: 8px; }
    .border-inner { border: 2px solid #bba14f; height: 100%; padding: 30px; position: relative; display: flex; flex-direction: column; }
    
    .cert-content { text-align: center; display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
    .logo { font-size: 1.8rem; font-weight: 900; color: #10b981; margin-bottom: 0.5rem; letter-spacing: -1px; }
    .cert-title { font-size: 2.5rem; font-family: 'Playfair Display', serif; color: #bba14f; margin-bottom: 0.5rem; text-transform: uppercase; }
    .cert-subtitle { font-size: 1rem; color: #64748b; margin-bottom: 1rem; }
    .student-name { font-size: 3rem; font-family: 'Great Vibes', cursive; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin: 0 auto 1rem; min-width: 300px; max-width: 80%; }
    .cert-text { font-size: 0.85rem; color: #64748b; margin: 0 auto 1rem; max-width: 85%; line-height: 1.5; }
    .course-name { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0 auto 1.5rem; max-width: 90%; line-height: 1.2; word-wrap: break-word; }

    .cert-details { display: flex; justify-content: center; gap: 3rem; margin-bottom: 1rem; }
    .detail-item { display: flex; flex-direction: column; align-items: center; }
    .detail-item .label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }
    .detail-item .val { font-size: 0.9rem; font-weight: 600; }

    .footer-sign { width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 20px; }
    .signature { display: flex; flex-direction: column; align-items: center; width: 150px; }
    .sign-line { width: 100%; height: 1px; background: #cbd5e1; margin-bottom: 0.4rem; }
    .signature span { font-size: 0.75rem; color: #64748b; font-weight: 600; }

    .seal { width: 100px; height: 100px; background: #bba14f; border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: rotate(-15deg); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
    .seal-inner { border: 2px dashed rgba(255,255,255,0.5); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: white; font-weight: 900; text-align: center; }

    @media print {
      .cert-page { background: white; padding: 0; }
      .nav-header { display: none; }
      .certificate-container { box-shadow: none; }
    }
  `]
})
export class CertificateViewComponent implements OnInit {
  certId: string = '';
  studentName: string = 'Loading...';
  courseTitle: string = 'Loading Course...';
  instructorName: string = 'Lead Instructor';
  issueDate: Date = new Date();
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private progressService: ProgressService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.certId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCertificateDetails();
  }

  loadCertificateDetails() {
    this.progressService.getCertificateByNumber(this.certId).subscribe({
      next: (res) => {
        const certData = res.data;
        this.issueDate = new Date(certData.issuedAt);
        
        // Fetch Course Details
        this.courseService.getCourseById(certData.courseId).subscribe({
          next: (courseRes) => {
            const course = courseRes.data;
            this.courseTitle = course.title;
            this.instructorName = course.instructorName || 'Academic Lead';
          }
        });

        // Get Student Name from Auth or Certificate
        this.authService.currentUser$.subscribe(user => {
          if (user) {
            this.studentName = user.name;
          }
        });
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading certificate', err);
        this.loading = false;
      }
    });
  }

  printCert() {
    window.print();
  }
}
