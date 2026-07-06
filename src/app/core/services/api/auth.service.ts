import { Injectable, signal } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { TransferHttpService } from '../../transfer-http/transfer-http.service';
import { LinkSettingsService } from './link-settings.service';
import { ApiResponseModel } from '../../../models/models/api-response.model';

import { LoginRequestModel } from '../../../models/models/authentication/login-request.model';
import { RegisterRequestModel } from '../../../models/models/authentication/register-request.model';
import { LoginResponeModel } from '../../../models/models/authentication/login-response.model';
import { ChangePasswordRequestModel } from '../../../models/models/authentication/change-password-request.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(
    private transferHttp: TransferHttpService,
    private linkSettingsService: LinkSettingsService
  ) { }

  loginNormalAccount(loginRequestModel: LoginRequestModel) {
    return this.linkSettingsService.getResLinkSetting('Authentication', 'LoginNormalAccount')
      .pipe(
        switchMap((apiUrl) => {
          if (!apiUrl) {
            throw new Error('Không tìm thấy URL API cho LoginNormalAccount');
          }

          return this.transferHttp.post(apiUrl, loginRequestModel);
        }),
        map((res: ApiResponseModel<LoginResponeModel>) => res)
      );
  }

  registerAccount(registerRequestModel: RegisterRequestModel) {
    return this.linkSettingsService.getResLinkSetting('Authentication', 'RegisterUser')
      .pipe(
        switchMap((apiUrl) => {
          if (!apiUrl) {
            throw new Error('Không tìm thấy URL API cho RegisterUser');
          }

          return this.transferHttp.post(apiUrl, registerRequestModel);
        }),
        map((res: ApiResponseModel<any>) => res)
      );
  }

  changePassword(changePasswordRequest: ChangePasswordRequestModel) {
    return this.linkSettingsService.getResLinkSetting('Authentication', 'ChangePassword')
      .pipe(
        switchMap((apiUrl) => {
          if (!apiUrl) {
            throw new Error('Không tìm thấy URL API cho ChangePassword');
          }

          return this.transferHttp.put(apiUrl, changePasswordRequest);
        }),
        map((res: ApiResponseModel<any>) => res)
      );
  }
}
