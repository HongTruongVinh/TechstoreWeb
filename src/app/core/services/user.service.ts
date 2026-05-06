import { Injectable } from "@angular/core";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { map, switchMap } from "rxjs";
import { LinkSettingsService } from "./link-settings.service";
import { ApiResponseModel } from "../../models/models/api-response.model";
import { UserUpdateModel } from "../../models/models/user/user-update.model";

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    updateProfile(model: UserUpdateModel) {

        return this.linkSettingsService
                    .getResLinkSetting('User', 'UpdateProfile')
                    .pipe(
                        switchMap((apiUrl) => {
                            if (!apiUrl) {
                                throw new Error('Không tìm thấy URL API cho Search Products');
                            }
        
                            return this.transferHttp.put(apiUrl, model);
                        }),
                        map((res: ApiResponseModel<boolean>) => res)
                    );
    }
}