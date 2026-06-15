import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, switchMap } from 'rxjs';
import { TransferHttpService } from '../../transfer-http/transfer-http.service';
import { LinkSettingsService } from './link-settings.service';
import { ApiResponseModel } from '../../../models/models/api-response.model';

import { BrandModel as Brand } from '../../../models/models/brand/brand.model';
import { ERetCode } from '../../../models/enum/etype_project.enum';


const BRANDS_KEY = 'brands';
@Injectable({ providedIn: 'root' })
export class BrandService {
    private brands: Brand[] = [];

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    fetchBrands() {
        return this.linkSettingsService.getResLinkSetting('Brand', 'GetBrands')
            .pipe(
                switchMap((apiUrl) => this.transferHttp.get(apiUrl)),
                map((res: ApiResponseModel<Brand[]>) => res)
            );
    }

    loadBrands(): Promise<void> {
        return firstValueFrom(this.fetchBrands())
            .then(res => {
                if (res.retCode === ERetCode.Successfull && res.data) {
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