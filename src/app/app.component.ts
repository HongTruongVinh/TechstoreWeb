import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/common/navbar/navbar.component";
import { FooterComponent } from "./components/common/footer/footer.component";
import { CategoryPanelComponent } from "./components/common/category-panel/category-panel.component";
import { CommonModule } from '@angular/common';
import { MobileMenuComponent } from "./components/common/mobile-menu/mobile-menu.component";
import { DeviceService } from './core/services/ui/device.service';
import { WidgetPanelComponent } from "./components/common/widget-panel/widget-panel.component";
import { UiStateService } from './core/services/ui/ui-state.service';
import { LoadingComponent } from "./components/common/loading/loading.component";

import { Store } from '@ngrx/store';
import { loadCartItem } from './store/cart/cart.actions';
import { TokenStorageService } from './core/services/ui/token-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CategoryPanelComponent,
    MobileMenuComponent,
    WidgetPanelComponent,
    LoadingComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TechstoreWeb';

  isMobileMenuHidden = false;
  private lastScrollY = 0;
  private readonly scrollThreshold = 8;

  showCategories = false;
  showWidgetPanel = true;
  istoggleCategory: boolean = false;

  device = inject(DeviceService);
  private store = inject(Store);
  tks = inject(TokenStorageService);

  constructor(public uiState: UiStateService) { }

  ngOnInit(): void {
    this.updateIsMobile();

     this.loadStore();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    const currentScrollY = (event.currentTarget as Window).scrollY;

    if (!this.device.isMobile()) {
      this.isMobileMenuHidden = false;
      this.lastScrollY = currentScrollY;
      return;
    }

    const scrollDifference = currentScrollY - this.lastScrollY;

    if (currentScrollY <= 10) {
      this.isMobileMenuHidden = false;
      this.lastScrollY = currentScrollY;
      return;
    }

    if (Math.abs(scrollDifference) < this.scrollThreshold) {
      return;
    }

    this.isMobileMenuHidden = scrollDifference > 0;
    this.lastScrollY = currentScrollY;
  }

  toggleCategoryPanel() {
    this.showCategories = !this.showCategories;
    this.istoggleCategory = true;

    this.updateIsMobile();
  }

  updateIsMobile(): void {
    if (this.device.isMobile() && this.showCategories == true) {
      this.showWidgetPanel = false;
    }
    else {
      this.showWidgetPanel = true;
    }
  }

  loadStore() {
    if(this.tks.isLoggedIn()){
      this.store.dispatch(
      loadCartItem()
    );
    }
  }

}
