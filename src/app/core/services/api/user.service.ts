import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { map } from "rxjs";
import { apiEndpoints } from '../../constants/api-endpoints'
import { ApiResponse } from "../../../models/models/api-response.model";
import { UserUpdateModel } from "../../../models/models/user/user-update.model";

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    updateProfile(model: UserUpdateModel) {
        return this.transferHttp
            .put(apiEndpoints.user.updateProfile, model)
            .pipe(map((res: ApiResponse<boolean>) => res))
    }
}