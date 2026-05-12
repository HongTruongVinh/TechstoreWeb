import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FullImageUrlPipe } from '../../../../pipes/full-image-url.pipe';
import { ThousandSeparatorPipe } from '../../../../pipes/thousandSeparator.pipe';
import { ERetCode } from '../../../../models/enum/etype_project.enum';
import { CartItem } from '../../../../models/models/cart/cart-item.model';
import { CartService } from '../../../../core/services/cart.service';
import { ProductService } from '../../../../core/services/product.service';
import { Router } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { SessionStorageService } from '../../../../core/services/session-storage.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports:
    [
      CommonModule,
      FullImageUrlPipe,
      ThousandSeparatorPipe
    ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  pageNumber = 1;
  pageSize = 100;
  cartItems: CartItem[] = [];

  selectedItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly orderService: OrderService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.cartService.getAllItems(this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.cartItems = res.data;
        }
      }
    });

    this.cartItems = this.sessionStorageService.getCartItems() || [];
  }

  removeItem(cartItemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
  }

  updateQuantity(cartItemId: string, newQuantity: number): void {
    const item = this.cartItems.find(item => item.id === cartItemId);
    if (item) {
      item.quantity = newQuantity;
      item.totalPrice = (item.salePrice ?? item.price - item.discount) * newQuantity;
      this.caculateTotal();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.selectedItems = [];
  }

  remove() {
    // this.cartItems = this.cartItems.filter(item => !this.selectedItems.includes(item));
    // this.selectedItems = [];
    this.cartService.deleteItem(this.selectedItems.map(item => item.id)).subscribe((res) => {
      if (res.retCode == ERetCode.Successfull) {
        if (res.data) {
          
          this.cartItems = this.cartItems.filter(item => !this.selectedItems.includes(item));
          this.selectedItems = [];
          this.caculateTotal();
        } else {
          this.cartItems = [];
        }
      } else {
      }
    })
  }

  increase(item: any) {
    // item.quantity++;
    this.updateQuantity(item.id, item.quantity + 1);
  }

  decrease(item: any) {
    // if (item.quantity > 1) item.quantity--;
    if (item.quantity > 1) this.updateQuantity(item.id, item.quantity - 1);
  }

  // goToProduct(productId: string) {
  //   this.router.navigate(['/product-details', productId]);
  // }

  viewProductDetails(slugWithId: string) {
      this.router.navigate(['', slugWithId]);
    }
  
    buildProductUrl(product: CartItem): string {
      return `${product.slug}-i.${product.productId}`;
    }

  toggleSelection(item: CartItem, checked: boolean) {
    if (checked) {
      const exists = this.selectedItems.find(i => i.id === item.id);
      if (!exists) this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
    }
    this.caculateTotal();
  }

  isSelected(item: CartItem): boolean {
    return this.selectedItems.some(i => i.id === item.id);
  }

  caculateTotal() {
    if (this.selectedItems.length == 0) this.totalPrice = 0;

    this.totalPrice = this.selectedItems.reduce((sum, item) => {
      return sum + item.totalPrice;
    }, 0);
  }

  createOrder() {
    this.sessionStorageService.createOrder(this.selectedItems);
    this.router.navigate(['/user/create-order']);
  }
}

