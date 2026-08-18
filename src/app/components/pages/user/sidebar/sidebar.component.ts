import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../core/services/ui/token-storage.service';
import { User } from '../../../../models/models/user/user.model';
import { UiStateService } from '../../../../core/services/ui/ui-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  user?: User;
  activeMenu: string = '';
  nameAvatar: string = 'TS';
  currentUrl = this.router.url;

  uiState = inject(UiStateService);
  constructor(
    private readonly router: Router,
    private readonly tks: TokenStorageService,
  ) { }

  ngOnInit(): void {
    if (this.currentUrl == "/user/cart") {
      this.selectMenu("cart");
    }
    else if (this.currentUrl == "/user/purchase") {
      this.selectMenu("purchase");
    }
    else if (this.currentUrl == "/user/profile") {
      this.selectMenu("info");
    }

    if (this.tks.getUser() != null) {
      this.user = this.tks.getUser()!;
    }

    if (this.user) {
      if (this.user.firstName && this.user.lastName) {
        this.nameAvatar = this.user.lastName.charAt(0).toUpperCase() + this.user.firstName.charAt(0).toUpperCase();
      }
    }
  }

  get displayName(): string {
    if (!this.user) return 'Khách hàng TechStore';
    return `${this.user.lastName ?? ''} ${this.user.firstName ?? ''}`.trim() || 'Khách hàng TechStore';
  }

  selectMenu(menu: string) {
    this.activeMenu = menu;

    if (menu === 'cart') this.cart();
    if (menu === 'purchase') this.puchase();
    if (menu === 'info') this.infomation();
  }

  infomation() {
    this.uiState.hideUserSidebar();
    this.router.navigate(['/user/profile']);
  }

  puchase() {
    this.uiState.hideUserSidebar();
    this.router.navigate(['/user/purchase']);
  }

  cart() {
    this.uiState.hideUserSidebar();
    this.router.navigate(['/user/cart']);
  }

  logout() {
    this.tks.signOut();
    this.router.navigate(['/']).then(() => window.location.reload());
  }
}
