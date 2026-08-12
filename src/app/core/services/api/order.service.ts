import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { map, switchMap } from "rxjs";
import { ApiResponse} from "../../../models/models/api-response.model";

import { ListItemOrderModel } from "../../../models/models/order/list-item-order.model";
import { LinkSettingsService } from "./link-settings.service";
import { OrderItemModel } from "../../../models/models/order/order-item.model";
import { CartItem } from "../../../models/models/cart/cart-item.model";
import { OrderCreateModel } from "../../../models/models/order/cod-order-create.model";
import { OrderModel } from "../../../models/models/order/order.model";
import { PrepayOrderResult } from "../../../models/models/order/prepay-order-result.model";
import { PaymentDataModel } from "../../../models/models/payment/payment-data.model";
import { CancelOrderModel } from "../../../models/models/order/cancel-order.model";
import { UpdateOrderModel } from "../../../models/models/order/update-order.model";

@Injectable({ providedIn: 'root' })
export class OrderService {

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    getUserOrders(page: number, pageSize: number) {
        return this.linkSettingsService
            .getResLinkSetting('Order', 'UserOrders', page, pageSize)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Order');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponse<ListItemOrderModel[]>) => res)
            );
    }

    getOrderDetail(orderId: string) {
        return this.linkSettingsService
            .getResLinkSetting('Order', 'OrderDetails', orderId)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Chi tiết đơn hàng');
                    }
                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponse<OrderModel>) => res)
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
                map((res: ApiResponse<string>) => res)
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
                map((res: ApiResponse<PaymentDataModel>) => res)
            );
    }

    updateOrder(orderId: string, model: UpdateOrderModel){
        return this.linkSettingsService
            .getResLinkSetting('Order', 'UpdateOrder', orderId)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Tạo đơn hàng COD');
                    }
                    return this.transferHttp.put(apiUrl, model);
                }),
                map((res: ApiResponse<boolean>) => res)
            );
    }

    cancelOrder(id: string, model: CancelOrderModel) {
        return this.linkSettingsService
            .getResLinkSetting('Order', 'CancelOrder', id)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Tạo đơn hàng COD');
                    }
                    return this.transferHttp.put(apiUrl, model);
                }),
                map((res: ApiResponse<boolean>) => res)
            );
    }
}