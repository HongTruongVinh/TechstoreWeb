import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TransferHttpService } from '../../transfer-http/transfer-http.service';
import { apiEndpoints } from '../../constants/api-endpoints'
import { ApiResponse } from '../../../models/models/api-response.model';
import { Voucher } from '../../../models/models/voucher/voucher.model';
import { OrderItemCreateModel } from '../../../models/models/order/cod-order-create.model';


@Injectable({ providedIn: 'root' })
export class VoucherService {

    constructor(
        private transferHttp: TransferHttpService
    ) { }

    CheckVoucher(voucherCode: string, products: OrderItemCreateModel[]) {
        return this.transferHttp
            .post(apiEndpoints.voucher.getVoucherByCode(voucherCode), products)
            .pipe(map((res: ApiResponse<Voucher>) => res))
    }

    GetVouchers() {
        return this.transferHttp
            .get(apiEndpoints.voucher.getVouchers)
            .pipe(map((res: ApiResponse<Voucher[]>) => res))
    }
}