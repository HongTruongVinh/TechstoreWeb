import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { LoginRequestModel } from '../../../models/models/authentication/login-request.model';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { SessionStorageService } from '../../../core/services/session-storage.service';
import { MessengerServices } from '../../../core/services/messenger.service';
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { CartService } from '../../../core/services/cart.service';
import { RegisterComponent } from '../register/register.component';
import { UiStateService } from '../../../core/services/ui-state.service';
import { LoginDialogResult } from '../../../models/models/authentication/login-result.model';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private dialogRef = inject(DialogRef);
  private registerDialogRef?: DialogRef<unknown, RegisterComponent>;
  private dialog = inject(Dialog);

  isLoading = false;
  loginResult: LoginDialogResult = { success: false };
  loginForm!: UntypedFormGroup;

  constructor(
    private uiState: UiStateService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authenticationService: AuthenticationService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly messengerService: MessengerServices,
    private readonly cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      loginIdentifier: ['0123456001', [Validators.required]],
      password: ['string', [Validators.required]],
    });
  }

  submit() {
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

              this.createCartSession();

              this.loginResult = { success: true };

              this.loginForm.reset();

              this.authenticationService.login();
              
              this.close();
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

  private checkLoginValidatetion(): boolean {

    return true;
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


  openRegisterModal() {
    //this.login.emit();

    if (this.registerDialogRef) {
      return; // dialog đang mở, không mở thêm
    }

    this.registerDialogRef = this.dialog.open(
      RegisterComponent,
      {
        id: 'register-modal',
      }
    );

    this.uiState.hideMobileMenu();
    this.uiState.hideNavbar();
    this.uiState.hideWidgetPanel();

    this.registerDialogRef.closed.subscribe(result => {
      console.log('Register Dialog closed with result:', result);
      this.registerDialogRef = undefined; // reset dialog ref khi đóng
      this.uiState.showMobileMenu();
      this.uiState.showNavbar();
    });
  }

  // submit() {

  //   if (this.loginForm.invalid) {
  //     this.loginForm.markAllAsTouched();
  //     return;
  //   }

  //   console.log(this.loginForm.value);
  //   this.dialogRef.close(this.loginForm.value);
  // }

  close() {
    this.dialogRef.close(this.loginResult);
  }
}

