import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'thousandSeparator',
    standalone: true,
})
export class ThousandSeparatorPipe implements PipeTransform {
    transform(value: number | string | null | undefined): string {
        if (value === null || value === undefined || value === '') {
            return '';
        }

        const num = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) : value;
        if (isNaN(num)) {
            return '';
        }

        return num.toLocaleString('vi-VN'); // ví dụ: 10000000 -> "10.000.000"
    }
}
