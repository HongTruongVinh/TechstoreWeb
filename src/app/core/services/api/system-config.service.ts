import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { apiEndpoints } from '../../constants/api-endpoints'
import { firstValueFrom, map } from "rxjs";

import { ApiResponse } from "../../../models/models/api-response.model";
import { SystemConfigs } from "../../../models/models/home/system-configs.model";

const SYSTEM_CONFIGS_KEY = 'systemConfigs';

@Injectable({ providedIn: 'root' })
export class SystemConfigService {
    constructor(
        private transferHttp: TransferHttpService
    ) { }

    fetchSystemConfigs() {
        return this.transferHttp
            .get(apiEndpoints.home.getSystemConfigs)
            .pipe(map((res: ApiResponse<SystemConfigs>) => res))
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