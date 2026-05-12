import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { ProductListItemModel } from '../../../models/models/product/product-list-item.model';
import { CategoryModel } from '../../../models/models/category/category.model';
import { BrandModel } from '../../../models/models/brand/brand.model';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../core/services/brand.service';
import { BreadcrumbComponent, BreadcrumbItem } from "../../common/breadcrumb/breadcrumb.component";
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { LoadingService } from '../../../core/services/loading/loading.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
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
  title: string = 'Danh sách sản phẩm';
  breadCrumbItems!: Array<{}>;
  term: any;

  totalProducts = 0;
  products: ProductListItemModel[] = [];
  page = 1;
  pageSize = 12;
  hasMore = false;

  publicId?: string;
  deleteId: any;
  categories: CategoryModel[] = [];
  brands: BrandModel[] = [];
  selectedBrand!: BrandModel;

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Quản lý', active: true },
      { label: 'Sản phẩm', active: true }
    ];


    this.loadProducts();
  }

  loadProducts() {

    this.route.paramMap.subscribe(params => {
      const keyword = params.get('keyword');
      const categorySlug = params.get('categorySlug');
      const brandSlug = params.get('brandSlug');

      if (keyword) {
        this.title = keyword;
        this.productService.searchProducts(keyword, this.page, this.pageSize).subscribe((res) => {
          if (res.retCode == ERetCode.Successfull) {
            if (res.data) {
              this.processData(res.data)
            }
          }
        })
      }
      else if (categorySlug) {

        if (brandSlug === undefined || brandSlug === null) {
          this.title = `Sản phẩm ${categorySlug}`;
          this.productService.GetProductsByCategory(categorySlug, this.page, this.pageSize).subscribe((res) => {
            if (res.retCode == ERetCode.Successfull) {
              if (res.data) {
                this.processData(res.data)
              }
            }
          });
        }
        else {
          this.title = `Sản phẩm ${categorySlug} - ${brandSlug}`;
          this.productService.GetProductsByCategoryAndBrand(categorySlug, brandSlug, this.page, this.pageSize).subscribe((res) => {
            if (res.retCode == ERetCode.Successfull) {
              if (res.data) {
                this.processData(res.data)
              }
            }
          });
        }
      }
      else {
        this.products = [];
      }
    });
  }

  processData(data: ProductListItemModel[]) {
    const newProducts = data || [];

    this.products = [...this.products, ...newProducts];

    if (newProducts.length < this.pageSize) {
      this.hasMore = false;
    }
    else {
      this.hasMore = true;
    }
  }


  selectedBrands: string[] = [];   // vì bindValue="id"
  selectedCategory: string | null = null;



  // no result 
  updateNoResultDisplay() {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement
    if (this.term && this.products.length === 0) {
      noResultElement.style.display = 'block';
      paginationElement.classList.add('d-none')
    } else {
      noResultElement.style.display = 'none';
      paginationElement.classList.remove('d-none')
    }
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
  sortType = 'price-desc';

  selectTab(tab: any) {
    this.tabs.forEach(t => t.active = false);
    tab.active = true;
    // Lọc sản phẩm theo tab
  }

  sort(type: string) {
    this.sortType = type;
    // Sắp xếp sản phẩm
  }

  loadingService = inject(LoadingService);
  showMore() {
    // this.loadingService.show();
    this.page++;
    this.loadProducts();
  }
}
