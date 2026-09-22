import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { apiEndpoints } from '../../constants/api-endpoints'
import { map } from "rxjs";
import { ApiResponse, PagedResult } from "../../../models/models/api-response.model";

import { ProductListItemModel } from "../../../models/models/product/product-list-item.model";
import { ProductDetailsModel } from "../../../models/models/product/product-details";
import { ProductSearchQuery } from "../../../models/models/product/product-search-query.model";



@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    getProductDetails(productId: string) {
        return this.transferHttp
            .get(apiEndpoints.product.getProductDetails(productId))
            .pipe(map((res: ApiResponse<ProductDetailsModel>) => res))
    }

    getProducts(query: ProductSearchQuery) {
        return this.transferHttp
            .get(apiEndpoints.product.getProducts(query))
            .pipe(map((res: ApiResponse<PagedResult<ProductListItemModel>>) => res))
    }
}