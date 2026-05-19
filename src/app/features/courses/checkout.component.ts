import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { PaymentService } from '../../core/services/payment.service';
import { resolveMediaUrl } from '../../core/utils/url.helper';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="checkout-container animate-fade-in">
      <div class="checkout-card glass">
        <!-- LEFT: Payment Details -->
        <div class="payment-section">
          <header class="section-header">
            <button class="back-btn" routerLink="/courses">← Back</button>
            <h1>Secure Checkout</h1>
            <p>Complete your enrollment in seconds.</p>
          </header>

          <form class="payment-form" (ngSubmit)="onPay()">
            <div class="info-alert">
              <span class="icon">🛡️</span>
              <p>Secure Payment: You will be redirected to Razorpay's secure payment portal to complete your transaction.</p>
            </div>

            <div class="billing-summary glass" style="margin-top: 1rem; padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
               <p style="margin: 0; color: #94a3b8; font-size: 0.9rem;">Course: <b>{{ course?.title }}</b></p>
               <p style="margin: 0.5rem 0 0; font-size: 1.2rem; color: #fff; font-weight: 800;">Amount to Pay: ₹ {{ course?.price | number }}</p>
            </div>

            <button type="submit" class="pay-btn" [disabled]="loading || !course">
              <span *ngIf="!loading">Pay Securely via Razorpay</span>
              <span *ngIf="loading" class="loader">Processing...</span>
            </button>
          </form>
        </div>

        <!-- RIGHT: Order Summary -->
        <div class="summary-section">
          <h3>Order Summary</h3>
          <div class="course-mini-card" *ngIf="course">
            <img [src]="resolveThumb(course.thumbnailUrl)" alt="Course">
            <div class="mini-info">
              <h4>{{ course.title }}</h4>
              <p>By {{ course.instructorName }}</p>
            </div>
          </div>

          <div class="price-breakdown">
            <div class="price-row">
               <span>Course Price</span>
               <span>₹ {{ course?.price | number }}</span>
            </div>
            <div class="price-row">
               <span>Platform Fee</span>
               <span class="text-free">FREE</span>
            </div>
            <div class="divider"></div>
            <div class="price-row total">
               <span>Total Amount</span>
               <span>₹ {{ course?.price | number }}</span>
            </div>
          </div>

          <div class="trust-badges">
             <div class="badge">🔒 256-bit SSL</div>
             <div class="badge">✔️ 30-Day Guarantee</div>
          </div>
        </div>
      </div>

      <!-- SUCCESS OVERLAY -->
      <div class="success-overlay glass" *ngIf="paymentSuccess">
         <div class="success-card animate-scale-up">
            <div class="check-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Welcome to <b>{{ course?.title }}</b>. Your enrollment is now active.</p>
            <button class="btn btn-primary" routerLink="/dashboard/student">Go to Dashboard</button>
         </div>
      </div>

      <!-- RAZORPAY SIMULATION MODAL -->
      <div class="success-overlay glass" *ngIf="showRazorpayModal">
         <div class="razorpay-modal animate-scale-up">
            <div class="modal-top">
               <div class="rzp-header">
                  <div class="rzp-brand">
                     <span class="rzp-logo">⚡</span>
                     <span class="rzp-name">Razorpay Secure</span>
                  </div>
                  <button class="rzp-close" (click)="showRazorpayModal = false" [disabled]="processingMockPay">✕</button>
               </div>
               <div class="rzp-merchant">
                  <h3>EduLearn Technologies</h3>
                  <p>Order ID: {{ mockOrderData?.orderId }}</p>
               </div>
               <div class="rzp-amount">₹ {{ course?.price | number }}</div>
            </div>
            
            <div class="modal-body" *ngIf="!processingMockPay">
               <p class="section-title">Select Payment Method</p>
               <div class="payment-methods">
                  <label class="method-option" [class.selected]="razorpayMethod === 'upi'">
                     <input type="radio" name="method" [(ngModel)]="razorpayMethod" value="upi" hidden>
                     <span class="m-icon">📱</span>
                     <div class="m-details">
                        <h4>UPI / QR</h4>
                        <p>Google Pay, PhonePe, Paytm</p>
                     </div>
                     <span class="check" *ngIf="razorpayMethod === 'upi'">✓</span>
                  </label>

                  <label class="method-option" [class.selected]="razorpayMethod === 'card'">
                     <input type="radio" name="method" [(ngModel)]="razorpayMethod" value="card" hidden>
                     <span class="m-icon">💳</span>
                     <div class="m-details">
                        <h4>Credit / Debit Card</h4>
                        <p>Visa, Mastercard, RuPay</p>
                     </div>
                     <span class="check" *ngIf="razorpayMethod === 'card'">✓</span>
                  </label>

                  <label class="method-option" [class.selected]="razorpayMethod === 'nb'">
                     <input type="radio" name="method" [(ngModel)]="razorpayMethod" value="nb" hidden>
                     <span class="m-icon">🏦</span>
                     <div class="m-details">
                        <h4>Net Banking</h4>
                        <p>HDFC, SBI, ICICI, Axis</p>
                     </div>
                     <span class="check" *ngIf="razorpayMethod === 'nb'">✓</span>
                  </label>
               </div>

               <div class="rzp-footer">
                  <button class="rzp-pay-btn" (click)="confirmRazorpayMockPay()">Pay ₹ {{ course?.price | number }}</button>
                  <div class="rzp-secure-badge">🔒 Secured by Razorpay</div>
               </div>
            </div>

            <div class="modal-body processing-box" *ngIf="processingMockPay">
               <div class="rzp-spinner"></div>
               <h3>Connecting to Bank...</h3>
               <p>Please do not refresh or close this window.</p>
            </div>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container { min-height: 100vh; background: #0b0e14; display: flex; align-items: center; justify-content: center; padding: 2rem; font-family: 'Inter', sans-serif; color: #e2e8f0; }
    .checkout-card { width: 100%; max-width: 1000px; display: grid; grid-template-columns: 1.2fr 0.8fr; border-radius: 30px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
    
    /* LEFT SECTION */
    .payment-section { padding: 3rem; background: rgba(15, 23, 42, 0.4); }
    .section-header { margin-bottom: 2.5rem; }
    .back-btn { background: none; border: none; color: #10b981; cursor: pointer; font-weight: 600; margin-bottom: 1rem; padding: 0; }
    .section-header h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; color: #fff; }
    .section-header p { color: #94a3b8; }

    .payment-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.6rem; font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
    .form-group input { width: 100%; padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; outline: none; transition: 0.3s; }
    .form-group input:focus { border-color: #10b981; background: rgba(255,255,255,0.05); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

    .input-with-icon { position: relative; }
    .input-with-icon .icon { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); opacity: 0.5; }

    .info-alert { display: flex; gap: 1rem; padding: 1rem; background: rgba(16, 185, 129, 0.05); border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.1); font-size: 0.85rem; color: #10b981; }

    .pay-btn { margin-top: 1rem; padding: 1.2rem; background: #10b981; color: #fff; border: none; border-radius: 14px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3); }
    .pay-btn:hover:not(:disabled) { background: #059669; transform: translateY(-2px); }
    .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    /* RIGHT SECTION */
    .summary-section { padding: 3rem; background: rgba(255,255,255,0.02); border-left: 1px solid rgba(255,255,255,0.05); }
    .summary-section h3 { font-size: 1.2rem; margin-bottom: 2rem; color: #fff; }
    
    .course-mini-card { display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem; }
    .course-mini-card img { width: 80px; height: 50px; border-radius: 8px; object-fit: cover; }
    .mini-info h4 { font-size: 0.95rem; margin-bottom: 0.2rem; color: #fff; }
    .mini-info p { font-size: 0.8rem; color: #94a3b8; }

    .price-breakdown { display: flex; flex-direction: column; gap: 1rem; }
    .price-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: #94a3b8; }
    .text-free { color: #10b981; font-weight: 700; }
    .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 0.5rem 0; }
    .price-row.total { font-size: 1.1rem; font-weight: 800; color: #fff; }

    .trust-badges { margin-top: 3rem; display: flex; flex-direction: column; gap: 0.8rem; }
    .badge { font-size: 0.8rem; color: #64748b; display: flex; align-items: center; gap: 0.5rem; }

    /* SUCCESS OVERLAY */
    .success-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); }
    .success-card { background: #1e293b; padding: 4rem; border-radius: 30px; text-align: center; border: 1px solid #10b981; box-shadow: 0 0 50px rgba(16, 185, 129, 0.2); }
    .check-icon { width: 80px; height: 80px; background: #10b981; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; margin: 0 auto 2rem; }
    .success-card h2 { font-size: 2rem; margin-bottom: 1rem; color: #fff; }
    .success-card p { color: #94a3b8; margin-bottom: 2.5rem; font-size: 1.1rem; }
    .btn-primary { padding: 1rem 2rem; background: #10b981; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; }

    /* RAZORPAY MODAL */
    .razorpay-modal { width: 100%; max-width: 440px; background: #fff; border-radius: 20px; overflow: hidden; color: #1e293b; box-shadow: 0 20px 60px rgba(0,0,0,0.5); font-family: 'Inter', sans-serif; text-align: left; }
    .modal-top { background: #0c1b2a; color: #fff; padding: 1.5rem 2rem; position: relative; }
    .rzp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .rzp-brand { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 1.1rem; color: #3b82f6; }
    .rzp-logo { background: #3b82f6; color: #fff; width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
    .rzp-close { background: none; border: none; color: #94a3b8; font-size: 1.3rem; cursor: pointer; }
    .rzp-merchant h3 { font-size: 1.2rem; margin: 0 0 0.2rem; color: #fff; }
    .rzp-merchant p { color: #94a3b8; font-size: 0.8rem; margin: 0; }
    .rzp-amount { font-size: 2rem; font-weight: 800; color: #fff; margin-top: 1rem; }
    
    .modal-body { padding: 2rem; background: #f8fafc; }
    .section-title { font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 1rem; }
    .payment-methods { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem; }
    .method-option { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.2rem; background: #fff; border: 2px solid #e2e8f0; border-radius: 14px; cursor: pointer; transition: all 0.2s; position: relative; }
    .method-option:hover { border-color: #cbd5e1; }
    .method-option.selected { border-color: #3b82f6; background: rgba(59, 130, 246, 0.03); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1); }
    .m-icon { font-size: 1.8rem; }
    .m-details h4 { margin: 0 0 0.2rem; font-size: 0.95rem; color: #1e293b; font-weight: 700; }
    .m-details p { margin: 0; font-size: 0.75rem; color: #64748b; }
    .method-option .check { position: absolute; right: 1rem; color: #3b82f6; font-weight: 800; font-size: 1.2rem; }
    
    .rzp-pay-btn { width: 100%; padding: 1.2rem; background: #3b82f6; color: #fff; border: none; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: 0.2s; box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3); }
    .rzp-pay-btn:hover { background: #2563eb; transform: translateY(-2px); }
    .rzp-secure-badge { text-align: center; font-size: 0.75rem; color: #94a3b8; margin-top: 1rem; }
    
    .processing-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; }
    .rzp-spinner { width: 50px; height: 50px; border: 4px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    @media (max-width: 850px) {
      .checkout-card { grid-template-columns: 1fr; }
      .summary-section { order: -1; border-left: none; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  courseId: number = 0;
  course: any;
  loading = false;
  paymentSuccess = false;
  cardData = { name: '', number: '', expiry: '', cvc: '' };

  // Razorpay Simulation State
  showRazorpayModal = false;
  mockOrderData: any = null;
  razorpayMethod = 'upi';
  processingMockPay = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private paymentService: PaymentService
  ) {}

  resolveThumb(url: string | null | undefined): string {
    return resolveMediaUrl(url);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      this.loadCourse();
    });
  }

  loadCourse() {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (res) => this.course = res.data,
      error: () => this.router.navigate(['/courses'])
    });
  }

  onPay() {
    if (!this.course) return;
    this.loading = true;

    // 1. Create Order in Backend
    this.paymentService.createOrder({
      courseId: this.course.courseId,
      amount: this.course.price
    }).subscribe({
      next: (orderRes) => {
        const orderData = orderRes.data;
        
        // [MOCK PAYMENT BYPASS] If backend returns MOCK_KEY, trigger premium Razorpay simulation modal
        if (orderData.keyId === 'MOCK_KEY') {
           this.mockOrderData = orderData;
           this.showRazorpayModal = true;
           this.loading = false;
           return;
        }

        // 2. Open Razorpay Checkout (For Real Keys)
        const options = {
          key: orderData.keyId,
          amount: orderData.amount * 100,
          currency: orderData.currency,
          name: 'EduLearn',
          description: 'Payment for ' + this.course.title,
          order_id: orderData.orderId,
          handler: (response: any) => {
            // 3. Verify Payment
            this.paymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            }).subscribe({
              next: () => {
                this.loading = false;
                this.paymentSuccess = true;
                setTimeout(() => {
                  this.router.navigate(['/dashboard/student']);
                }, 3000);
              },
              error: () => {
                this.loading = false;
                alert('Payment Verification Failed');
              }
            });
          },
          prefill: { name: '', email: '' },
          theme: { color: '#10b981' },
          modal: { ondismiss: () => { this.loading = false; } }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      },
      error: (err) => {
        this.loading = false;
        alert('Failed to initiate payment. Please try again.');
      }
    });
  }

  confirmRazorpayMockPay() {
    this.processingMockPay = true;
    const mockResponse = {
       razorpay_order_id: this.mockOrderData.orderId,
       razorpay_payment_id: 'PAY_MOCK_' + Math.floor(Math.random() * 1000000000),
       razorpay_signature: 'SIG_MOCK_' + Math.floor(Math.random() * 1000000000)
    };

    setTimeout(() => {
       this.paymentService.verifyPayment({
          razorpayOrderId: mockResponse.razorpay_order_id,
          razorpayPaymentId: mockResponse.razorpay_payment_id,
          razorpaySignature: mockResponse.razorpay_signature
       }).subscribe({
          next: () => {
            this.processingMockPay = false;
            this.showRazorpayModal = false;
            this.paymentSuccess = true;
            setTimeout(() => {
              this.router.navigate(['/dashboard/student']);
            }, 3000);
          },
          error: () => {
            this.processingMockPay = false;
            alert('Mock Payment Verification Failed');
          }
       });
    }, 2000); // Simulate Razorpay bank processing delay
  }
}
