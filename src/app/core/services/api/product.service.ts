import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { LinkSettingsService } from "./link-settings.service";
import { map, switchMap } from "rxjs";
import { ApiResponse, PagedResult } from "../../../models/models/api-response.model";

import { ProductListItemModel } from "../../../models/models/product/product-list-item.model";
import { ProductDetailsModel } from "../../../models/models/product/product-details";
import { Category } from "../../../models/models/category/category.model";
import { ProductSearchQuery } from "../../../models/models/product/product-search-query.model";



@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    getFeaturedProducts() {
        return this.linkSettingsService
            .getResLinkSetting('Product', 'GetFeaturedProducts')
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

    getProductDetails(productId: string) {
        return this.linkSettingsService
            .getResLinkSetting('Product', 'GetProductDetails', productId)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Product Details');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponse<ProductDetailsModel>) => res)
            );
    }

    getProducts(query: ProductSearchQuery) {
        return this.linkSettingsService
            .GetResLinkSettingWithQueryObject('Product', 'GetProducts', query)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Search Products');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponse<PagedResult<ProductListItemModel>>) => res)
            );
    }
}