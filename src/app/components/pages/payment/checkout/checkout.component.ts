import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { Subject, takeUntil } from 'rxjs';
import { ThousandSeparatorPipe } from '../../../../pipes/thousandSeparator.pipe';
import { PaymentService } from '../../../../core/services/api/payment.service';
import { PaymentSignalrService } from '../../../../core/services/signalr/payment-signalr.service';
import { MessengerServices } from '../../../../core/services/ui/messenger.service';
import { SessionStorageService } from '../../../../core/services/ui/session-storage.service';
import { IdempotencyService } from '../../../../core/services/api/idempotency-key.service';
import { PaymentDataForSnapshotModel } from '../../../../models/models/payment/payment-qr-for-snapshot.model';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../common/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ThousandSeparatorPipe,
    LottieComponent,
    BreadcrumbComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Trang chủ', url: '/' },
    { label: 'Thanh toán' },
    { label: 'Mã QR thanh toán' }
  ];

  snapshotId = '';
  isLoadingQrCode = false;
  isPaymentSuccess = false;
  qrCodeError = '';
  paymentData?: PaymentDataForSnapshotModel;
  paymentSecondsRemaining = 0;

  private paymentCountdownInterval?: ReturnType<typeof setInterval>;
  private readonly destroy$ = new Subject<void>();

  successOptions: AnimationOptions = {
    path: '/assets/animations/tick.json',
    loop: false
  };

  loadingOptions: AnimationOptions = {
    path: '/assets/animations/loading.json'
  };

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly paymentService: PaymentService,
    private readonly paymentSignalrService: PaymentSignalrService,
    private readonly messengerServices: MessengerServices,
    private readonly sessionStorageService: SessionStorageService,
    private readonly idempotencyService: IdempotencyService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const snapshotId = params.get('id') || params.get('snapshotId') || this.route.snapshot.queryParamMap.get('snapshotId');
      if (snapshotId) {
        this.snapshotId = snapshotId;
        this.getPaymentQrForSnapshot(snapshotId);
      } else {
        this.qrCodeError = 'Không tìm thấy mã đơn hàng trên đường dẫn.';
      }
    });
  }

  getPaymentQrForSnapshot(snapshotId: string): void {
    this.isLoadingQrCode = true;
    this.qrCodeError = '';

    this.paymentService.GetPaymentQrForSnapshot(snapshotId).subscribe({
      next: (res) => {
        this.isLoadingQrCode = false;
        if (res.data) {
          this.paymentData = res.data;
          this.startPaymentCountdown(res.data.expiredAt);
          this.listenToPaymentUpdates(res.data.snapshotId);
        } else {
          this.qrCodeError = res.message || 'Không nhận được dữ liệu thanh toán từ máy chủ.';
        }
      },
      error: (error) => {
        this.isLoadingQrCode = false;
        this.qrCodeError = error.error?.message || 'Không thể kết nối đến hệ thống thanh toán. Vui lòng thử lại.';
      }
    });
  }

  private listenToPaymentUpdates(snapshotId: string): void {
    this.paymentSignalrService.startConnection(snapshotId);

    this.paymentSignalrService.paymentSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.isPaymentSuccess = true;
        this.messengerServices.successes('Thanh toán thành công');
        this.sessionStorageService.clearOrder();
        this.idempotencyService.clearOrderKey();
        this.router.navigate(['/user/purchase']);
      });

    this.paymentSignalrService.paymentFailed$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.messengerServices.errorNotification(
          data?.message || 'Hệ thống xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau'
        );
      });
  }

  private startPaymentCountdown(expiredAt: Date | string): void {
    if (this.paymentCountdownInterval) {
      clearInterval(this.paymentCountdownInterval);
    }

    const expirationTime = new Date(expiredAt).getTime();

    const updateRemainingTime = () => {
      this.paymentSecondsRemaining = Math.max(0, Math.ceil((expirationTime - Date.now()) / 1000));
      if (this.paymentSecondsRemaining === 0 && this.paymentCountdownInterval) {
        clearInterval(this.paymentCountdownInterval);
        this.paymentCountdownInterval = undefined;
      }
    };

    updateRemainingTime();
    if (this.paymentSecondsRemaining > 0) {
      this.paymentCountdownInterval = setInterval(updateRemainingTime, 1000);
    }
  }

  get paymentCountdownText(): string {
    const minutes = Math.floor(this.paymentSecondsRemaining / 60).toString().padStart(2, '0');
    const seconds = (this.paymentSecondsRemaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  retryQrCode(): void {
    this.paymentData = undefined;
    this.qrCodeError = '';
    if (this.snapshotId) {
      this.getPaymentQrForSnapshot(this.snapshotId);
    } else {
      this.qrCodeError = 'Không tìm thấy thông tin đơn hàng để tạo lại mã thanh toán.';
    }
  }

  goBack(): void {
    this.router.navigate(['/user/purchase']);
  }

  ngOnDestroy(): void {
    if (this.paymentCountdownInterval) {
      clearInterval(this.paymentCountdownInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
    void this.paymentSignalrService.stopConnection();
  }
}
