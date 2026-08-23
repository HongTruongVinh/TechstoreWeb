import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { map, switchMap } from "rxjs";
import { ApiResponse } from "../../../models/models/api-response.model";

import { LinkSettingsService } from "./link-settings.service";
import { PaymentDataForSnapshotModel } from "../../../models/models/payment/payment-qr-for-snapshot.model";

@Injectable({ providedIn: 'root' })
export class PaymentService {

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    GetPaymentQrForSnapshot(snapshotId: string) {
        return this.linkSettingsService
            .getResLinkSetting('Payment', 'GetPaymentQrForSnapshot', snapshotId)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho mã qr thanh toán');
                    }
                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponse<PaymentDataForSnapshotModel>) => res)
            );
    }

}