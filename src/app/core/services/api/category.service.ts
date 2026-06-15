import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { firstValueFrom, map, switchMap } from "rxjs";
import { ApiResponseModel } from "../../../models/models/api-response.model";
import { LinkSettingsService } from "./link-settings.service";

import { Category } from "../../../models/models/category/category.model";
import { ERetCode } from "../../../models/enum/etype_project.enum";


@Injectable({ providedIn: 'root' })
export class CategoryService {

    private categories: Category[] = [];

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    fetchCategories() {
        return this.linkSettingsService
            .getResLinkSetting('Category', 'GetCategories')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Category');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponseModel<Category[]>) => res)
            );
    }

    loadCategories(): Promise<void> {
        return firstValueFrom(this.fetchCategories())
            .then(res => {
                if (res.retCode === ERetCode.Successfull && res.data) {
                    this.categories = res.data;
                }
            });
    }

    setCategories(models: Category[]) {
        return this.categories;
    }

    getCategories(): Category[] {
        return this.categories;
    }

}