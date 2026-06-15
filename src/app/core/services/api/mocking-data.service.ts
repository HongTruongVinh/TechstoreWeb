import { Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { TransferHttpService } from '../../transfer-http/transfer-http.service';
import { LinkSettingsService } from './link-settings.service';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class MockingDataService {
    private baseUrl = environment.baseUrl;

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    PaymentSuccess(request: PaymentForSnapshotWebhookRequest) {
        return this.linkSettingsService.getResLinkSetting('MockingDataAPI', 'PaymentHub')
            .pipe(
                switchMap((apiUrl) => this.transferHttp.post(apiUrl, request)),
                map((res: any) => res)
            );
    }
}

export interface PaymentForSnapshotWebhookRequest {
    snapshotId: string;
    amount: number;
    transactionId: string;
}