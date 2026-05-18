import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = `${environment.apiUrl}/content`;

  constructor(private http: HttpClient) {}

  getSectionsByCourse(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/sections`);
  }

  createSection(sectionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sections`, sectionData);
  }

  updateSection(id: number, sectionData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/sections/${id}`, sectionData);
  }

  deleteSection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sections/${id}`);
  }

  createLesson(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/lessons`, formData);
  }

  deleteLesson(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/lessons/${id}`);
  }

  getLessonById(lessonId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/lessons/${lessonId}`);
  }
}
