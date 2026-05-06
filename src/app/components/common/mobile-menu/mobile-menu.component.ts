import { Component, EventEmitter, inject, Output } from '@angular/core';
import { LoginComponent } from '../../dialog/login/login.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { UiStateService } from '../../../core/services/ui-state.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { LoginDialogResult } from '../../../models/models/authentication/login-result.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthDialogService } from '../../../core/services/AuthDialogService';

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

  isLoggedIn = false;
  firstName: string = '';

  authDialog = inject(AuthDialogService);
  constructor(
    private uiState: UiStateService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    const user = this.tokenStorageService.getUser();
    if (user) {
      this.isLoggedIn = true;
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
        this.isLoggedIn = true;
        if (this.tokenStorageService.getUser() != null) {
          this.firstName = this.tokenStorageService.getUser()!.firstName;
        }
      }
      
      this.uiState.showWidgetPanel();
      this.uiState.showMobileMenu();
      this.uiState.showNavbar();
    });
  }

  openCart() {
    this.uiState.hideMobileMenu();
    this.router.navigate(['/user/cart']);
  }
}
