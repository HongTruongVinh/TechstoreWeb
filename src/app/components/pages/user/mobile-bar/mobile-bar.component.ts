import { Component, inject } from '@angular/core';
import { TokenStorageService } from '../../../../core/services/ui/token-storage.service';
import { Router } from '@angular/router';
import { UiStateService } from '../../../../core/services/ui/ui-state.service';
import { AuthenticationService } from '../../../../core/services/api/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { selectCartItemCount } from '../../../../store/cart/cart.selectors';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-mobile-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './mobile-bar.component.html',
  styleUrl: './mobile-bar.component.scss'
})
export class MobileBarComponent {
  router = inject(Router);
  uiState = inject(UiStateService);
  tokenStorageService = inject(TokenStorageService);
  auth = inject(AuthenticationService);
  store = inject(Store);

  totalQuantity$: Observable<number>;

  constructor() {
    this.totalQuantity$ = this.store.select(selectCartItemCount);
  }

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
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
