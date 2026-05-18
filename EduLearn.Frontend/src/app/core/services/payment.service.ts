import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateOrderRequest {
  courseId: number;
  amount: number;
}

export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) { }

  createOrder(dto: CreateOrderRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, dto);
  }

  verifyPayment(dto: PaymentVerifyRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, dto);
  }
}
