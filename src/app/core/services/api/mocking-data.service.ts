import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TransferHttpService } from '../../transfer-http/transfer-http.service';
import { apiEndpoints } from '../../constants/api-endpoints'
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class MockingDataService {
    private baseUrl = environment.baseUrl;

    constructor(
        private transferHttp: TransferHttpService
    ) { }

    PaymentSuccess(request: PaymentForSnapshotWebhookRequest) {
        return this.transferHttp
            .post(apiEndpoints.mockingDataApi.paymentHub, request)
            .pipe(map((res: any) => res))
    }
}

export interface PaymentForSnapshotWebhookRequest {
    snapshotId: string;
    amount: number;
    transactionId: string;
}