import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductListItemModel } from '../../../models/models/product/product-list-item.model';
import { FullImageUrlPipe } from '../../../pipes/full-image-url.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    FullImageUrlPipe
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  @Input() product!: ProductListItemModel;
  @Output() addCart = new EventEmitter<any>();

  constructor(private router: Router) { }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  getStarsArray(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) stars.push(1);
    if (hasHalfStar) stars.push(0.5);
    while (stars.length < 5) stars.push(0);
    return stars;
  }

  viewProductDetails(slugWithId: string) {
    this.router.navigate(['', slugWithId]);
  }

  buildProductUrl(product: ProductListItemModel): string {
    return `${product.slug}-i.${product.productId}`;
  }

  addToCart(product: any) {
    this.addCart.emit(product);
  }
}
