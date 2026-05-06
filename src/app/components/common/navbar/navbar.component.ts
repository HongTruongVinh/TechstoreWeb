import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessengerServices } from '../../../core/services/messenger.service';
import { LoginRequestModel } from '../../../models/models/authentication/login-request.model';
import { RegisterRequestModel } from '../../../models/models/authentication/register-request.model';
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { Validator } from '../../../library/share-function/validator';
import { SessionStorageService } from '../../../core/services/session-storage.service';
import { CartService } from '../../../core/services/cart.service';
import { DeviceService } from '../../../core/services/device.service';
import { LoginComponent } from '../../dialog/login/login.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { UiStateService } from '../../../core/services/ui-state.service';
import { LoginDialogResult } from '../../../models/models/authentication/login-result.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    ReactiveFormsModule
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

  showLoginModal: boolean = false;
  showLoginForm: boolean = true;

  isLoading = false;
  isLoggedIn = false;

  @ViewChild('loginModal', { static: false }) loginModal!: ModalDirective;
  @ViewChild('registerModal', { static: false }) registerModal!: ModalDirective;

  @Output()
  toggleCategories = new EventEmitter<void>();

  loginForm!: UntypedFormGroup;
  registerForm!: UntypedFormGroup;

  fisrtName: string = '';

  constructor(
    private uiState: UiStateService,
    private readonly router: Router,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authenticationService: AuthenticationService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly cartService: CartService,
    private readonly messengerService: MessengerServices,
  ) { }

  ngOnInit(): void {

    this.settingRegisterForm();

    this.loginForm = this.formBuilder.group({
      loginIdentifier: ['0123456001', [Validators.required]],
      password: ['string', [Validators.required]],
    });

    if (this.tokenStorageService.getToken() != null) {
      this.isLoggedIn = true;
    }

    if (this.isLoggedIn && this.tokenStorageService.getUser() != null) {
      this.fisrtName = this.tokenStorageService.getUser()!.firstName;
    }

  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      if (this.searchQuery.trim()) {
        this.router.navigate(['/san-pham', this.searchQuery.trim()]);
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

  private loginDialogRef?: DialogRef<LoginComponent, LoginDialogResult>;
  private dialog = inject(Dialog);
  onLogin() {
    //this.loginModal.show();
    //this.login.emit();

    if (this.loginDialogRef) {
      return; // dialog đang mở, không mở thêm
    }

    const ref = this.dialog.open(
      LoginComponent,
      {
        id: 'login-modal',
      }
    );

    ref.closed.subscribe(result => {
      const data = result as LoginDialogResult | undefined;

      if (data?.success) {
        this.isLoggedIn = true;
        if (this.tokenStorageService.getUser() != null) {
          this.fisrtName = this.tokenStorageService.getUser()!.firstName;
        }
      }
    });
    this.loginDialogRef = undefined;
  }



  loginAction() {
    if (this.checkLoginValidatetion() && this.loginForm.valid) {
      const loginRequest: LoginRequestModel = {
        loginIdentifier: this.loginForm.value.loginIdentifier,
        password: this.loginForm.value.password,
      };

      this.isLoading = true;

      this.authenticationService.loginNormalAccount(loginRequest).subscribe({
        next: (res) => {
          if (res.retCode == 3) {
            const data = res.data;
            if (data) {
              this.tokenStorageService.saveUser(data.user);
              this.tokenStorageService.saveToken(data.token);
              this.fisrtName = data.user.firstName;

              this.createCartSession();

              this.isLoggedIn = true;

              this.loginForm.reset();
              this.loginModal.hide();
            }
          }
          else if (res.retCode == 4) {
            this.messengerService.errorNotification('Sai mật khẩu hoặc tài khoản');
          }
          else {
            this.messengerService.errorNotification(res.systemMessage ?? '');
          }
        },
        error: (error) => {
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });

    }
  }

  createCartSession() {
    this.cartService.getAllItems().subscribe((res) => {
      if (res.retCode == ERetCode.Successfull) {
        if (res.data) {
          this.sessionStorageService.createCartSession(res.data);
        } else {

        }
      } else {

      }
    })
  }

  closeLoginModal(): void {
    this.loginModal.hide();
  }

  openRegisterModal(): void {
    this.loginModal.hide();
    this.registerModal.show();
  }

  settingRegisterForm(): void {
    this.registerForm = this.formBuilder.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: [''],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  registerAction(): void {
    if (this.checkRegisterValidatetion() && this.registerForm.valid) {
      const registerRequest: RegisterRequestModel = {
        lastName: this.registerForm.value.lastName,
        firstName: this.registerForm.value.firstName,
        phoneNumber: this.registerForm.value.phoneNumber,
        address: this.registerForm.value.address,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };

      this.isLoading = true;

      this.authenticationService.registerAccount(registerRequest).subscribe({
        next: (res) => {
          if (res.retCode == ERetCode.Successfull) {
            const data = res.data;
            if (data) {
              this.tokenStorageService.saveUser(data.user);
              this.tokenStorageService.saveToken(data.token);

              this.messengerService.successes('Đăng ký thành công! Vui lòng đăng nhập.');

              this.registerModal.hide();
              this.loginForm.reset();
              this.loginModal.show();
            }
          }
          else {
            this.messengerService.warringWithMessage(res.systemMessage ?? 'có lỗi xảy ra, vui lòng thử lại');
          }
        },
        error: (error) => {
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });

    }
  }

  private checkLoginValidatetion(): boolean {

    return true;
  }

  private checkRegisterValidatetion(): boolean {
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.messengerService.warringWithMessage('Mật khẩu không khớp, vui lòng kiểm tra lại');
      return false;
    }

    if (!Validator.isValidPassword(this.registerForm.value.password)) {
      this.messengerService.warringWithMessage('Mật khẩu phải chứa ít nhất một chữ in hoa, một chữ số và không chứa ký tự đặc biệt');
      return false;
    }

    if (!Validator.isValidVietnamPhone(this.registerForm.value.phoneNumber)) {
      this.messengerService.warringWithMessage('Số điện thoại không hợp lệ, vui lòng nhập số điện thoại Việt Nam');
      return false;
    }

    if (this.registerForm.value.email && !Validator.isValidEmail(this.registerForm.value.email)) {
      this.messengerService.warringWithMessage('Email không hợp lệ, vui lòng kiểm tra lại');
      return false;
    }

    return true;
  }

  openCart() {
    this.router.navigate(['/user/cart']);
  }

}
