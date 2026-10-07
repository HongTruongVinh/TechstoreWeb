import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { TransferHttpService } from '../../transfer-http/transfer-http.service';
import { ApiResponse } from '../../../models/models/api-response.model';
import { apiEndpoints } from '../../constants/api-endpoints'

import { Brand as Brand } from '../../../models/models/brand/brand.model';


@Injectable({ providedIn: 'root' })
export class BrandService {
    private brands: Brand[] = [];

    constructor(
        private transferHttp: TransferHttpService
    ) { }

    fetchBrands() {
        return this.transferHttp
            .get(apiEndpoints.brand.getBrands)
            .pipe(map((res: ApiResponse<Brand[]>) => res))
    }

    loadBrands(): Promise<void> {
        return firstValueFrom(this.fetchBrands())
            .then(res => {
                if (res.data) {
                    this.brands = res.data;
                }
            });
    }

    setBrands(brands: Brand[]) {
        this.brands = brands;
    }

    getBrands(): Brand[] {
        return this.brands;
    }
}