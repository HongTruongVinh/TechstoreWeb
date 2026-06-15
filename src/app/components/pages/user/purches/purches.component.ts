import { Component } from '@angular/core';
import { ListItemOrderModel } from '../../../../models/models/order/list-item-order.model';
import { OrderService } from '../../../../core/services/api/order.service';
import { OrderCardComponent } from "../../../common/order-card/order-card.component";
import { CommonModule } from '@angular/common';
import { EOrderStatus } from '../../../../models/enum/etype_project.enum';

@Component({
  selector: 'app-purches',
  standalone: true,
  imports: [CommonModule, OrderCardComponent],
  templateUrl: './purches.component.html',
  styleUrl: './purches.component.scss'
})
export class PurchesComponent {
  isLoading = false;
  allOrders: ListItemOrderModel[] = [];
  currentTab = 'allOrders';

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.orderService.getUserOrders(1, 2000).subscribe((res) => {
      if (res.retCode == 0) {
        if (res.data) {
          this.allOrders = res.data;
          this.isLoading = false;
        } else {
          this.allOrders = [];
        }
      } else {
        this.isLoading = false;
      }
    })
  }

  changeTab(tab: string) {
    this.currentTab = tab;
  }


  get pendingOrders() {
    return this.allOrders.filter(o => o.orderStatus === EOrderStatus.Pending);
  }
  get processingOrders() {
    return this.allOrders.filter(o => o.orderStatus === EOrderStatus.Processing);
  }
  get deliveringOrders() {
    return this.allOrders.filter(o => o.orderStatus === EOrderStatus.Delivering);
  }
  get completedOrders() {
    return this.allOrders.filter(o => o.orderStatus === EOrderStatus.Completed);
  }
  get canceledOrders() {
    return this.allOrders.filter(o => o.orderStatus === EOrderStatus.Canceled);
  }
}
