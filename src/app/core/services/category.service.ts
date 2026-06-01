import { Injectable } from "@angular/core";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { BehaviorSubject, map, switchMap } from "rxjs";
import { ApiResponseModel } from "../../models/models/api-response.model";
import { LinkSettingsService } from "./link-settings.service";

import { CategoryModel } from "../../models/models/category/category.model";
import { ERetCode } from "../../models/enum/etype_project.enum";


@Injectable({ providedIn: 'root' })
export class CategoryService {
    private categoriesSubject = new BehaviorSubject<CategoryModel[]>([]);
    categories$ = this.categoriesSubject.asObservable();
    private loaded = false;

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

    loadCategories() {

        if (this.loaded) {
            return;
        }

        this.loaded = true;

        this.getAllItems().subscribe((res) => {
            if (res.retCode == ERetCode.Successfull) {
                if (res.data) {
                    this.categoriesSubject.next(res.data);
                }
            }
        })
    }

}