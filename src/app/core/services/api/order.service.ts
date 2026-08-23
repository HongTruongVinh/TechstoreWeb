import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { map, switchMap } from "rxjs";
import { ApiResponse} from "../../../models/models/api-response.model";

import { ListItemOrderModel } from "../../../models/models/order/list-item-order.model";
import { LinkSettingsService } from "./link-settings.service";
import { OrderCreateModel } from "../../../models/models/order/cod-order-create.model";
import { OrderModel } from "../../../models/models/order/order.model";
import { CancelOrderModel } from "../../../models/models/order/cancel-order.model";
import { UpdateOrderModel } from "../../../models/models/order/update-order.model";
import { IdempotencyService } from "./idempotency-key.service";
import { CreateCODOnlineOrderResult } from "../../../models/models/order/create-cod-order-result.model";
import { CreatePaymentSnapshotResult } from "../../../models/models/order/create-snapshot-result.model";

@Injectable({ providedIn: 'root' })
export class OrderService {

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService,
        private idempotencyService: IdempotencyService
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
                map((res: ApiResponse<CreateCODOnlineOrderResult>) => res)
            );
    }

    createSnapshotOrder(newOrder: OrderCreateModel) {
        return this.linkSettingsService
            .getResLinkSetting('Order', 'CreateSnapshotOrder')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Tạo đơn hàng Prepay');
                    }
                    return this.transferHttp.post(apiUrl, newOrder, this.idempotencyService.getOrderKey());
                }),
                map((res: ApiResponse<CreatePaymentSnapshotResult>) => res)
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