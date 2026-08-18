import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThousandSeparatorPipe } from '../../../../pipes/thousandSeparator.pipe';
import { FullImageUrlPipe } from '../../../../pipes/full-image-url.pipe';
import { EDiscountType, EPaymentMethod, EErrorType } from '../../../../models/enum/etype_project.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../../../core/services/ui/token-storage.service';
import { OrderService } from '../../../../core/services/api/order.service';
import { CustomerProductListItemModel } from '../../../../models/models/product/customer-product-list-item.model';
import { User } from '../../../../models/models/user/user.model';
import { CartItem } from '../../../../models/models/cart/cart-item.model';
import { SessionStorageService } from '../../../../core/services/ui/session-storage.service';
import { OrderCreateModel, OrderItemCreateModel } from '../../../../models/models/order/cod-order-create.model';
import { MessengerServices } from '../../../../core/services/ui/messenger.service';
import { PaymentDataModel } from '../../../../models/models/payment/payment-data.model';
import { PaymentSignalrService } from '../../../../core/services/signalr/payment-signalr.service';
import { MockingDataService, PaymentForSnapshotWebhookRequest } from '../../../../core/services/api/mocking-data.service';
import { IdempotencyService } from '../../../../core/services/api/idempotency-key.service';
import { Voucher } from '../../../../models/models/voucher/voucher.model';
import { VoucherService } from '../../../../core/services/api/voucher.service';
import { EAlertType } from '../../../../library/enum/ealerttype';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ThousandSeparatorPipe,
    FullImageUrlPipe,
    LottieComponent
  ],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})
export class CreateOrderComponent implements OnDestroy {
  isLoadingQrCode = false;
  isPaymentSuccess = false;
  isClickedGenerateQrCode = false;
  orderId?: string;

  invoiceAuthor: any;
  invoiceTime!: Date;
  newOrderForm!: UntypedFormGroup;

  allProducts: CustomerProductListItemModel[] = [];
  displayedProducts: any;
  term: any;
  orderItems!: CartItem[];
  subtotal: number = 0;
  discount: number = 0;
  discountCode: string = '';
  shipping: number = 0;
  tax: any;
  taxRate = 0;
  totalPrice: number = 0;

  user!: User;
  paymentData?: PaymentDataModel;
  voucher?: Voucher | null = null;
  vouchers: Voucher[] = [];
  isApplyVoucher: boolean = false;
  isCheckingVoucher = false;
  isSubmitting = false;
  qrCodeError = '';
  formSubmitted = false;
  readonly paymentMethodEnum = EPaymentMethod;
  private readonly destroy$ = new Subject<void>();

  paymentMethods: { methodId: number, name: string }[] = [];
  paymentMethodNames: Record<EPaymentMethod, string> = {
    [EPaymentMethod.DomesticBank]: 'Ngân hàng nội địa',
    [EPaymentMethod.COD]: 'Thanh toán khi nhận hàng (COD)',
    [EPaymentMethod.Cash]: 'Tiền mặt'
  };
  selectedpaymentMethodId: number = 1;

  successOptions: AnimationOptions = {
    path: '/assets/animations/tick.json',
    loop: false,
  };

  loadingOptions: AnimationOptions = {
    path: '/assets/animations/loading.json'
  };

  constructor(
    private readonly router: Router,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private readonly tokenStorageService: TokenStorageService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly orderService: OrderService,
    private readonly VoucherService: VoucherService,
    private readonly paymentSignalrService: PaymentSignalrService,
    private readonly messengerServices: MessengerServices,
    private readonly idempotencyService: IdempotencyService,
    private readonly mds: MockingDataService
  ) { }


  ngOnInit(): void {

    this.paymentMethods = Object.values(EPaymentMethod)
      .filter(value => typeof value === 'number') // chỉ lấy các giá trị số
      .filter(value => value !== EPaymentMethod.Cash) // loại bỏ Cash khỏi danh sách dropdown
      .map(value => ({
        methodId: value as number,
        name: this.paymentMethodNames[value as EPaymentMethod]
      }));

    this.user = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      birthday: new Date(),
      address: '',
      city: '',
      district: '',
    }

    if (this.tokenStorageService.getUser() != null) {
      this.user = this.tokenStorageService.getUser()!;
    }

