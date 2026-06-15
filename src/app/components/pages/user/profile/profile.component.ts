import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../core/services/ui/token-storage.service';
import { MessengerServices } from '../../../../core/services/ui/messenger.service';
import { User } from '../../../../models/models/user/user.model';
import { UserService } from '../../../../core/services/api/user.service';
import { UserUpdateModel } from '../../../../models/models/user/user-update.model';
import { ERetCode } from '../../../../models/enum/etype_project.enum';
import { CommonModule } from '@angular/common';

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

  constructor(
    private readonly router: Router,
    private formBuilder: FormBuilder,
    private readonly tokenStorageService: TokenStorageService,
    private readonly userService: UserService,
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
    }

    this.profileForm = this.formBuilder.group({
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }]
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
    const user = this.tokenStorageService.getUser();
    var id = user?.id;

    if (this.profileForm.valid) {
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
              this.loadData();
            }
            this.messengerService.successes("Cập nhật thành công");
          } else {
            this.messengerService.errorWithIssue();
          }
        });
      } else {
        this.messengerService.errorWithIssue();
      }
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
