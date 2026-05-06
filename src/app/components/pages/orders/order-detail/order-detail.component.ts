import { CommonModule, Location  } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThousandSeparatorPipe } from '../../../../pipes/thousandSeparator.pipe';
import { DateToStringPipe } from '../../../../pipes/DatePipe';
import { FullImageUrlPipe } from '../../../../pipes/full-image-url.pipe';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../common/breadcrumb/breadcrumb.component';
import { OrderService } from '../../../../core/services/order.service';
import { InvoiceModel, OrderDetailModel, PaymentModel, QrcodeModel } from '../../../../models/models/order/order-detail.model';
import { ActivatedRoute } from '@angular/router';
import { EPaymentMethod, ERetCode } from '../../../../models/enum/etype_project.enum';
import { OrderItemModel } from '../../../../models/models/order/order-item.model';
import { OrderStatusPipe } from "../../../../pipes/order-status.pipe";

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ThousandSeparatorPipe,
    DateToStringPipe,
    FullImageUrlPipe,
    BreadcrumbComponent,
    OrderStatusPipe
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Trang chủ', url: '/' },
    { label: 'Đơn hàng', url: '/user/purchase' },
    { label: 'Chi tiết đơn hàng' }
  ];
  
  isLoading: boolean = false;

  orderDetail!: OrderDetailModel;
  invoiceDetail!: InvoiceModel;
  paymentDetail!: PaymentModel;
  qrCodeDetail!: string;

  orderDetailsForm!: UntypedFormGroup;
  orderItems!: OrderItemModel[];
  discountCode: string = '';
  subtotal: number = 0;
  discount: number = 0;
  totalPrice: number = 0;

  paymentMethods: { methodId: number, name: string }[] = [];
  paymentMethodNames: Record<EPaymentMethod, string> = {
    [EPaymentMethod.DomesticBank]: 'Ngân hàng nội địa',
    [EPaymentMethod.COD]: 'Thanh toán khi nhận hàng (COD)',
    [EPaymentMethod.Cash]: 'Tiền mặt'
  };

  selectedpaymentMethodId: number = 0;

  constructor(
    private location: Location,
    private readonly orderService: OrderService,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.orderDetailsForm = this.formBuilder.group({
      customerName: [''],
      customerPhoneNumber: [''],
      customerAddress: [''],
      note: [''],
    });

    this.paymentMethods = Object.values(EPaymentMethod)
      .filter(value => typeof value === 'number') // chỉ lấy các giá trị số
      .map(value => ({
        methodId: value as number,
        name: this.paymentMethodNames[value as EPaymentMethod]
      }));

    this.load();
  }

  load(): void {

    //this.qrCodeDetail = {} as QrcodeModel;
    this.paymentDetail = {} as PaymentModel;
    this.invoiceDetail = {} as InvoiceModel;
    this.orderDetail = {} as OrderDetailModel;

    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id')!;
      this.isLoading = true;
      this.orderService.getOrderDetail(orderId).subscribe((res) => {
        if (res.retCode == ERetCode.Successfull) {
          if (res.data) {
            this.orderDetail = res.data;

            this.orderDetailsForm = this.formBuilder.group({
              customerName: [this.orderDetail.customerName],
              customerPhoneNumber: [this.orderDetail.customerPhonenumber],
              customerAddress: [this.orderDetail.shippingAddress],
              note: [this.orderDetail.notes],
            });

            this.selectedpaymentMethodId = this.orderDetail.paymentMethod;

            this.invoiceDetail = this.orderDetail.invoice!;
            this.paymentDetail = this.orderDetail.payment!;
            this.qrCodeDetail = this.orderDetail.qrCode!;

            this.orderItems = this.orderDetail.items;
            this.subtotal = this.orderDetail.totalPrice;
            this.discount = this.orderDetail.discountAmount;
            this.totalPrice = this.orderDetail.finalAmount;


            this.isLoading = false;
          } else {

          }
        } else {
          this.isLoading = false;
        }
      })
    });

    this.selectedpaymentMethodId = EPaymentMethod.DomesticBank;
  }

  saveAction() {

  }

  CancelOrder() {

  }

  goBack(): void {
    this.location.back();
  }

}
