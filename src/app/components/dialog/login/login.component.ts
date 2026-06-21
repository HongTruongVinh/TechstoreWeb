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
import { TokenStorageService } from '../../../core/services/ui/token-storage.service';
import { AuthenticationService } from '../../../core/services/api/auth.service';
import { MessengerServices } from '../../../core/services/ui/messenger.service';
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { RegisterComponent } from '../register/register.component';
import { LoginDialogResult } from '../../../models/models/authentication/login-result.model';

import { Store } from '@ngrx/store';
import { loadCartItem } from '../../../store/cart/cart.actions';


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
  loginfail = false;
  loginResult: LoginDialogResult = { success: false };
  loginForm!: UntypedFormGroup;

   private store = inject(Store);
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authenticationService: AuthenticationService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly messengerService: MessengerServices,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      loginIdentifier: ['0123456001', [Validators.required]],
      password: ['Abcd1234', [Validators.required]],
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
          if (res.retCode == ERetCode.LoginSuccess) {
            const data = res.data;
            if (data) {
              this.tokenStorageService.saveUser(data.user);
              this.tokenStorageService.saveToken(data.token);
              this.store.dispatch(loadCartItem());

              this.loginResult = { success: true };
              this.loginForm.reset();
              
              this.close();
            }
          }
          else if (res.retCode == ERetCode.LoginError) {
            this.loginfail = true;
            // this.messengerService.errorNotification('Sai mật khẩu hoặc tài khoản');
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

  openRegisterModal() {

    if (this.registerDialogRef) {
      return; // dialog đang mở, không mở thêm
    }

    this.registerDialogRef = this.dialog.open(
      RegisterComponent,
      {
        id: 'register-modal',
      }
    );

    this.registerDialogRef.closed.subscribe(result => {
      this.registerDialogRef = undefined; // reset dialog ref khi đóng
    });
  }

  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  close() {
    this.dialogRef.close(this.loginResult);
  }
}

