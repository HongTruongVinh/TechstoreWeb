import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { BreadcrumbComponent, BreadcrumbItem } from "../../common/breadcrumb/breadcrumb.component";
import { DeviceService } from '../../../core/services/device.service';
import { CommonModule } from '@angular/common';
import { UiStateService } from '../../../core/services/ui-state.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { User } from '../../../models/models/user/user.model';
import { MobileBarComponent } from "./mobile-bar/mobile-bar.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, BreadcrumbComponent, CommonModule, MobileBarComponent],
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
    if(this.device.isMobile()) {
      this.uiState.hideNavbar();
      this.uiState.hideWidgetPanel();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth <= 768) {
      this.uiState.hideNavbar();
      this.uiState.hideWidgetPanel();
      this.device.isMobile.set(true);
    }
    else{
      this.uiState.showNavbar();
    }
  }
}
