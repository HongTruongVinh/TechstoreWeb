import { Pipe, PipeTransform } from '@angular/core';
import { EPaymentMethod, EPaymentStatus } from '../models/enum/etype_project.enum';// đổi path nếu cần

@Pipe({
    name: 'paymentMethod',
    standalone: true,
})
export class EPaymentMethodPipe implements PipeTransform {

    transform(method: EPaymentMethod | null | undefined): string {
        switch (method) {
            case EPaymentMethod.DomesticBank:
                return 'Ngân hàng nội địa';
            case EPaymentMethod.COD:
                return 'Khi nhận hàng';
            case EPaymentMethod.Cash:
                return 'Tiền mặt';
            default:
                return 'Không xác định';
        }
    }
}

export const PAYMENT_STATUS_META = {
    [EPaymentStatus.Pending]: {
        text: 'Chờ thanh toán',
        class: 'bg-secondary-subtle text-secondary'
    },
    [EPaymentStatus.Paid]: {
        text: 'Đã thanh toán',
        class: 'bg-success-subtle text-success'
    },
    [EPaymentStatus.Canceled]: {
        text: 'Đã hủy',
        class: 'bg-danger'
    },
    [EPaymentStatus.Refunded]: {
        text: 'Đã hoàn tiền',
        class: 'bg-purple'
    },
    [EPaymentStatus.Failed]: {
        text: 'Thất bại',
        class: 'bg-danger'
    }
} as const;

@Pipe({
  name: 'paymentStatus',
  standalone: true,
})
export class PaymentStatusPipe implements PipeTransform {
  
  transform(status: EPaymentStatus, type: 'label' | 'class' = 'label'): string {
    const statusMap: Record<EPaymentStatus, { label: string,  class: string }> = {
      [EPaymentStatus.Pending]: { label: 'Chưa thanh toán',     class: 'bg-warning-subtle text-warning' },
      [EPaymentStatus.Paid]:    { label: 'Đã thanh toán', class: 'bg-success-subtle text-success' },
      [EPaymentStatus.Canceled]: { label: 'Đã hủy', class: 'bg-danger-subtle text-white' },
      [EPaymentStatus.Refunded]:  { label: 'Đã hoàn tiền',  class: 'bg-purple-subtle text-purple' },
      [EPaymentStatus.Failed]:  { label: 'Thất bại',  class: 'bg-danger text-danger' },
    };

    const result = statusMap[status] ?? { label: 'Không rõ', class: 'text-muted' };
    return type === 'label' ? result.label : result.class;
  }
}