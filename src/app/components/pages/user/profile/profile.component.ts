import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../core/services/ui/token-storage.service';
import { MessengerServices } from '../../../../core/services/ui/messenger.service';
import { User } from '../../../../models/models/user/user.model';
import { UserService } from '../../../../core/services/api/user.service';
import { UserUpdateModel } from '../../../../models/models/user/user-update.model';
import { ERetCode } from '../../../../models/enum/etype_project.enum';
import { CommonModule } from '@angular/common';
import { Validator } from '../../../../library/share-function/validator';
import { AuthenticationService } from '../../../../core/services/api/auth.service';
import { ChangePasswordRequestModel } from '../../../../models/models/authentication/change-password-request.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user!: User;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private readonly router: Router,
    private formBuilder: FormBuilder,
    private readonly tokenStorageService: TokenStorageService,
    private readonly userService: UserService,
    private readonly authService: AuthenticationService,
    private readonly messengerService: MessengerServices,
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
      city: '',
      district: '',
    }

    this.profileForm = this.formBuilder.group({
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }, Validators.required]
    });

    this.loadData();
  }

  loadData() {
    if (this.tokenStorageService.getUser() != null) {
      this.user = this.tokenStorageService.getUser()!;

      if (this.user != null) {
        this.profileForm.get('firstName')?.patchValue(this.user.firstName);
        this.profileForm.get('lastName')?.patchValue(this.user.lastName);
        this.profileForm.get('phoneNumber')?.patchValue(this.user.phoneNumber);
        this.profileForm.get('email')?.patchValue(this.user.email);
        this.profileForm.get('address')?.patchValue(this.user.address);
        this.originalProfileData = this.user;
      }
    }
  }

  fieldTextType!: boolean;
  fieldTextType1!: boolean;
  fieldTextType2!: boolean;

  formGroups: FormGroup[] = [];
  profileForm!: FormGroup;
  currentTab = 'personalDetails';
  isEditMode = false;
  originalProfileData: any;



  updateProfileAction() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    if (!this.checkProfileValidation()) {
      return;
    }

    const user = this.tokenStorageService.getUser();
    var id = user?.id;

    const dataInsert: UserUpdateModel = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      phoneNumber: this.profileForm.value.phoneNumber,
      email: this.profileForm.value.email,
      address: this.profileForm.value.address,
    }

    this.userService.updateProfile(dataInsert).subscribe((res) => {
      if (res.retCode == ERetCode.Successfull) {
        var user = this.tokenStorageService.getUser();
        if (user) {
          user.firstName = dataInsert.firstName;
          user.lastName = dataInsert.lastName;
          user.phoneNumber = dataInsert.phoneNumber;
          user.email = dataInsert.email;
          user.address = dataInsert.address;
          this.tokenStorageService.saveUser(user);
          this.isEditMode = false;
          this.profileForm.disable(); // Vô hiệu hóa FormControl
          this.loadData();
        }
        this.isEditMode = false;
        this.messengerService.successes("Cập nhật thành công");
      } else {
        this.messengerService.errorWithIssue();
      }
    });
  }

  private checkProfileValidation(): boolean {
    if (!Validator.isValidVietnamPhone(this.profileForm.value.phoneNumber)) {
      this.messengerService.warringWithMessage('Số điện thoại không hợp lệ, vui lòng nhập số điện thoại Việt Nam');
      return false;
    }

    if (this.profileForm.value.email && !Validator.isValidEmail(this.profileForm.value.email)) {
      this.messengerService.warringWithMessage('Email không hợp lệ, vui lòng kiểm tra lại');
      return false;
    }

    return true;
  }

  changePassword() {
    if (!Validator.isValidPassword(this.oldPassword)) {
      this.messengerService.warringWithMessage('Mật khẩu phải chứa ít nhất một chữ in hoa, một chữ số và không chứa ký tự đặc biệt');
      return ;
    }

    if(this.newPassword != this.confirmPassword) {
      this.messengerService.warringWithMessage('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return ;
    }

    if (this.newPassword.length > 18) {
      this.messengerService.warringWithMessage('Mật khẩu không được vượt quá 18 ký tự.');
      return;
    }

    const changePasswordRequest: ChangePasswordRequestModel = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.authService.changePassword(changePasswordRequest).subscribe((res) => {
      if (res.retCode == ERetCode.Successfull) {
        this.messengerService.successes("Đổi mật khẩu thành công");
      } else {
        this.messengerService.errorNotification(res.systemMessage || "Đổi mật khẩu thất bại");
      }
    });
  }

  /**
  * Default Select2
  */
  selectedAccount = 'This is a placeholder';

  // Change Tab Content
  changeTab(tab: string) {
    this.currentTab = tab;
  }

  // File Upload
  imageURL: any;
  fileChange(event: any, id: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      if (id == '0') {
        document.querySelectorAll('#cover-img').forEach((element: any) => {
          element.src = this.imageURL;
        });
      }
      if (id == '1') {
        document.querySelectorAll('#user-img').forEach((element: any) => {
          element.src = this.imageURL;
        });
      }
    }

    reader.readAsDataURL(file)
  }

  /**
  * Password Hide/Show
  */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1
  }
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  // add Form
  addForm() {
    const formGroupClone = this.formBuilder.group(this.profileForm.value);
    this.formGroups.push(formGroupClone);
  }

  // Delete Form
  deleteForm(id: any) {
    this.formGroups.splice(id, 1)
  }

  enableEditMode() {
    this.isEditMode = true;
    this.profileForm.enable(); // Cho phép nhập liệu FormControl
  }

  cancelEdit() {
    this.isEditMode = false;
    this.profileForm.disable(); // Vô hiệu hóa FormControl
    this.profileForm.reset(this.originalProfileData); // Hoặc patch lại dữ liệu ban đầu
  }
}
