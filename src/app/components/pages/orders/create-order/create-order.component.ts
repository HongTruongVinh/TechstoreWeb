import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThousandSeparatorPipe } from '../../../../pipes/thousandSeparator.pipe';
import { DateToStringPipe } from '../../../../pipes/DatePipe';
import { FullImageUrlPipe } from '../../../../pipes/full-image-url.pipe';
import { OrderItemModel } from '../../../../models/models/order/order-item.model';
import { EPaymentMethod } from '../../../../models/enum/etype_project.enum';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { OrderService } from '../../../../core/services/order.service';
import { ProductService } from '../../../../core/services/product.service';
import { CustomerProductListItemModel } from '../../../../models/models/product/customer-product-list-item.model';
import { User } from '../../../../models/models/user/user.model';
import { CartItem } from '../../../../models/models/cart/cart-item.model';
import { SessionStorageService } from '../../../../core/services/session-storage.service';
import { OrderCreateModel, OrderItemCreateModel } from '../../../../models/models/order/cod-order-create.model';
import { BreadcrumbItem } from '../../../common/breadcrumb/breadcrumb.component';
import { BreadcrumbComponent } from "../../../common/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ThousandSeparatorPipe,
    DateToStringPipe,
    FullImageUrlPipe,
    BreadcrumbComponent
],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss'
})
export class CreateOrderComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', url: '/' },
    { label: 'Đơn hàng', url: '/orders' },
    { label: 'Tạo mới' }
  ];
  
  isLoading = false;

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

  paymentMethods: { methodId: number, name: string }[] = [];
  paymentMethodNames: Record<EPaymentMethod, string> = {
    [EPaymentMethod.DomesticBank]: 'Ngân hàng nội địa',
    [EPaymentMethod.COD]: 'Thanh toán khi nhận hàng (COD)',
    [EPaymentMethod.Cash]: 'Tiền mặt'
  };
  selectedpaymentMethodId: number = 0;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private titleService: Title,
    private route: ActivatedRoute,
    private readonly tokenStorageService: TokenStorageService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService
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
    this.isLoading = false;
    invoiceTime: Date.UTC(Date.now());
    this.orderItems = [];

    this.orderItems = this.sessionStorageService.getOrderItems() || [];

    this.subtotal = this.orderItems.reduce((sum, item) => {
      return sum + item.totalPrice;
    }, 0);

    this.totalPrice = this.subtotal;

    // this.productService.getCustomerProducts().subscribe((res) => {
    //   if (res.retCode == 0) {
    //     if (res.data) {
    //       this.allProducts = res.data;
    //       this.isLoading = false;
    //     } else {
    //       this.allProducts = [];
    //     }
    //   } else {
    //     this.isLoading = false;
    //   }
    // })

  }

  saveAction() {
    if (this.newOrderForm.invalid) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng");
      return;
    }

    if (this.orderItems.length == 0) {
      alert("Vui lòng chọn sản phẩm trước khi lưu đơn hàng");
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
      customerId: '',
      customerName: this.newOrderForm.value.customerName,
      customerPhoneNumber: this.newOrderForm.value.customerPhoneNumber,
      customerEmail: this.newOrderForm.value.customerEmail,
      shippingAddress: this.newOrderForm.value.customerAddress,
      voucherCode: this.discountCode,
      items: orderItems,
      note: this.newOrderForm.value.note,
      paymentMethod: this.selectedpaymentMethodId,
    };

    if (this.selectedpaymentMethodId == 0) {
      this.orderService.createCodOrder(newOrder).subscribe((res) => {
        if (res.retCode == 0) {
          alert("Tạo đơn hàng thành công");
          this.sessionStorageService.clearOrder();
          window.history.back();
        } else {
          //alert("Có lỗi xảy ra trong quá trình tạo đơn hàng: " + res.systemMessage);
          return;
        }
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

    // var instoreOrder: InStoreOrderCreateModel = {
    //   customerName: this.newOrderForm.value.customerName,
    //   customerPhonenumber: this.newOrderForm.value.customerPhoneNumber,
    //   paymentMethod: this.selectedpaymentMethodId,
    //   items: [],
    // }

    // for (const item of this.cartData) {
    //   const aItem: OrderItemCreateModel = {
    //     productId: item.productId,
    //     quantity: item.quantity,
    //     priceAtOrderTime: item.priceAtOrderTime,
    //     totalPrice: item.totalPrice,
    //     discount: 0,
    //   };
    //   instoreOrder.items.push(aItem);
    // }

    // this.isLoading = true;

    // this.orderService.createInStoreOrder(instoreOrder).subscribe((res) => {
    //   if (res.retCode == 0) {
    //     if (res.data) {
    //       this.isLoading = false;
    //       const url = `manage-instore-orders/checkout/${res.data}`;
    //       window.open(url, '_blank');
    //     }
    //   }
    //   else {
    //     this.isLoading = false;
    //     alert("Có lỗi xảy ra trong quá trình tạo đơn hàng: " + res.systemMessage);
    //     return;
    //   }
    // })
  }

  searchProduct() {

    // if (this.term.trim() === '' || this.term == undefined) {
    //   this.displayedProducts = [];
    //   this.searchModal.hide();
    //   return;
    // }

    // this.productService.searchCustomerProducts(this.term).subscribe((res) => {
    //   if (res.retCode == 0) {
    //     if (res.data) {
    //       this.displayedProducts = res.data;
    //       if (this.displayedProducts.length > 0) {
    //         this.searchModal.show();
    //       }
    //       else {
    //         this.searchModal.hide();
    //       }
    //     }
    //   }
    // })

    // if (this.term) {
    //   this.displayedProducts = this.allProducts.filter((el: any) => el.name.toLowerCase().includes(this.term.toLowerCase())).slice(0, 7);
    //   if( this.displayedProducts.length > 0) {
    //     this.searchModal.show();
    //   }
    //   else{
    //     this.searchModal.hide();
    //   }
    // }
  }

  selectProduct(data: any) {

    // if (this.cartData.some(item => item.productId === data.productId)) {
    //   this.searchModal.hide();
    //   this.term = '';
    //   return;
    // }

    // const orderItem: OrderItemModel = {
    //   productId: data.productId,
    //   categoryName: data.categoryName,
    //   productName: data.name,
    //   mainImageUrl: data.mainImageUrl,
    //   priceAtOrderTime: data.price,
    //   quantity: 1,
    //   totalPrice: (data.price * 1)
    // }

    // this.cartData.push(orderItem);
    // this.searchModal.hide();

    // this.term = '';
    // this.calculateQty(1, 0, this.cartData.length - 1)
  }

  goToConfirmCheckout() {

  }

  backToCart(){
    this.sessionStorageService.clearOrder();
    window.history.back();
  }
}
