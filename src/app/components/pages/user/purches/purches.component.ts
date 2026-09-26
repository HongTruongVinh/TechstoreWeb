import { Component, OnInit } from '@angular/core';
import { ListItemOrderModel } from '../../../../models/models/order/list-item-order.model';
import { OrderService } from '../../../../core/services/api/order.service';
import { OrderCardComponent } from "../../../common/order-card/order-card.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EOrderStatus } from '../../../../models/enum/etype_project.enum';
import { MessengerServices } from '../../../../core/services/ui/messenger.service';

@Component({
  selector: 'app-purches',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, OrderCardComponent],
  templateUrl: './purches.component.html',
  styleUrl: './purches.component.scss'
})
export class PurchesComponent implements OnInit {
  isLoading = false;
  allOrders: ListItemOrderModel[] = [];
  snapshots: ListItemOrderModel[] = [];
  currentTab: string = 'allOrders';
  searchQuery: string = '';

  constructor(
    private orderService: OrderService,
    private readonly messengerService: MessengerServices,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.orderService.getUserOrders(1, 2000).subscribe({
      next: (res) => {
        if (res.data) {
          this.allOrders = res.data;
        } else {
          this.allOrders = [];
          if (res.message) {
            this.messengerService.errorNotification(res.message);
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.allOrders = [];
        this.isLoading = false;
        this.messengerService.errorNotification('Không thể tải danh sách đơn hàng. Vui lòng thử lại!');
      }
    });
  }

  changeTab(tab: string) {
    this.currentTab = tab;
  }

  clearSearch() {
    this.searchQuery = '';
  }

  get pendingOrders(): ListItemOrderModel[] {
    return this.allOrders.filter(o => o.orderStatus === EOrderStatus.Pending);
  }

  get processingOrders(): ListItemOrderModel[] {
    return this.allOrders.filter(o => o.orderStatus === EOrderStatus.Processing);
  }

  get deliveringOrders(): ListItemOrderModel[] {
    return this.allOrders.filter(o => o.orderStatus === EOrderStatus.Delivering);
  }

  get completedOrders(): ListItemOrderModel[] {
    return this.allOrders.filter(o => o.orderStatus === EOrderStatus.Completed);
  }

  get canceledOrders(): ListItemOrderModel[] {
    return this.allOrders.filter(o => o.orderStatus === EOrderStatus.Canceled);
  }

  get displayedOrders(): ListItemOrderModel[] {
    let list: ListItemOrderModel[] = [];
    switch (this.currentTab) {
      case 'snapshots':
        list = this.snapshots;
        break;
      case 'pending':
        list = this.pendingOrders;
        break;
      case 'processing':
        list = this.processingOrders;
        break;
      case 'delivering':
        list = this.deliveringOrders;
        break;
      case 'completed':
        list = this.completedOrders;
        break;
      case 'canceled':
        list = this.canceledOrders;
        break;
      case 'allOrders':
      default:
        list = this.allOrders;
        break;
    }

    if (!this.searchQuery || !this.searchQuery.trim()) {
      return list;
    }

    const query = this.searchQuery.trim().toLowerCase();
    return list.filter(order => {
      const matchId = order.id ? String(order.id).toLowerCase().includes(query) : false;
      const matchProduct = order.items?.some(item =>
        item.productName && item.productName.toLowerCase().includes(query)
      );
      return matchId || matchProduct;
    });
  }
}
