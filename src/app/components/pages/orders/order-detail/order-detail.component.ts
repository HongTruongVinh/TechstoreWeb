import { CommonModule, Location  } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThousandSeparatorPipe } from '../../../../pipes/thousandSeparator.pipe';
import { DateToStringPipe } from '../../../../pipes/DatePipe';
import { FullImageUrlPipe } from '../../../../pipes/full-image-url.pipe';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../common/breadcrumb/breadcrumb.component';
import { OrderService } from '../../../../core/services/api/order.service';
import { InvoiceModel, OrderModel, PaymentModel, QrcodeModel } from '../../../../models/models/order/order.model';
import { ActivatedRoute } from '@angular/router';
import { EOrderStatus, EPaymentMethod, EErrorType } from '../../../../models/enum/etype_project.enum';
import { OrderItemModel } from '../../../../models/models/order/order-item.model';
import { OrderStatusPipe } from "../../../../pipes/order-status.pipe";
import { CancelOrderModel } from '../../../../models/models/order/cancel-order.model';
import { MessengerServices } from '../../../../core/services/ui/messenger.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ThousandSeparatorPipe,
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

  order?: OrderModel;
  invoice?: InvoiceModel;
  payments?: PaymentModel[];
  orderItems?: OrderItemModel[];
  
  showCancelReasonSelection: boolean = false;
  cancelReasons:{ reasonId: number, value: string }[] = [
    { reasonId: 0, value: 'Không còn nhu cầu mua nữa' },
    { reasonId: 1, value: 'Đặt nhầm sản phẩm' },
    { reasonId: 2, value: 'Tôi muốn thay đổi địa chỉ và thông tin người nhận' },
    { reasonId: 3, value: 'Lý do khác' },
  ];
  cancelReason: string = '';
  selectedCancelReasonId: number = -1;

  // cancelReasons: string[] = [
  //   'Không còn nhu cầu mua nữa',
  //   'Đặt nhầm sản phẩm',
  //   'Tôi muốn thay đổi địa chỉ giao hàng',
  // ]

  // paymentMethods: { methodId: number, name: string }[] = [];
  // paymentMethodNames: Record<EPaymentMethod, string> = {
  //   [EPaymentMethod.DomesticBank]: 'Ngân hàng nội địa',
  //   [EPaymentMethod.COD]: 'Thanh toán khi nhận hàng (COD)',
  //   [EPaymentMethod.Cash]: 'Tiền mặt'
  // };

  // selectedpaymentMethodId: number = 0;

  constructor(
    private location: Location,
    private readonly orderService: OrderService,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly messengerServices: MessengerServices,
  ) { }

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id')!;
      this.isLoading = true;
      this.orderService.getOrderDetail(orderId).subscribe((res) => {
        if (res.data) {
          this.order = res.data;

          this.invoice = this.order.invoice;
          this.payments = this.order.invoice?.payments;

          this.orderItems = this.order.items;
        } else {

        }
          this.isLoading = false;
      })
    });

  }

  CancelOrder() {
    if(this.selectedCancelReasonId == -1 || this.order == undefined){
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

    const dataInsert: CancelOrderModel = {
      reason: this.cancelReason,
    }

    this.orderService.cancelOrder(this.order.id, dataInsert).subscribe((res) => {
      if (res.success == true) {
        if(this.order){
          this.order.orderStatus = EOrderStatus.Canceled;
        }
      } else {
        this.messengerServices.errorNotification(res.message??'');
      }
    });

    this.selectedCancelReasonId = -1;
    this.cancelReason = '';
    this.showCancelReasonSelection = false;
  }

  goBack(): void {
    this.location.back();
  }

  isOrderInProcessing(orderStatusId: number): boolean{
    return [0,1,2].includes(orderStatusId);
  }
}
