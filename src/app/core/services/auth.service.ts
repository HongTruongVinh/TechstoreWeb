import { Injectable, signal } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { TransferHttpService } from '../transfer-http/transfer-http.service';
import { LinkSettingsService } from './link-settings.service';
import { ApiResponseModel } from '../../models/models/api-response.model';

import { LoginRequestModel } from '../../models/models/authentication/login-request.model';
import { RegisterRequestModel } from '../../models/models/authentication/register-request.model';
import { LoginResponeModel } from '../../models/models/authentication/login-response.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(
    private transferHttp: TransferHttpService,
    private linkSettingsService: LinkSettingsService
  ) { }

  loginNormalAccount(loginRequestModel: LoginRequestModel){
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

  isLoggedIn = signal(false);

  login() {
    this.isLoggedIn.set(true);
  }

  logout() {
    this.isLoggedIn.set(false);
  }

}
