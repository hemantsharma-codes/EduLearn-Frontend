import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) { }

  getCourses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getInstructorCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/instructor/my-courses`);
  }

  createCourse(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  publishCourse(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/publish`, {});
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateCourse(id: number, courseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, courseData);
  }

  getCourseById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  approveCourse(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/approve`, {});
  }

  getAllCoursesForAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/all`);
  }
}
