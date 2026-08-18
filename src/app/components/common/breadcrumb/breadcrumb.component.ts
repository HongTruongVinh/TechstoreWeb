import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IdempotencyService } from '../../../core/services/api/idempotency-key.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];

  constructor(
    private location: Location,
    private readonly idempotencyService: IdempotencyService,
  ) { }

  goBack() {
    this.idempotencyService.clearAllKeys();
    this.location.back();
  }
}

export interface BreadcrumbItem {
  label: string;
  url?: string;
}