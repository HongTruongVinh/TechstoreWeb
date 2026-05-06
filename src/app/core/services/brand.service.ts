import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { TransferHttpService } from '../transfer-http/transfer-http.service';
import { LinkSettingsService } from './link-settings.service';
import { ApiResponseModel } from '../../models/models/api-response.model';

import { BrandModel } from '../../models/models/brand/brand.model';


@Injectable({ providedIn: 'root' })
export class BrandService {
    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    getAllItems() {
        return this.linkSettingsService.getResLinkSetting('Brand', 'GetBrands')
            .pipe(
                switchMap((apiUrl) => this.transferHttp.get(apiUrl)),
                map((res: ApiResponseModel<BrandModel[]>) => res)
            );
    }
}