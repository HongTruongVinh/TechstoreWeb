import { Component, inject } from '@angular/core';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { Router } from '@angular/router';
import { UiStateService } from '../../../../core/services/ui-state.service';
import { AuthenticationService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-mobile-bar',
  standalone: true,
  imports: [],
  templateUrl: './mobile-bar.component.html',
  styleUrl: './mobile-bar.component.scss'
})
export class MobileBarComponent {
  router = inject(Router);
  uiState = inject(UiStateService);
  tokenStorageService = inject(TokenStorageService);
  auth = inject(AuthenticationService);

  home(){
    this.uiState.showNavbar();
    this.uiState.showWidgetPanel();
    this.uiState.showMobileMenu();
    this.router.navigate(['/']);
  }

  infomation() {
    this.router.navigate(['/user/profile']);
  }

  puchase() {
    this.router.navigate(['/user/purchase']);
  }

  cart(){
    this.router.navigate(['/user/cart']);
  }

  logout() {
    this.auth.logout();
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
