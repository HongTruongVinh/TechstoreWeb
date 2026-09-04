import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { LinkSettingsService } from "./link-settings.service";
import { map, switchMap } from "rxjs";

import { ProductListItemModel } from "../../../models/models/product/product-list-item.model";
import { ProductDetailsModel } from "../../../models/models/product/product-details";
import { Category } from "../../../models/models/category/category.model";
import { ApiResponse } from "../../../models/models/api-response.model";
import { SystemConfigs } from "../../../models/models/home/system-configs.model";



@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    getFeaturedProducts() {
        return this.linkSettingsService
            .getResLinkSetting('Home', 'GetFeatureProducts')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Featured Products');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponse<ProductListItemModel[]>) => res)
            );
    }

    getProductsByBrandName(brandName: string) {
        return this.linkSettingsService
            .getResLinkSetting('Home', 'GetProductsByBrandName', brandName, 1, 16)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho GetProductsByBrandName ');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponse<ProductListItemModel[]>) => res)
            );
    }
}