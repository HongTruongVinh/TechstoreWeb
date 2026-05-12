import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/common/navbar/navbar.component";
import { FooterComponent } from "./components/common/footer/footer.component";
import { CategoryPanelComponent } from "./components/common/category-panel/category-panel.component";
import { CommonModule } from '@angular/common';
import { MobileMenuComponent } from "./components/common/mobile-menu/mobile-menu.component";
import { DeviceService } from './core/services/device.service';
import { WidgetPanelComponent } from "./components/common/widget-panel/widget-panel.component";
import { UiStateService } from './core/services/ui-state.service';
import { LoadingComponent } from "./components/common/loading/loading.component";

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
  
  device = inject(DeviceService);

  showCategories = false;
  showWidgetPanel = true;
  istoggleCategory: boolean = false;

  constructor(public uiState: UiStateService){}

  ngOnInit(): void {
    this.updateIsMobile();
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

}
