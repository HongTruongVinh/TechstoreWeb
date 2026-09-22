import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { map } from "rxjs";
import { ApiResponse } from "../../../models/models/api-response.model";

import { apiEndpoints } from '../../constants/api-endpoints'
import { PaymentDataForSnapshotModel } from "../../../models/models/payment/payment-qr-for-snapshot.model";

@Injectable({ providedIn: 'root' })
export class PaymentService {

    constructor(
        private transferHttp: TransferHttpService
    ) { }

    GetPaymentQrForSnapshot(snapshotId: string) {
        return this.transferHttp
            .get(apiEndpoints.payment.getPaymentQrForSnapshot(snapshotId))
            .pipe(map((res: ApiResponse<PaymentDataForSnapshotModel>) => res))
    }

}