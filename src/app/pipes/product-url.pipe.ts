import { Pipe, PipeTransform } from '@angular/core';
import { ProductListItemModel } from '../models/models/product/product-list-item.model';

@Pipe({
  name: 'builProductUrl',
  standalone: true
})
export class BuildProductUrlPipe implements PipeTransform {

  transform(product: string): string {

    if (!product) return '';

    // return `${product.slug}-i.${product.id}`;
    return '';
  }
}