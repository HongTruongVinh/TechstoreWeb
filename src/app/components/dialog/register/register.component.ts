import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RegisterRequestModel } from '../../../models/models/authentication/register-request.model';
import { AuthenticationService } from '../../../core/services/api/auth.service';
import { TokenStorageService } from '../../../core/services/ui/token-storage.service';
import { MessengerServices } from '../../../core/services/ui/messenger.service';
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { Validator } from '../../../library/share-function/validator';
import { CommonModule } from '@angular/common';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  isLoading = false;
  private dialogRef = inject(DialogRef);
  private dialog = inject(Dialog);

  registerForm!: UntypedFormGroup;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authenticationService: AuthenticationService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly messengerService: MessengerServices,
  ) { }

  ngOnInit(): void {
    this.settingRegisterForm();

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
        city: "",
        district: "",
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

              this.openLoginModal();

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

  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  close(): void {
    this.registerForm.reset();
    this.dialogRef.close();
  }

  openLoginModal(): void {
    this.close();
    // this.dialog.open(LoginComponent, {
    //   id: 'login-modal',
    // });
  }
}
