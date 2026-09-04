import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { LinkSettingsService } from "./link-settings.service";
import { firstValueFrom, map, switchMap } from "rxjs";

import { ProductListItemModel } from "../../../models/models/product/product-list-item.model";
import { ProductDetailsModel } from "../../../models/models/product/product-details";
import { Category } from "../../../models/models/category/category.model";
import { ApiResponse } from "../../../models/models/api-response.model";
import { SystemConfigs } from "../../../models/models/home/system-configs.model";

const SYSTEM_CONFIGS_KEY = 'systemConfigs';

@Injectable({ providedIn: 'root' })
export class SystemConfigService {
    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }
    
    fetchSystemConfigs() {
        return this.linkSettingsService
            .getResLinkSetting('Home', 'GetSystemConfigs')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho System Configs');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponse<SystemConfigs>) => res)
            );
    }

    loadSystemConfigs(): Promise<void> {
            return firstValueFrom(this.fetchSystemConfigs())
                .then(res => {
                    if (res.data) {
                        this.saveSystemConfigsToSession(res.data);
                    }
                });
        }

    getSystemConfigsFromSession(): SystemConfigs | null {
        const systemConfigsJson = sessionStorage.getItem(SYSTEM_CONFIGS_KEY);
        if (systemConfigsJson) {
            try {
                return JSON.parse(systemConfigsJson) as SystemConfigs;
            }
            catch (e) {
                console.error('Lỗi khi parse system configs từ sessionStorage:', e);
                return null;
            }
        }
        return null;
    }

    saveSystemConfigsToSession(systemConfigs: SystemConfigs) {
        sessionStorage.setItem(SYSTEM_CONFIGS_KEY, JSON.stringify(systemConfigs));
    }

}