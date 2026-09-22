import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { apiEndpoints } from '../../constants/api-endpoints'
import { map, Observable } from "rxjs";
import { CartItemCreateModel } from "../../../models/models/cart/cart-item-create.model";
import { ApiResponse } from "../../../models/models/api-response.model";
import { CartItem } from "../../../models/models/cart/cart-item.model";


@Injectable({ providedIn: 'root' })
export class CartService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    getAllItems(pageNumber: number, pageSize: number) {
        return this.transferHttp
            .get(apiEndpoints.cart.getAllItems)
            .pipe(map((res: ApiResponse<CartItem[]>) => res))
    }

    addCartItem(model: CartItemCreateModel): Observable<ApiResponse<CartItem>> {
        return this.transferHttp
            .post(apiEndpoints.cart.addItemToCart, model)
            .pipe(map((res: ApiResponse<CartItem>) => res))
    }

    removeItems(itemIds: string[]) {
        return this.transferHttp
            .put(apiEndpoints.cart.removeItemFromCart, itemIds)
            .pipe(map((res: ApiResponse<CartItem[]>) => res))
    }
}