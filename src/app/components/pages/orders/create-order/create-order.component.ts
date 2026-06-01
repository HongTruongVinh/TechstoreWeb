import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThousandSeparatorPipe } from '../../../../pipes/thousandSeparator.pipe';
import { FullImageUrlPipe } from '../../../../pipes/full-image-url.pipe';
import { EPaymentMethod, ERetCode } from '../../../../models/enum/etype_project.enum';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { OrderService } from '../../../../core/services/order.service';
import { CustomerProductListItemModel } from '../../../../models/models/product/customer-product-list-item.model';
import { User } from '../../../../models/models/user/user.model';
import { CartItem } from '../../../../models/models/cart/cart-item.model';
import { SessionStorageService } from '../../../../core/services/session-storage.service';
import { OrderCreateModel, OrderItemCreateModel } from '../../../../models/models/order/cod-order-create.model';
import { MessengerServices } from '../../../../core/services/messenger.service';
import { PaymentDataModel } from '../../../../models/models/payment/payment-data.model';
import { PaymentSignalrService } from '../../../../core/services/signalr/payment-signalr.service';
import { MockingDataService, PaymentWebhookRequest } from '../../../../core/services/api/mocking-data.service';

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
export class CreateOrderComponent {
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
  listDiscountCodes: string[] = [];
  discountRate = 0;
  shipping: number = 0;
  shippingRate: any = '65.00';
  tax: any;
  taxRate = 0;
  totalPrice: number = 0;

  user!: User;
  paymentData?: PaymentDataModel;

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
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private readonly tokenStorageService: TokenStorageService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly orderService: OrderService,
    private readonly paymentSignalrService: PaymentSignalrService,
    private readonly messengerServices: MessengerServices,
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
    }

    if (this.tokenStorageService.getUser() != null) {
      this.user = this.tokenStorageService.getUser()!;
    }

    this.newOrderForm = this.formBuilder.group({
      customerName: [this.user.lastName + ' ' + this.user.firstName, Validators.required],
      customerPhoneNumber: [this.user.phoneNumber, Validators.required],
      customerEmail: [this.user.email],
      customerAddress: [this.user.address, Validators.required],
      note: ['']
    });

    this.loadData();

  }

  loadData() {
    invoiceTime: Date.UTC(Date.now());
    this.orderItems = [];

    this.orderItems = this.sessionStorageService.getOrderItems() || [];

    this.subtotal = this.orderItems.reduce((sum, item) => {
      return sum + item.totalPrice;
    }, 0);

    this.totalPrice = this.subtotal;
  }

  saveAction() {
    if(!this.validation()){
      return;
    }

    var orderItems: OrderItemCreateModel[] = [];
    for (const item of this.orderItems) {
      const orderItem: OrderItemCreateModel = {
        orderId: '',
        productVariantOptionId: item.productVariantOptionId,
        quantity: item.quantity,
        discount: 0,
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
      this.orderService.createCodOrder(newOrder).subscribe((res) => {
        if (res.retCode == ERetCode.Successfull) {
          alert("Tạo đơn hàng thành công");
          this.sessionStorageService.clearOrder();
          window.history.back();
        } else {
          //alert("Có lỗi xảy ra trong quá trình tạo đơn hàng: " + res.systemMessage);
          return;
        }
      });
    }
    else if (this.selectedpaymentMethodId === EPaymentMethod.DomesticBank) {
      this.isClickedGenerateQrCode = true;
      this.isLoadingQrCode = true;
      this.orderService.createPrepayOrder(newOrder).subscribe((res) => {
        if (res.retCode == ERetCode.Successfull) {
          if(res.data) {
            this.paymentData = res.data;
          this.isLoadingQrCode = false;

          this.paymentSignalrService.startConnection(this.paymentData.paymentId);

          this.paymentRequest = {
            paymentId: this.paymentData.paymentId,
            amount: this.paymentData.amount,
            transactionId: 'mock-transaction-id'
          };
        
          // setTimeout(() => {
          //   if(this.paymentRequest){
          //     this.mds.PaymentSuccess(this.paymentRequest).subscribe(res => {
          //       console.log("Gửi yêu cầu thanh toán thành công");
          //     });
          //   }
          // }, 5000); // 5 giây

          this.paymentSignalrService
            .paymentSuccess$
            .subscribe((data) => {

              this.isPaymentSuccess = true;
            });
          }
          else{
            this.messengerServices.errorNotification(res.systemMessage || "Không nhận được dữ liệu thanh toán từ server");
          }

        } else {
          this.messengerServices.errorNotification(res.systemMessage || "Có lỗi xảy ra trong quá trình tạo đơn hàng");
          return;
        }
      });
    }
  }

  paymentRequest? : PaymentWebhookRequest;
  testSignalR(){

    if(this.isPaymentSuccess){
      return;
    }

    if(this.paymentRequest){
      this.mds.PaymentSuccess(this.paymentRequest).subscribe(res => {
        console.log("Gửi yêu cầu thanh toán thành công");
      });
    }
  }

  checkDiscountCode() {
  if (!this.discountCode) {
    alert('Vui lòng nhập mã ưu đãi');
    return;
  }

  // TODO: gọi API kiểm tra mã
  console.log('Kiểm tra mã:', this.discountCode);
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

  validation(): boolean{
    if (this.newOrderForm.invalid) {
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

  backToCart(){
    this.sessionStorageService.clearOrder();
    window.history.back();
  }
}
