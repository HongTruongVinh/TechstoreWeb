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

@Injectable({ providedIn: 'root' })
export class PaymentService {

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    getPaymentData(paymentId: string) {
        return this.linkSettingsService
            .getResLinkSetting('Payment', 'GetpaymentData', paymentId)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Tạo đơn hàng Prepay');
                    }
                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponseModel<PrepayOrderResult>) => res)
            );
    }

}