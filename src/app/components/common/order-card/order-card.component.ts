import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FullImageUrlPipe } from '../../../pipes/full-image-url.pipe';
import { ThousandSeparatorPipe } from '../../../pipes/thousandSeparator.pipe';
import { OrderStatusPipe } from '../../../pipes/order-status.pipe';
import { DateToStringPipe } from '../../../pipes/DatePipe';
import { ListItemOrderModel } from '../../../models/models/order/list-item-order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [FullImageUrlPipe, ThousandSeparatorPipe, OrderStatusPipe, DateToStringPipe, CommonModule],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent implements OnInit, OnDestroy {

  @Input() set order(value: ListItemOrderModel) {
    this._order = value;
    if (value?.expiredAt) {
      this.startCountdown(value.expiredAt);
    } else {
      this.stopCountdown();
    }
  }
  get order(): ListItemOrderModel {
    return this._order;
  }
  private _order!: ListItemOrderModel;

  @Output() viewDetails = new EventEmitter<string>();

  now: Date = new Date();
  secondsRemaining = 0;
  private countdownInterval?: ReturnType<typeof setInterval>;

  get expiredAtDate(): Date | null {
    return this.order?.expiredAt
      ? new Date(this.order.expiredAt)
      : null;
  }

  get countdownText(): string {
    const totalSeconds = this.secondsRemaining;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    if (this.order?.expiredAt && this.secondsRemaining === 0) {
      this.startCountdown(this.order.expiredAt);
    }
  }

  private startCountdown(expiredAt: Date | string): void {
    this.stopCountdown();

    const expirationTime = new Date(expiredAt).getTime();

    const updateRemaining = () => {
      const diff = Math.max(0, Math.ceil((expirationTime - Date.now()) / 1000));
      this.secondsRemaining = diff;
      this.now = new Date();

      if (diff === 0 && this.countdownInterval) {
        this.stopCountdown();
      }
    };

    updateRemaining();
    if (this.secondsRemaining > 0) {
      this.countdownInterval = setInterval(updateRemaining, 1000);
    }
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
  }

  onViewDetails(expiredAt?: Date) {
    if (expiredAt === undefined || expiredAt === null) {
      this.router.navigate([`/order-details/${this.order.id}`]);
    }
    else {
      this.router.navigate([`/snapshot-details/${this.order.id}`]);
    }
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }
}
