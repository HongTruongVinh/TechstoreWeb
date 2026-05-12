import { Injectable } from "@angular/core";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { LinkSettingsService } from "./link-settings.service";
import { map, switchMap } from "rxjs";
import { ApiResponseModel } from "../../models/models/api-response.model";

import { ProductListItemModel } from "../../models/models/product/product-list-item.model";
import { ProductDetailsModel } from "../../models/models/product/product-details";
import { CategoryModel } from "../../models/models/category/category.model";



@Injectable({ providedIn: 'root' })
export class ProductService {
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
                map((res: ApiResponseModel<CategoryModel>) => res)
            );
    }


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
                map((res: ApiResponseModel<ProductListItemModel[]>) => res)
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
                map((res: ApiResponseModel<ProductDetailsModel>) => res)
            );
    }

    searchProducts(keyword: string, page: number, pageSize: number) {
        return this.linkSettingsService
            .getResLinkSetting('Product', 'SearchCustomerProducts', keyword, page, pageSize)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Search Products');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponseModel<ProductListItemModel[]>) => res)
            );
    }

    GetProductsByCategory(categorySlug: string, page: number, pageSize: number) {
        return this.linkSettingsService
            .getResLinkSetting('Product', 'GetProductsByCategory', categorySlug, page, pageSize)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho GetProductsByCategory');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponseModel<ProductListItemModel[]>) => res)
            );
    }

    GetProductsByCategoryAndBrand(categorySlug: string, brandSlug: string, page: number, pageSize: number) {
        return this.linkSettingsService
            .getResLinkSetting('Product', 'GetProductsByCategoryAndBrand', categorySlug, brandSlug, page, pageSize)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho GetProductsByCategoryAndBrand');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponseModel<ProductListItemModel[]>) => res)
            );
    }
}