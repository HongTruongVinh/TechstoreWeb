import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { map } from "rxjs";
import { ApiResponse } from "../../../models/models/api-response.model";

import { ListItemOrderModel } from "../../../models/models/order/list-item-order.model";
import { apiEndpoints } from '../../constants/api-endpoints'
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
        private idempotencyService: IdempotencyService
    ) { }

    getUserOrders(page: number, pageSize: number) {
        return this.transferHttp
            .get(apiEndpoints.order.userOrders(page, pageSize))
            .pipe(map((res: ApiResponse<ListItemOrderModel[]>) => res))
    }

    getOrderDetail(orderId: string) {
        return this.transferHttp
            .get(apiEndpoints.order.orderDetails(orderId))
            .pipe(map((res: ApiResponse<OrderModel>) => res))
    }

    createCodOrder(newOrder: OrderCreateModel) {
        return this.transferHttp
            .post(apiEndpoints.order.createCodOrder, newOrder, { idempotencyKey: this.idempotencyService.getOrderKey() })
            .pipe(map((res: ApiResponse<CreateCODOnlineOrderResult>) => res))
    }

    createSnapshotOrder(newOrder: OrderCreateModel) {
        return this.transferHttp
            .post(apiEndpoints.order.createSnapshotOrder, newOrder, { idempotencyKey: this.idempotencyService.getOrderKey() })
            .pipe(map((res: ApiResponse<CreatePaymentSnapshotResult>) => res))
    }

    updateOrder(orderId: string, model: UpdateOrderModel) {
        return this.transferHttp
            .put(apiEndpoints.order.updateOrder(orderId), model)
            .pipe(map((res: ApiResponse<boolean>) => res))
    }

    cancelOrder(id: string, model: CancelOrderModel) {
        return this.transferHttp
            .put(apiEndpoints.order.cancelOrder(id), model)
            .pipe(map((res: ApiResponse<boolean>) => res))
    }
}