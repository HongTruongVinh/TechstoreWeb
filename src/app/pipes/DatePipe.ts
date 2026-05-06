// src/app/pipes/date-to-string.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToString',
  standalone: true,
})
export class DateToStringPipe implements PipeTransform {
  transform(value: Date | string | undefined | null, type: 'getDatetime' | 'getDate' | 'getTime'): string {
    if (!value) return '';

    const date = new Date(value);
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    switch (type) {
      case 'getDatetime':
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      case 'getDate':
        return `${year}-${month}-${day}`;
      case 'getTime':
        return `${hours}:${minutes}:${seconds}`;
      default:
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  }
}
