import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { apiEndpoints } from '../../constants/api-endpoints'
import { map } from "rxjs";

import { ProductListItemModel } from "../../../models/models/product/product-list-item.model";
import { ApiResponse } from "../../../models/models/api-response.model";



@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    getFeaturedProducts() {
        return this.transferHttp
            .get(apiEndpoints.home.getFeatureProducts)
            .pipe(map((res: ApiResponse<ProductListItemModel[]>) => res))
    }

    getProductsByBrandName(brandName: string) {
        return this.transferHttp
            .get(apiEndpoints.home.getProductsByBrandName(brandName, 1, 16))
            .pipe(map((res: ApiResponse<ProductListItemModel[]>) => res))
    }
}