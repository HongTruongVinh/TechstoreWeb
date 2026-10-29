import { Component, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ThousandSeparatorPipe } from '../../../../pipes/thousandSeparator.pipe';
import { DateToStringPipe } from '../../../../pipes/DatePipe';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../common/breadcrumb/breadcrumb.component';
import { OrderService } from '../../../../core/services/api/order.service';
import { EOrderStatus, EPaymentMethod, EErrorType } from '../../../../models/enum/etype_project.enum';
import { OrderStatusPipe } from '../../../../pipes/order-status.pipe';
import { InvoiceStatusPipe } from '../../../../pipes/invoice-status.pipe';
import { OrderModel } from '../../../../models/models/order/order.model';
import { FullImageUrlPipe } from '../../../../pipes/full-image-url.pipe';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { PaymentService } from '../../../../core/services/api/payment.service';
import { MessengerServices } from '../../../../core/services/ui/messenger.service';
import Swal from "sweetalert2";
import { EPaymentMethodPipe, PaymentStatusPipe } from '../../../../pipes/payment-method.pipe';
import { CancelOrderModel } from '../../../../models/models/order/cancel-order.model';
import { UpdateOrderModel } from '../../../../models/models/order/update-order.model';

@Component({
  selector: 'app-order-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    ThousandSeparatorPipe,
    DateToStringPipe,
    OrderStatusPipe,
    InvoiceStatusPipe,
    PaymentStatusPipe,
    FullImageUrlPipe,
    EPaymentMethodPipe,
    BreadcrumbComponent
  ],
  templateUrl: './order-overview.component.html',
  styleUrl: './order-overview.component.scss'
})
export class OrderOverviewComponent implements OnDestroy {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Trang chủ', url: '/' },
    { label: 'Đơn hàng', url: '/user/purchase' },
    { label: 'Chi tiết đơn hàng' }
  ];

  isLoading = false;

  order?: OrderModel;

  now: Date = new Date();
  get expiredAtDate(): Date | null {
    return this.order?.expiredAt
      ? new Date(this.order.expiredAt)
      : null;
  }

  @ViewChild('invoiceModal', { static: false }) invoiceModal!: ModalDirective;

  showCancelReasonSelection: boolean = false;
  cancelReasons: { reasonId: number, value: string }[] = [
    { reasonId: 0, value: 'Tôi muốn thay đổi địa chỉ và thông tin nhận nhận hàng' },
    { reasonId: 1, value: 'Đặt nhầm sản phẩm' },
    { reasonId: 2, value: 'Không còn nhu cầu mua nữa' },
    { reasonId: 3, value: 'Lý do khác' },
  ];
  cancelReason: string = '';
  selectedCancelReasonId: number = -1;
  updateOrderForm!: UntypedFormGroup;
  expandedCard: string | null = null;

  isSnaphotOrder: boolean = false;

  constructor(
    private titleService: Title,
    private readonly router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private readonly messengerService: MessengerServices,
    private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit(): void {

    const url = this.route.snapshot.url[0]?.path;

    if (url === 'order-details') {
      this.route.paramMap.subscribe(params => {
        const orderId = params.get('id')!;
        this.loadOrderDetails(orderId);
      });
    } else {
      this.route.paramMap.subscribe(params => {
        const snapshotId = params.get('id')!;
        this.loadSnapshotDetails(snapshotId);
        this.isSnaphotOrder = true;
      });
    }

  }

  loadOrderDetails(orderId: string) {
    this.isLoading = true;

    this.orderService.getOrderDetail(orderId).subscribe({
      next: (res) => {
        if (res.data) {
          this.order = res.data;
          const expiredAt = this.order.expiredAt || (this.order as any)?.ExpiredAt;
          if (expiredAt) {
            this.startPaymentCountdown(expiredAt);
          }
          console.log('Order details loaded:', this.order);
        } else {
          this.messengerService.errorNotification(res.message);
          console.log(
            `Failed to load order details for orderId: ${orderId}. Error: ${res.message}`
          );
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error(
          `Failed to load order details for orderId: ${orderId}`,
          err
        );

        if (err.status === 404) {
          console.log(`Order not found. OrderId: ${orderId}`);
          this.messengerService.errorNotification('Không tìm thấy đơn hàng.');
        } else {
          this.messengerService.errorNotification(
            err.error?.message || 'Đã xảy ra lỗi khi tải thông tin đơn hàng.'
          );
        }

        this.isLoading = false;
      }
    });
  }

  loadSnapshotDetails(snapshotId: string) {
    this.isLoading = true;

    this.orderService.getSnapshotOrderDetail(snapshotId).subscribe({
      next: (res) => {
        if (res.data) {
          this.order = res.data;
          const expiredAt = this.order.expiredAt || (this.order as any)?.ExpiredAt;
          if (expiredAt) {
            this.startPaymentCountdown(expiredAt);
          }
          console.log('Order details loaded:', this.order);
        } else {
          this.messengerService.errorNotification(res.message);
          console.log(
            `Failed to load order details for orderId: ${snapshotId}. Error: ${res.message}`
          );
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error(
          `Failed to load order details for orderId: ${snapshotId}`,
          err
        );

        if (err.status === 404) {
          console.log(`Order not found. OrderId: ${snapshotId}`);
          this.messengerService.errorNotification('Không tìm thấy đơn hàng.');
        } else {
          this.messengerService.errorNotification(
            err.error?.message || 'Đã xảy ra lỗi khi tải thông tin đơn hàng.'
          );
        }

        this.isLoading = false;
      }
    });
  }

  goToCheckoutForSnapshot(snapshotId: string) {
    this.router.navigate([`/checkout/${snapshotId}`]);
  }

  paymentSecondsRemaining = 0;
  private paymentCountdownInterval?: ReturnType<typeof setInterval>;

  get isOrderPaymentAvailable(): boolean {
    const expiredAt = this.order?.expiredAt || (this.order as any)?.ExpiredAt;
    if (!expiredAt) {
      return false;
    }
    return this.paymentSecondsRemaining > 0;
  }

  startPaymentCountdown(expiredAt: Date | string): void {
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
    const hours = Math.floor(this.paymentSecondsRemaining / 3600);
    const minutes = Math.floor((this.paymentSecondsRemaining % 3600) / 60).toString().padStart(2, '0');
    const seconds = (this.paymentSecondsRemaining % 60).toString().padStart(2, '0');
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }

  ngOnDestroy(): void {
    if (this.paymentCountdownInterval) {
      clearInterval(this.paymentCountdownInterval);
    }
  }

  async CancelOrder() {
    if (this.selectedCancelReasonId == -1 || this.order == undefined) {
      return;
    }

    if (this.selectedCancelReasonId != 3) {
      const selectedReason = this.cancelReasons.find(reason => reason.reasonId === this.selectedCancelReasonId);
      if (selectedReason) {
        this.cancelReason = selectedReason.value;
      } else {
        this.cancelReason = '';
      }
    }

    const result = await Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn muốn hủy đơn hàng?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Hủy',
      cancelButtonText: 'Không Hủy'
    });

    if (!result.isConfirmed) {
      return;
    }

    const dataInsert: CancelOrderModel = {
      reason: this.cancelReason,
    }

    if (this.isSnaphotOrder) {
      this.orderService.cancelSnapshotOrder(this.order.id).subscribe((res) => {
        if (res.success == true) {
          if (this.order) {
            this.order.orderStatus = EOrderStatus.Canceled;
            this.order.expiredAt = this.now;
          }
        } else {
          this.messengerService.errorNotification(res.message);
        }
      });
    } else {
      this.orderService.cancelOrder(this.order.id, dataInsert).subscribe((res) => {
        if (res.success == true) {
          if (this.order) {
            this.order.orderStatus = EOrderStatus.Canceled;
          }
        } else {
          this.messengerService.errorNotification(res.message);
        }
      });
    }

    this.selectedCancelReasonId = -1;
    this.cancelReason = '';
    this.showCancelReasonSelection = false;
  }

  showInvoiceDetail() {
    this.invoiceModal?.show();
  }

  isOrderInProcessing(orderStatusId: number): boolean {
    return [0, 1, 2].includes(orderStatusId);
  }

  toggleCard(cardName: string): void {
    this.expandedCard = this.expandedCard === cardName ? null : cardName;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.expandedCard = null;
  }

  async saveAction() {
    if (!this.order) return;

    const model: UpdateOrderModel = {
      customerName: this.updateOrderForm.value.customerName,
      customerPhoneNumber: this.updateOrderForm.value.customerPhoneNumber,
      customerEmail: this.updateOrderForm.value.customerEmail,
      shippingAddress: this.updateOrderForm.value.customerAddress,
      note: this.updateOrderForm.value.note,
    }

    if (model.customerName === this.order.customerName
      && model.customerPhoneNumber === this.order.customerPhonenumber
      && model.customerEmail === this.order.customerEmail
      && model.shippingAddress === this.order.shippingAddress
      && model.note === this.order.notes
    ) {
      return;
    }

    if (this.isSnaphotOrder) {
      this.orderService.updateSnapshotOrder(this.order.id, model).subscribe((res) => {
        if (res.success == true) {
          this.messengerService.successes('Cập nhật thông tin đơn hàng thành công');
          this.loadSnapshotDetails(this.order!.id);
        } else {
          this.messengerService.errorNotification(res.message);
        }
      });
    } else {
      this.orderService.updateOrder(this.order.id, model).subscribe((res) => {
        if (res.success == true) {
          Swal.fire({
            title: 'Thông báo',
            text: 'Cập nhật thành công',
            icon: 'success',
            color: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          });
          this.route.paramMap.subscribe(params => {
            const orderId = params.get('id')!;
            this.loadOrderDetails(orderId);
            this.showCancelReasonSelection = false;
          });
        } else {
          this.messengerService.errorNotification(res.message);
        }
      });
    }
  }

  buildUpdateOrderForm() {
    this.updateOrderForm = this.formBuilder.group({
      customerName: [this.order?.customerName, Validators.required],
      customerPhoneNumber: [this.order?.customerPhonenumber, Validators.required],
      customerEmail: [this.order?.customerEmail],
      customerAddress: [this.order?.shippingAddress, Validators.required],
      note: [this.order?.notes]
    });
  }
}
