import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FullImageUrlPipe } from '../../../pipes/full-image-url.pipe';
import { ThousandSeparatorPipe } from '../../../pipes/thousandSeparator.pipe';
import { OrderStatusPipe } from '../../../pipes/order-status.pipe';
import { DateToStringPipe } from '../../../pipes/DatePipe';
import { OrderListItemModel } from '../../../models/models/order/order-list-item.model';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [FullImageUrlPipe, ThousandSeparatorPipe, OrderStatusPipe, DateToStringPipe],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent {

  @Input() order!: OrderListItemModel;
  @Output() viewDetails = new EventEmitter<string>();

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    
  }

  onViewDetails() {
    this.router.navigate([`/order-details/${this.order.id}`]);
    //this.viewDetails.emit(this.order.orderId);
  }
  
}
