import { Injectable } from "@angular/core";
import { TransferHttpService } from "../../transfer-http/transfer-http.service";
import { firstValueFrom, map, switchMap } from "rxjs";
import { ApiResponse } from "../../../models/models/api-response.model";
import { LinkSettingsService } from "./link-settings.service";

import { Category } from "../../../models/models/category/category.model";
import { ERetCode } from "../../../models/enum/etype_project.enum";
import { PriceFilter } from "../../../models/models/product/price-fillter.model";


@Injectable({ providedIn: 'root' })
export class CategoryService {

    private categories: Category[] = [];
    private priceFilters: PriceFilter[] = [];

    constructor(
        private transferHttp: TransferHttpService,
        private linkSettingsService: LinkSettingsService
    ) { }

    fetchCategories() {
        return this.linkSettingsService
            .getResLinkSetting('Category', 'GetCategories')
            .pipe(
                switchMap((apiUrl) => {
                    if (!apiUrl) {
                        throw new Error('Không tìm thấy URL API cho Category');
                    }

                    return this.transferHttp.get(apiUrl);
                }),
                map((res: ApiResponse<Category[]>) => res)
            );
    }

    loadCategories(): Promise<void> {
        return firstValueFrom(this.fetchCategories())
            .then(res => {
                if (res.data) {
                    this.categories = res.data;
                }
            });
    }

    setCategories(models: Category[]) {
        return this.categories;
    }

    getCategories(): Category[] {
        return this.categories;
    }

    getPriceFilters(): PriceFilter[] {
        if (!this.priceFilters || this.priceFilters.length === 0) {
            this.priceFilters = [
                { label: 'Dưới 3 triệu', minPrice: undefined, maxPrice: 3000000 },
                { label: '3 triệu - 5 triệu', minPrice: 3000000, maxPrice: 5000000 },
                { label: '5 triệu - 10 triệu', minPrice: 5000000, maxPrice: 10000000 },
                { label: '10 triệu - 20 triệu', minPrice: 10000000, maxPrice: 20000000 },
                { label: 'Trên 20 triệu', minPrice: 20000000, maxPrice: undefined },
            ];
        }

        return this.priceFilters;
    }
}