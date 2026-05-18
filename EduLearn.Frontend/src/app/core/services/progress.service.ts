import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = `${environment.apiUrl}/Progress`;

  constructor(private http: HttpClient) {}

  getCourseProgress(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/course/${courseId}`);
  }

  updateLessonProgress(courseId: number, lessonId: number, data: { watchedSeconds: number, isCompleted: boolean }): Observable<any> {
    return this.http.put(`${this.apiUrl}/course/${courseId}/lesson/${lessonId}`, data);
  }

  getMyProgress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-progress`);
  }

  getMyCertificates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-certificates`);
  }

  getCertificateByNumber(certNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/certificate/${certNumber}`);
  }
}
