import { Injectable } from "@angular/core";
import { TransferHttpService } from "../transfer-http/transfer-http.service";
import { map, switchMap } from "rxjs";
import { ApiResponseModel } from "../../models/models/api-response.model";

import { OrderListItemModel } from "../../models/models/order/order-list-item.model";
import { LinkSettingsService } from "./link-settings.service";
import { OrderItemModel } from "../../models/models/order/order-item.model";
import { CartItem } from "../../models/models/cart/cart-item.model";
import { OrderCreateModel } from "../../models/models/order/cod-order-create.model";
import { OrderDetailModel } from "../../models/models/order/order-detail.model";
import { PrepayOrderResult } from "../../models/models/order/prepay-order-result.model";
import { PaymentDataModel } from "../../models/models/payment/payment-data.model";

@Injectable({ providedIn: 'root' })
export class OrderService {

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    getUserOrders() {
        return this.linkSettingsService
            .getResLinkSetting('Order', 'UserOrders')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Order');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponseModel<OrderListItemModel[]>) => res)
            );
    }

    getOrderDetail(orderId: string) {
        return this.linkSettingsService
            .getResLinkSetting('Order', 'OrderDetails',  orderId )
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Chi tiết đơn hàng');
                    }
                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponseModel<OrderDetailModel>) => res)
            );
    }   

    createCodOrder(newOrder: OrderCreateModel) {
        return this.linkSettingsService
            .getResLinkSetting('Order', 'CreateCodOrder')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Tạo đơn hàng COD');
                    }
                    return this.transferHttp.post(apiUrl, newOrder);
                }),
                map((res: ApiResponseModel<string>) => res)
            );
    }

    createPrepayOrder(newOrder: OrderCreateModel) {
        return this.linkSettingsService
            .getResLinkSetting('Payment', 'GetpaymentData')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Tạo đơn hàng Prepay');
                    }
                    return this.transferHttp.post(apiUrl, newOrder);
                }),
                map((res: ApiResponseModel<PaymentDataModel>) => res)
            );
    }

    public getOrderItems() {
      
    }

    cancelOrder() {
        
    }
}