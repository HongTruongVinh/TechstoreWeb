import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { User } from '../../../../models/models/user/user.model';
import { AuthenticationService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  user!: User;
  activeMenu: string = 'cart'; // default
  nameAvatar: string = '';

  auth = inject(AuthenticationService);
  constructor(
    private readonly router: Router,
    private readonly tokenStorageService: TokenStorageService,
  ) { }

  ngOnInit(): void {

    this.user = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      birthday: new Date(),
      address: '',
    }

    if (this.tokenStorageService.getUser() != null) {
      this.user = this.tokenStorageService.getUser()!;
    }

    // Set the initial name avatar
    if (this.user.firstName && this.user.lastName) {
      this.nameAvatar = this.user.lastName.charAt(0).toUpperCase() + this.user.firstName.charAt(0).toUpperCase();
    } else {
      this.nameAvatar = 'TS'; // Default avatar text
    }
  }

  selectMenu(menu: string) {
  this.activeMenu = menu;

  if (menu === 'cart') this.cart();
  if (menu === 'purchase') this.puchase();
  if (menu === 'info') this.infomation();
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