    this.newOrderForm = this.formBuilder.group({
      customerName: [this.user.lastName + ' ' + this.user.firstName, Validators.required],
      customerPhoneNumber: [this.user.phoneNumber, [Validators.required, Validators.pattern(/^\s*\+?[0-9][0-9\s.-]{7,13}[0-9]\s*$/)]],
      customerEmail: [this.user.email],
      customerAddress: [this.user.address, Validators.required],
      note: ['']
    });

    this.loadData();

  }

  loadData() {
    // this.messengerServices.warringWithMessage("Website được xây dựng với mục đích học tập, nên sẽ không có sản phẩm thực tế, vui lòng không chuyển khoản để đặt hàng");

    this.orderItems = [];

    this.orderItems = this.sessionStorageService.getOrderItems() || [];

    this.calculateTotalPrice();

    this.VoucherService.GetVouchers().subscribe((res) => {
      if (res.data) {
        this.vouchers = res.data;
        this.vouchers = this.vouchers.filter(voucher => voucher.code !== "D99");
      }
    });
  }

  calculateTotalPrice(Voucher?: Voucher) {
    this.subtotal = this.orderItems.reduce((sum, item) => {
      return sum + item.totalPrice;
    }, 0);

    if (Voucher) {
      if (Voucher.discountType === EDiscountType.Percentage) {
        const percentageDiscount = this.subtotal * Voucher.discountValue;
        const appliedDiscount = Voucher.maxDiscountAmount > 0
          ? Math.min(percentageDiscount, Voucher.maxDiscountAmount)
          : percentageDiscount;
        this.totalPrice = this.subtotal - appliedDiscount;
      } else if (Voucher.discountType === EDiscountType.FixedAmount) {
        this.totalPrice = this.subtotal - Math.min(this.subtotal, Voucher.discountValue);
      }

      this.discount = this.subtotal - this.totalPrice;
    } else {
      this.totalPrice = this.subtotal;
      this.discount = 0;
    }

    this.totalPrice = Math.max(0, this.totalPrice + this.shipping);
  }

  saveAction() {
    if (this.isSubmitting || this.isLoadingQrCode || this.paymentData) {
      return;
    }

    this.formSubmitted = true;
    if (!this.validation()) {
      return;
    }

    this.isSubmitting = true;

    var orderItems: OrderItemCreateModel[] = [];
    for (const item of this.orderItems) {
      const orderItem: OrderItemCreateModel = {
        orderId: '',
        productVariantOptionId: item.productVariantOptionId,
        quantity: item.quantity
      };
      orderItems.push(orderItem);
    }

    var newOrder: OrderCreateModel = {
      id: this.orderId,
      customerName: this.newOrderForm.value.customerName,
      customerPhoneNumber: this.newOrderForm.value.customerPhoneNumber,
      customerEmail: this.newOrderForm.value.customerEmail,
      shippingAddress: this.newOrderForm.value.customerAddress,
      voucherCode: this.discountCode,
      items: orderItems,
      note: this.newOrderForm.value.note,
      paymentMethod: this.selectedpaymentMethodId,
    };

    if (this.selectedpaymentMethodId === EPaymentMethod.COD) {
      this.orderService.createCodOrder(newOrder).pipe(
        finalize(() => this.isSubmitting = false)
      ).subscribe({ next: (res) => {
        if (res.success == true) {
          this.messengerServices.successes("Đặt hàng thành công");
          this.sessionStorageService.clearOrder();
          this.router.navigate(['/user/purchase']);
          // window.history.back();
        } else {
          //alert("Có lỗi xảy ra trong quá trình tạo đơn hàng: " + res.systemMessage);
          return;
        }
      }, error: () => this.messengerServices.errorNotification('Không thể tạo đơn hàng. Vui lòng thử lại sau.') });
    }
    else if (this.selectedpaymentMethodId === EPaymentMethod.DomesticBank) {
      this.isClickedGenerateQrCode = true;
      this.isLoadingQrCode = true;
      this.qrCodeError = '';
      this.orderService.createPrepayOrder(newOrder).pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.isLoadingQrCode = false;
        })
      ).subscribe({ next: (res) => {
        if (res.data) {
            this.paymentData = res.data;
            this.paymentSignalrService.startConnection(this.paymentData.snapshotId);

            this.paymentRequest = {
              snapshotId: this.paymentData.snapshotId,
              amount: this.paymentData.amount,
              transactionId: 'mock-transaction-id'
            };

            this.paymentSignalrService
              .paymentSuccess$
              .pipe(takeUntil(this.destroy$))
              .subscribe((data) => {

                this.isPaymentSuccess = true;
                this.messengerServices.successes("Đặt hàng thành công");
                this.sessionStorageService.clearOrder();
                this.idempotencyService.clearOrderKey();
                this.router.navigate(['/user/purchase']);
              });

            this.paymentSignalrService
              .paymentFailed$
              .pipe(takeUntil(this.destroy$))
              .subscribe((data) => {
                this.messengerServices.errorNotification(res.message || "Hệ thống xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau");
              });
          }
          else {
            this.qrCodeError = res.message || 'Không nhận được dữ liệu thanh toán từ máy chủ.';
          }
      }, error: (error) => {
        this.qrCodeError = error.error?.message || 'Không thể kết nối đến hệ thống thanh toán. Vui lòng thử lại.';
      } });
    }
  }

  paymentRequest?: PaymentForSnapshotWebhookRequest;
  testSignalR() {

    if (this.isPaymentSuccess) {
      return;
    }

    // if(this.paymentRequest){
    //   this.mds.PaymentSuccess(this.paymentRequest).subscribe(res => {
    //     console.log("Gửi yêu cầu thanh toán thành công");
    //   });
    // }
  }

  onDiscountCodeChange(): void {
    this.discountCode = this.discountCode.toUpperCase();
    this.isApplyVoucher = false;
  }

  applyVoucher(voucher: Voucher): void {
    this.discountCode = voucher.code;
    this.checkDiscountCode();
  }

  removeVoucher(): void {
    this.discountCode = '';
    this.voucher = null;
    this.isApplyVoucher = false;
    this.calculateTotalPrice();
  }

  checkDiscountCode() {
    if (!this.discountCode || this.isCheckingVoucher || this.isPaymentLocked) {
      this.removeVoucher();
      return;
    }

    this.isCheckingVoucher = true;
    this.VoucherService.CheckVoucher(this.discountCode.trim(), this.orderItems).pipe(
      finalize(() => this.isCheckingVoucher = false)
    ).subscribe({
      next: (res) => {
        if (res.data) {
          this.voucher = res.data;
          this.calculateTotalPrice(this.voucher);
          this.isApplyVoucher = true;
        }
      },

      error: (error) => {
        const message = error.error?.message || 'Mã ưu đãi không hợp lệ hoặc đã hết hạn';

        this.messengerServices.showAlert(EAlertType.warning, 'Thông báo', message);
        this.removeVoucher();
      }
    });
  }

  getDiscountText(voucher: Voucher): string {
    switch (voucher.discountType) {
      case EDiscountType.Percentage:
        return `Giảm ${voucher.discountValue * 100}%`;

      case EDiscountType.FixedAmount:
        return `Giảm ${voucher.discountValue.toLocaleString('vi-VN')}đ`;

      default:
        return '';
    }
  }

  goToCheckout() {

    if (this.orderItems.length == 0) {
      alert("Vui lòng chọn sản phẩm trước khi thanh toán");
      return;
    }

    if (this.newOrderForm.invalid) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng");
      return;
    }

  }

  validation(): boolean {
    if (this.newOrderForm.invalid) {
      this.newOrderForm.markAllAsTouched();
      this.messengerServices.warringWithMessage("Vui lòng điền đầy đủ thông tin khách hàng");
      return false;
    }

    if (this.orderItems.length == 0) {
      this.messengerServices.warringWithMessage("Vui lòng chọn sản phẩm trước khi đặt hàng");
      return false;
    }

    if (![EPaymentMethod.COD, EPaymentMethod.DomesticBank].includes(this.selectedpaymentMethodId)) {
      this.messengerServices.warringWithMessage("Vui lòng chọn phương thức thanh toán");
      return false;
    }

    return true;
  }

  backToCart() {
    this.idempotencyService.clearOrderKey();
    window.history.back();
  }

  get isPaymentLocked(): boolean {
    return this.isSubmitting || this.isLoadingQrCode || !!this.paymentData;
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.newOrderForm?.get(controlName);
    return !!control?.invalid && (control.touched || this.formSubmitted);
  }

  retryQrCode(): void {
    this.paymentData = undefined;
    this.qrCodeError = '';
    this.saveAction();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    void this.paymentSignalrService.stopConnection();
  }
}
