import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { TransferHttpService } from '../../transfer-http/transfer-http.service';
import { LinkSettingsService } from './link-settings.service';
import { ApiResponse } from '../../../models/models/api-response.model';
import { Voucher } from '../../../models/models/voucher/voucher.model';
import { OrderItemCreateModel } from '../../../models/models/order/cod-order-create.model';


@Injectable({ providedIn: 'root' })
export class VoucherService {

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    CheckVoucher(voucherCode: string, products: OrderItemCreateModel[]) {
        return this.linkSettingsService
            .getResLinkSetting('Voucher', 'GetVoucherByCode', voucherCode)
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Voucher');
                    }

                    return this.transferHttp.post(apiUrl, products);
                }),
                map((res: ApiResponse<Voucher>) => res)
            );
    }

    GetVouchers() {
        return this.linkSettingsService
            .getResLinkSetting('Voucher', 'GetVouchers')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Voucher');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponse<Voucher[]>) => res)
            );
    }
}