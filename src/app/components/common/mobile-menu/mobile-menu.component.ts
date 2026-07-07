import { Component, EventEmitter, inject, Output } from '@angular/core';
import { LoginComponent } from '../../dialog/login/login.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { UiStateService } from '../../../core/services/ui/ui-state.service';
import { TokenStorageService } from '../../../core/services/ui/token-storage.service';
import { LoginDialogResult } from '../../../models/models/authentication/login-result.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthDialogService } from '../../../core/services/ui/AuthDialogService';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCartItemCount } from '../../../store/cart/cart.selectors';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss'
})
export class MobileMenuComponent {

  @Output()
  toggleCategories = new EventEmitter<void>();

  @Output()
  login = new EventEmitter<void>();

  totalQuantity$: Observable<number>;

  firstName: string = '';

  authDialog = inject(AuthDialogService);
  tks = inject(TokenStorageService);
  constructor(
    private uiState: UiStateService,
    private readonly router: Router,

    private store: Store
  ) {
    this.totalQuantity$ = this.store.select(selectCartItemCount);

  }

  ngOnInit() {
    const user = this.tks.getUser();
    if (user) {
      this.firstName = user.firstName;
    }
  }

  openCategories() {
    this.toggleCategories.emit();
  }

  phoneNumber = '0393574180';
  contact(): void {
    window.open(`https://zalo.me/${this.phoneNumber}`, '_blank');
  }

  openLogin() {
    const ref = this.authDialog.openLogin();

    ref.closed.subscribe(result => {
      const data = result as LoginDialogResult | undefined;

      if (data?.success) {
        if (this.tks.getUser() != null) {
          this.firstName = this.tks.getUser()!.firstName;
        }
      }
    });
  }

  openCart() {
    this.uiState.hideMobileMenu();
    this.router.navigate(['/user/cart']);
  }
}
