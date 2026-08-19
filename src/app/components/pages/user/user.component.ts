import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { BreadcrumbComponent, BreadcrumbItem } from "../../common/breadcrumb/breadcrumb.component";
import { DeviceService } from '../../../core/services/ui/device.service';
import { CommonModule } from '@angular/common';
import { UiStateService } from '../../../core/services/ui/ui-state.service';
import { TokenStorageService } from '../../../core/services/ui/token-storage.service';
import { User } from '../../../models/models/user/user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Trang chủ', url: '/' },
    { label: 'Cá nhân' }
  ];

  user!: User;

  device = inject(DeviceService);
  uiState = inject(UiStateService);
  tokenStorageService = inject(TokenStorageService);
  router = inject(Router);

  ngOnInit(): void {
    this.uiState.hideFooter();
    if(this.device.isMobile()) {
      this.uiState.hideNavbar();
      this.uiState.hideWidgetPanel();
      // this.uiState.hideMobileMenu();
    }
  }


  ngOnDestroy(): void {
    this.uiState.showFooter();
  }
}
