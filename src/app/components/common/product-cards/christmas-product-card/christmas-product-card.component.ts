import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductListItemModel } from '../../../../models/models/product/product-list-item.model';
import { FullImageUrlPipe } from '../../../../pipes/full-image-url.pipe';

@Component({
  selector: 'app-christmas-product-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FullImageUrlPipe
  ],
  templateUrl: './christmas-product-card.component.html',
  styleUrl: './christmas-product-card.component.scss'
})
export class ChristmasProductCardComponent {

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

  buildProductUrl(product: ProductListItemModel): string {
    return `${product.slug}-i.${product.id}`;
  }

  getDiscountPercent(): number {
    if (this.product.salePrice > 0) {
      return Math.round((this.product.salePrice / this.product.price) * 100);
    }
    return 0;
  }

  addToCart(product: any) {
    this.addCart.emit(product);
  }
}
