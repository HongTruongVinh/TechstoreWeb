import { Pipe, PipeTransform } from '@angular/core';
import { EInvoiceStatus } from '../models/enum/etype_project.enum';

@Pipe({
  name: 'invoiceStatus',
  standalone: true,
})
export class InvoiceStatusPipe implements PipeTransform {
  
  transform(status: EInvoiceStatus, type: 'label' | 'class' = 'label'): string {
    const statusMap: Record<EInvoiceStatus, { label: string,  class: string }> = {
      [EInvoiceStatus.Unpaid]: { label: 'Chưa thanh toán',     class: 'bg-warning-subtle text-warning' },
      [EInvoiceStatus.PartiallyPaid]: { label: 'Còn nợ',     class: 'bg-warning-subtle text-warning' },
      [EInvoiceStatus.Paid]:    { label: 'Đã thanh toán', class: 'bg-success-subtle text-success' },
      [EInvoiceStatus.Canceled]: { label: 'Đã hủy', class: 'bg-danger-subtle text-danger' },
      [EInvoiceStatus.Refunded]:  { label: 'Đã hoàn tiền',  class: 'bg-purple-subtle text-purple' },
    };

    const result = statusMap[status] ?? { label: 'Không rõ', class: 'text-muted' };
    return type === 'label' ? result.label : result.class;
  }
}
