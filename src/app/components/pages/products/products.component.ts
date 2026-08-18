import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { ProductListItemModel } from '../../../models/models/product/product-list-item.model';
import { Category } from '../../../models/models/category/category.model';
import { BrandModel } from '../../../models/models/brand/brand.model';
import { ProductService } from '../../../core/services/api/product.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from "../../common/breadcrumb/breadcrumb.component";
import { EErrorType } from '../../../models/enum/etype_project.enum';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { PagedResult } from '../../../models/models/api-response.model';
import { ProductSearchQuery } from '../../../models/models/product/product-search-query.model';
import { CategoryService } from '../../../core/services/api/category.service';
import { BrandService } from '../../../core/services/api/brand.service';
import { MessengerServices } from '../../../core/services/ui/messenger.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    BreadcrumbComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Trang chủ', url: '/' },
    { label: 'Tìm kiếm sản phẩm' }
  ];
  title: string = '';
  lastKeyword: string = '';

  products: ProductListItemModel[] = [];
  categories: Category[] = [];
  brands: BrandModel[] = [];
  priceFilter = {
    minPrice: '',
    maxPrice: ''
  };

  pagedResult?: PagedResult<ProductListItemModel>;
  query: ProductSearchQuery = {
    page: 1,
    pageSize: 12,
  }

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly route: ActivatedRoute,
    private readonly messengerService: MessengerServices
  ) { }

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
    this.brands = this.brandService.getBrands();

    this.route.paramMap.subscribe(params => {
      const keyword = params.get('keyword');
      const categorySlug = params.get('categorySlug');
      const brandSlug = params.get('brandSlug');
      const priceFilterSlug = params.get('priceFilterSlug');

      this.query = {
        page: 1,
        pageSize: 12
      }

      this.products = [];

      this.query.keyword = keyword ?? undefined;

      if (keyword) {
        this.title = keyword;
      }

      if (categorySlug) {
        const category = this.categories.find(c => c.slug === categorySlug);
        this.query.categoryId = category?.id;
        this.title = ' ' + category?.name;
      }

      if (brandSlug) {
        if (brandSlug != 'tat-ca') {
          const brand = this.brands.find(c => c.slug === brandSlug);
          this.query.brandId = brand?.id;
          this.title += ' ' + brand?.name;
        }
      }

      if (priceFilterSlug) {
        const priceFilter = this.parsePriceFilter(priceFilterSlug);

        this.query.minPrice = priceFilter?.minPrice;
        this.query.maxPrice = priceFilter?.maxPrice;
      }

      this.priceFilter.minPrice = this.query.minPrice ?? '';
      this.priceFilter.maxPrice = this.query.maxPrice ?? '';

      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.getProducts(this.query).subscribe((res) => {
      if (res.data) {
          this.pagedResult = res.data;
          this.products.push(...res.data.items)
        }
        else {
          this.messengerService.errorNotification(res.message ?? '');
        }
    })
  }

  tabs = [
    { label: 'IPHONE 14 PRO MAX CŨ', active: true },
    { label: 'IPHONE 14 PRO MAX', active: false },
    { label: 'IPHONE 14 PRO', active: false },
    { label: 'IPHONE 14 SERIES CŨ', active: false },
    { label: 'IPHONE 14 SERIES', active: false },
    { label: 'IPHONE 14 PRO CŨ', active: false },
    { label: 'IPHONE 14 PLUS CŨ', active: false }
  ];

  selectTab(tab: any) {
    this.tabs.forEach(t => t.active = false);
    tab.active = true;
    // Lọc sản phẩm theo tab
  }

  sortType = '';
  sort(type: string) {
    this.sortType = type;
    this.query.page = 1;
    this.query.pageSize = 12;

    if (this.sortType === 'price-desc') {
      this.query.descending = true;
      this.query.sortBy = 'price';
      this.sortType = 'price-desc';
    }
    else if (this.sortType === 'price-asc') {
      this.query.descending = false;
      this.query.sortBy = 'price';
      this.sortType = 'price-asc';
    }
    else if (this.sortType === 'popular') {
      this.query.descending = true;
      this.query.sortBy = 'popular';
      this.sortType = 'popular';
    }
    this.products = [];
    this.loadProducts();
  }

  loadingService = inject(LoadingService);
  showMore() {
    // this.loadingService.show();
    this.query.page++;
    this.loadProducts();
  }

  hasActivePriceFilter(): boolean {
    return !!(this.query.minPrice || this.query.maxPrice);
  }

  applyPriceFilter() {
    this.query.page = 1;
    this.query.pageSize = 12;
    this.query.minPrice = this.priceFilter.minPrice.trim() || undefined;
    this.query.maxPrice = this.priceFilter.maxPrice.trim() || undefined;
    this.products = [];
    this.loadProducts();
  }

  clearPriceFilter() {
    this.priceFilter.minPrice = '';
    this.priceFilter.maxPrice = '';
    this.query.page = 1;
    this.query.pageSize = 12;
    this.query.minPrice = undefined;
    this.query.maxPrice = undefined;
    this.products = [];
    this.loadProducts();
  }

  parsePriceFilter(slug: string) {
    if (slug.includes('-den-')) {
      const result = slug.replace('gia-tu-', '').split('-den-');

      return {
        minPrice: result[0],
        maxPrice: result[1]
      };
    }

    if (slug.endsWith('-tro-len')) {
      return {
        minPrice: slug.replace('gia-tu-', '').replace('-tro-len', ''),
        maxPrice: ''
      };
    }

    if (slug.endsWith('-tro-xuong')) {
      return {
        minPrice: '',
        maxPrice: slug.replace('gia-tu-', '').replace('-tro-xuong', '')
      };
    }

    return null;
  }
}
