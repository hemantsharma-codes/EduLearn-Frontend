import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { AuthCallbackComponent } from './features/auth/auth-callback.component';
import { StudentDashboardComponent } from './features/dashboard/student-dashboard.component';
import { InstructorDashboardComponent } from './features/dashboard/instructor-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard.component';
import { CourseEditorComponent } from './features/courses/course-editor/course-editor.component';
import { CourseCurriculumComponent } from './features/courses/course-curriculum/course-curriculum.component';
import { CourseListComponent } from './features/courses/course-list/course-list.component';
import { CourseDetailComponent } from './features/courses/course-detail.component';
import { CheckoutComponent } from './features/courses/checkout.component';
import { CoursePlayerComponent } from './features/courses/course-player.component';
import { LandingPageComponent } from './features/home/landing-page.component';
import { CertificateViewComponent } from './features/dashboard/certificate-view.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: CourseListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: 'checkout/:id', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'learn/:id', component: CoursePlayerComponent, canActivate: [authGuard] },
  { path: 'certificate/:id', component: CertificateViewComponent },
  { 
    path: 'dashboard/student', 
    component: StudentDashboardComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard/instructor', 
    component: InstructorDashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'dashboard/admin', 
    component: AdminDashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'instructor/courses/new', 
    component: CourseEditorComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'instructor/courses/:id/edit', 
    component: CourseEditorComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'instructor/courses/:id/curriculum', 
    component: CourseCurriculumComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];
