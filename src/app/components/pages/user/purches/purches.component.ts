import { Component } from '@angular/core';
import { OrderListItemModel } from '../../../../models/models/order/order-list-item.model';
import { OrderService } from '../../../../core/services/order.service';
import { OrderCardComponent } from "../../../common/order-card/order-card.component";

@Component({
  selector: 'app-purches',
  standalone: true,
  imports: [OrderCardComponent],
  templateUrl: './purches.component.html',
  styleUrl: './purches.component.scss'
})
export class PurchesComponent {
  isLoading = false;
  allOrders: OrderListItemModel[] = []; // Chứa toàn bộ đơn hàng từ API
  displayedOrders: any; // Chứa đơn hàng đang hiển thị trên table (ví dụ: trang 1)


  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.orderService.getUserOrders().subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.allOrders = res.data;
          this.displayedOrders = res.data;
          this.displayedOrders = this.allOrders.slice(0, 10);
          this.isLoading = false;
        } else {
          this.displayedOrders = [];
          this.allOrders = [];
        }
      } else {
        this.isLoading = false;
      }
    })
  }
}
