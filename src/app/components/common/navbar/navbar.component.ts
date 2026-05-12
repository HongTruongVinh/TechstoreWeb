import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { DeviceService } from '../../../core/services/device.service';
import { LoginDialogResult } from '../../../models/models/authentication/login-result.model';
import { AuthDialogService } from '../../../core/services/AuthDialogService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output()
  login = new EventEmitter<void>();

  device = inject(DeviceService);
  searchQuery: string = '';
  isScrolled: boolean = false;

  isLoading = false;

  @Output()
  toggleCategories = new EventEmitter<void>();

  fisrtName: string = '';

  authDialog = inject(AuthDialogService);
  tks = inject(TokenStorageService);
  constructor(
    private readonly router: Router
  ) { }

  ngOnInit(): void {


  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      if (this.searchQuery.trim()) {
        this.router.navigate(['/tim-kiem', this.searchQuery.trim()]);
      }
    }
  }

  openCategories() {
    this.toggleCategories.emit();
  }

  phoneNumber = '0393574180';
  contact(): void {
    window.open(`https://zalo.me/${this.phoneNumber}`, '_blank');
  }

  onLogin() {

    const ref = this.authDialog.openLogin();

    ref.closed.subscribe(result => {
      const data = result as LoginDialogResult | undefined;

      if (data?.success) {
        this.tks.isLoggedIn.set(true);
        if (this.tks.getUser() != null) {
          this.fisrtName = this.tks.getUser()!.firstName;
        }
      }
    });
  }

  openCart() {
    this.router.navigate(['/user/cart']);
  }

}
