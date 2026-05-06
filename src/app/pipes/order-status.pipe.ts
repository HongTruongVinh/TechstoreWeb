import { Pipe, PipeTransform } from '@angular/core';
import { EOrderStatus } from '../models/enum/etype_project.enum';// đổi path nếu cần

@Pipe({
  name: 'orderStatus',
  standalone: true,
})
export class OrderStatusPipe implements PipeTransform {
  
  transform(status: EOrderStatus, type: 'label' | 'class' = 'label'): string {
    const statusMap: Record<EOrderStatus, { label: string,  class: string }> = {
      [EOrderStatus.Pending]:    { label: 'Đang chờ duyệt', class: 'text-warning' },
      [EOrderStatus.Processing]: { label: 'Đang xử lý',     class: 'text-primary' },
      [EOrderStatus.Delivering]: { label: 'Đang giao hàng', class: 'text-info' },
      [EOrderStatus.Completed]:  { label: 'Đã hoàn thành',  class: 'text-success' },
      [EOrderStatus.Canceled]:   { label: 'Đã hủy',         class: 'text-danger' },
      [EOrderStatus.Refunded]:   { label: 'Đã hoàn tiền',   class: 'text-secondary' },
      [EOrderStatus.Failed]:     { label: 'Thất bại',       class: 'text-danger' },
    };

    const result = statusMap[status] ?? { label: 'Không rõ', class: 'text-muted' };
    return type === 'label' ? result.label : result.class;
  }
}
