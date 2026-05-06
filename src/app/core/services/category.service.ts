import { Injectable } from "@angular/core";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { map, switchMap } from "rxjs";
import { ApiResponseModel } from "../../models/models/api-response.model";
import { LinkSettingsService } from "./link-settings.service";

import { CategoryModel } from "../../models/models/category/category.model";

@Injectable({ providedIn: 'root' })
export class CategoryService {
    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    getAllItems() {
        return this.linkSettingsService
            .getResLinkSetting('Category', 'GetCategories')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Category');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponseModel<CategoryModel[]>) => res)
            );
    }
}