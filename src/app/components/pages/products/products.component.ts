import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FullImageUrlPipe } from '../../../pipes/full-image-url.pipe';
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { ThousandSeparatorPipe } from '../../../pipes/thousandSeparator.pipe';
import { ProductListItemModel } from '../../../models/models/product/product-list-item.model';
import { CategoryModel } from '../../../models/models/category/category.model';
import { BrandModel } from '../../../models/models/brand/brand.model';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../core/services/brand.service';
import { BreadcrumbComponent, BreadcrumbItem } from "../../common/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FullImageUrlPipe,
    ThousandSeparatorPipe,
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
  isLoading = false;
  breadCrumbItems!: Array<{}>;
  term: any;
  editData: any;

  uploadedFiles: any[] = [];

  masterSelected!: boolean;
  allProducts: ProductListItemModel[] = [];
  products: any;
  selectedProductId: string = '';
  publicId?: string;
  deleteId: any;
  categories: CategoryModel[] = [];
  brands: BrandModel[] = [];
  selectedBrand!: BrandModel;

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Quản lý', active: true },
      { label: 'Sản phẩm', active: true }
    ];


    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.route.paramMap.subscribe(params => {
      const keyword = params.get('keyword');

      if (keyword) {
        this.title = keyword;
        this.productService.searchProducts(keyword).subscribe((res) => {
          if (res.retCode == 0) {
            if (res.data) {
              this.allProducts = res.data;
              this.products = res.data;
              //this.products = this.allProducts.slice(0, 10);
              this.isLoading = false;
            } else {
              this.products = [];
              this.allProducts = [];
            }
          } else {
            this.isLoading = false;
          }
        })
      }
      else {
          const categorySlug = params.get('categorySlug');
          const brandSlug = params.get('brandSlug');

          if (categorySlug == null || brandSlug == null || categorySlug === undefined || brandSlug === undefined) {
            this.products = [];
            this.allProducts = [];
            return;
          }

          if (categorySlug && brandSlug) {
            this.title = `Sản phẩm ${categorySlug} - ${brandSlug}`;
          }

          this.productService.GetProductsByCategoryAndBrand(categorySlug, brandSlug).subscribe((res) => {
            if (res.retCode == 0) {
              if (res.data) {
                this.allProducts = res.data;
                this.products = res.data;
              } else {
                this.products = [];
                this.allProducts = [];
              }
            } else {
              this.products = [];
              this.allProducts = [];
            }
          });
      }
    });

  }

  // search
  search() {
    if (this.term) {
      this.products = this.allProducts.filter((el: any) => el.name.toLowerCase().includes(this.term.toLowerCase()))
    } else {
      this.products = this.allProducts.slice(0, 15)
    }
    // noResultElement
    this.updateNoResultDisplay();
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

  totalProducts = 95;
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

  viewProductDetails(productId: string) {
    // Chuyển trang chi tiết sản phẩm
  }

  addToCart(product: any) {
    // Thêm vào giỏ hàng
  }
}
