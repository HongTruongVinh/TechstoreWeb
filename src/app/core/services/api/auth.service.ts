import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TransferHttpService } from '../../transfer-http/transfer-http.service';
import { ApiResponse } from '../../../models/models/api-response.model';
import { apiEndpoints } from '../../constants/api-endpoints'

import { LoginRequestModel } from '../../../models/models/authentication/login-request.model';
import { RegisterRequestModel } from '../../../models/models/authentication/register-request.model';
import { ChangePasswordRequestModel } from '../../../models/models/authentication/change-password-request.model';
import { User } from '../../../models/models/user/user.model';
import { IdempotencyService } from './idempotency-key.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  idempotencyService = inject(IdempotencyService);

  constructor(
    private transferHttp: TransferHttpService,
  ) { }

  loginNormalAccount(loginRequestModel: LoginRequestModel) {
    return this.transferHttp
      .post(apiEndpoints.authentication.loginNormalAccount, loginRequestModel)
      .pipe(map((res: ApiResponse<User>) => res))
  }

  registerAccount(registerRequestModel: RegisterRequestModel) {
    return this.transferHttp
      .post(apiEndpoints.authentication.registerUser, registerRequestModel)
      .pipe(map((res: ApiResponse<any>) => res))
  }

  changePassword(changePasswordRequest: ChangePasswordRequestModel) {
    return this.transferHttp
      .post(apiEndpoints.authentication.changePassword, changePasswordRequest)
      .pipe(map((res: ApiResponse<any>) => res))
  }

  refreshToken() {
    return this.transferHttp
      .post(apiEndpoints.authentication.refresh, null, { idempotencyKey: this.idempotencyService.getRefreshTokenKey() })
      .pipe(map((res: ApiResponse<boolean>) => res))
  }

  logout(){
    return this.transferHttp
      .post(apiEndpoints.authentication.logout, null)
      .pipe(map((res: ApiResponse<boolean>) => res))
  }
}
