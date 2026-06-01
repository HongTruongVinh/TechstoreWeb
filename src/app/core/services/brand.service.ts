import { Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { TransferHttpService } from '../transfer-http/transfer-http.service';
import { LinkSettingsService } from './link-settings.service';
import { ApiResponseModel } from '../../models/models/api-response.model';

import { BrandModel } from '../../models/models/brand/brand.model';
import { ERetCode } from '../../models/enum/etype_project.enum';


@Injectable({ providedIn: 'root' })
export class BrandService {
    private brandsSubject = new BehaviorSubject<BrandModel[]>([]);
    brands$ = this.brandsSubject.asObservable();
    private loaded = false;

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

    loadBrands() {

        if (this.loaded) {
            return;
        }

        this.loaded = true;

        this.getAllItems().subscribe((res) => {
            if (res.retCode == ERetCode.Successfull) {
                if (res.data) {
                    this.brandsSubject.next(res.data);
                }
            }
        })
    }
}