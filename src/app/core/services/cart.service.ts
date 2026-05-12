import { Injectable } from "@angular/core";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { LinkSettingsService } from "./link-settings.service";
import { map, switchMap } from "rxjs";
import { CartItemCreateModel } from "../../models/models/cart/cart-item-create.model";
import { ApiResponseModel } from "../../models/models/api-response.model";
import { CartItem } from "../../models/models/cart/cart-item.model";




@Injectable({ providedIn: 'root' })
export class CartService {
    constructor(
        private transferHttp: TransferHttpService,
        private readonly linkSettingsService: LinkSettingsService  
    ) { }

    getAllItems(pageNumber: number, pageSize: number) {
        return this.linkSettingsService.getResLinkSetting('Cart', 'GetAllItems', pageNumber, pageSize)
                    .pipe(
                        switchMap((apiUrl) => this.transferHttp.get(apiUrl)),
                        map((res: ApiResponseModel<CartItem[]>) => res)
                    );
    }

    // getItem(id: string) {
    //     const ApiUrl = LinkSettings.GetResLinkSetting('Brand', 'GetBrand', id, true);
    //     return this.transferHttp.get(ApiUrl).pipe(map((res: RepositoryModel<BrandModel>) => res));
    // }

    createItem(model: CartItemCreateModel) {
        return this.linkSettingsService.getResLinkSetting('Cart', 'AddItemToCart')
                    .pipe(
                        switchMap((apiUrl) => this.transferHttp.post(apiUrl, model)),
                        map((res: ApiResponseModel<boolean>) => res)
                    );
    }

    // updateItem(id: string, model: CartItemUpdateModel) {
    //     const ApiUrl = LinkSettings.GetResLinkSetting('Cart', 'UpdateItemInCart', id);
    //     return this.transferHttp.put(ApiUrl, model).pipe(map((res: RepositoryModel<boolean>) => res));
    // }

    // deleteItem(id: string) {
    //     const ApiUrl = LinkSettings.GetResLinkSetting('Brand', 'DeleteBrand', id);
    //     return this.transferHttp.delete(ApiUrl).pipe(map((res: RepositoryModel<boolean>) => res));
    // }

    deleteItem(items: string[]) {
        return this.linkSettingsService.getResLinkSetting('Cart', 'RemoveItemFromCart')
                    .pipe(
                        switchMap((apiUrl) => this.transferHttp.put(apiUrl, items)),
                        map((res: ApiResponseModel<boolean>) => res)
                    );
    }
}