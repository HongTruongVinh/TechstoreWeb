import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FullImageUrlPipe } from '../../../../pipes/full-image-url.pipe';
import { ThousandSeparatorPipe } from '../../../../pipes/thousandSeparator.pipe';
import { ERetCode } from '../../../../models/enum/etype_project.enum';
import { CartItem } from '../../../../models/models/cart/cart-item.model';
import { CartService } from '../../../../core/services/cart.service';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../../../core/services/session-storage.service';
import { Store } from '@ngrx/store';
import * as CartSelectors from '../../../../store/cart/cart.selectors';
import * as CartActions from '../../../../store/cart/cart.actions';
import { loadCartItem } from '../../../../store/cart/cart.actions';

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

  selectedItems: CartItem[] = [];
  totalPrice: number = 0;

  private store = inject(Store);
  cartItems$ = this.store.select(CartSelectors.selectAllCartItems);
  selectedItems$ = this.store.select(CartSelectors.selectSelectedItems);
  totalPrice$ = this.store.select(CartSelectors.selectTotalPrice);

  constructor(
    private readonly cartService: CartService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.store.dispatch(loadCartItem());
  }

  updateQuantity(cartItemId: string, newQuantity: number): void {
    // this.cartItems$.subscribe(cartItems => {
    //   const item = cartItems.find(item => item.id === cartItemId);
    //   if (item) {
    //     item.quantity = newQuantity;
    //     item.totalPrice = (item.salePrice ?? item.price - item.discount) * newQuantity;
    //     this.caculateTotal();
    //   }
    // }
    // )

    this.store.dispatch(
    CartActions.updateCartItemQuantity({
      id: cartItemId,
      quantity: newQuantity
    })
  );
    this.caculateTotal();
  }

  selectAll(checked: boolean) {
    if (checked) {
      this.cartItems$.subscribe(cartItems => {
        this.selectedItems = cartItems;
      })
    } else {
      this.selectedItems = [];
    }
    this.caculateTotal();
  }

  remove() {
    const ids = this.selectedItems.map(item => item.id);

    this.store.dispatch(
      CartActions.removeCartItems({ cartItemIds: ids })
    );

    this.selectedItems = [];
    this.caculateTotal();
  }

  increase(item: CartItem) {
    // console.log("p"+item.id);
    if (item.quantity <= item.stock) this.updateQuantity(item.id, item.quantity + 1);
  }

  decrease(item: CartItem) {
    if (item.quantity > 1) this.updateQuantity(item.id, item.quantity - 1);
  }

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

  toggleSelect(product: CartItem) {
  this.store.dispatch(
    CartActions.toggleSelectItem({
      cartItemId: product.id
    })
  );

  this.selectedItems$.subscribe(items => {
    this.selectedItems = items;
    this.caculateTotal();
  });
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

