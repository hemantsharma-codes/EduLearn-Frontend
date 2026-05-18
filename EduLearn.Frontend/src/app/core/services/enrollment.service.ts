import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = `${environment.apiUrl}/enrollments`;

  constructor(private http: HttpClient) {}

  getMyEnrollments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-enrollments`);
  }

  isEnrolled(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/is-enrolled/${courseId}`);
  }

  enroll(courseId: number): Observable<any> {
    return this.http.post(this.apiUrl, { courseId });
  }

  dropCourse(courseId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/course/${courseId}/drop`, {});
  }
}
