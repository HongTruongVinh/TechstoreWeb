import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FullImageUrlPipe } from '../../../../pipes/full-image-url.pipe';
import { ThousandSeparatorPipe } from '../../../../pipes/thousandSeparator.pipe';
import { CartItem } from '../../../../models/models/cart/cart-item.model';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../../../core/services/ui/session-storage.service';
import { Store } from '@ngrx/store';
import * as CartSelectors from '../../../../store/cart/cart.selectors';
import * as CartActions from '../../../../store/cart/cart.actions';
import { loadCartItem } from '../../../../store/cart/cart.actions';
import { take } from 'rxjs';
import Swal from 'sweetalert2';

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

  private store = inject(Store);
  cartItems$ = this.store.select(CartSelectors.selectAllCartItems);
  selectedItems$ = this.store.select(CartSelectors.selectSelectedItems);
  totalPrice$ = this.store.select(CartSelectors.selectTotalPrice);
  loading$ = this.store.select(CartSelectors.selectCartItemLoading);
  selectedItemIds$ = this.store.select(CartSelectors.selectSelectedItemIds);
  allItemsSelected$ = this.store.select(CartSelectors.selectAllItemsSelected);
  someItemsSelected$ = this.store.select(CartSelectors.selectSomeItemsSelected);

  constructor(
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

    this.store.dispatch(
      CartActions.updateCartItemQuantity({
        id: cartItemId,
        quantity: newQuantity
      })
    );
  }

  selectAll(checked: boolean): void {
    this.store.dispatch(
      CartActions.toggleSelectAllItems({ checked })
    );
  }

  async remove(selectedCount: number): Promise<void> {
    if (selectedCount === 0) return;

    const result = await Swal.fire({
      title: `Xoá ${selectedCount} sản phẩm?`,
      text: 'Các sản phẩm đã chọn sẽ bị xoá khỏi giỏ hàng.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
      confirmButtonColor: '#dc3545'
    });

    if (result.isConfirmed) {
      this.store.dispatch(CartActions.removeCartItems());
    }
  }

  increase(item: CartItem) {
    // console.log("p"+item.id);
    if (item.quantity < item.stock) this.updateQuantity(item.id, item.quantity + 1);
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

  toggleSelect(product: CartItem) {
    this.store.dispatch(
      CartActions.toggleSelectItem({
        cartItemId: product.id
      })
    );
  }

  createOrder(): void {
    this.selectedItems$.pipe(take(1)).subscribe(selectedItems => {
      if (selectedItems.length === 0) return;

      this.sessionStorageService.saveOrderItems(selectedItems);
      this.router.navigate(['/user/create-order']);
    });
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

}

