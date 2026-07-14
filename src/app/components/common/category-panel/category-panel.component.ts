import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ElementRef, HostListener, Input, inject } from '@angular/core';
import { Category } from '../../../models/models/category/category.model';
import { BrandModel } from '../../../models/models/brand/brand.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/api/category.service';
import { BrandService } from '../../../core/services/api/brand.service';
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { FullImageUrlPipe } from "../../../pipes/full-image-url.pipe";
import { UiStateService } from '../../../core/services/ui/ui-state.service';
import { PriceFilter } from '../../../models/models/product/price-fillter.model';
import { SessionStorageService } from '../../../core/services/ui/session-storage.service';

@Component({
  selector: 'app-category-panel',
  standalone: true,
  imports: [CommonModule, FullImageUrlPipe],
  templateUrl: './category-panel.component.html',
  styleUrl: './category-panel.component.scss'
})
export class CategoryPanelComponent {
  hoveredCategoryId: string | null = null;
  hoveredCategory: Category | undefined;
  categories!: Category[];
  brands!: BrandModel[];
  priceFilters!: PriceFilter[];
  isMobile: boolean = false;

  get selectedCategory(): Category | undefined {
    return this.categories.find(c => c.id === (this.hoveredCategoryId ?? ''));
  }
  
  @Input() istoggleCategory = false;

  @Output()
  toggleCategories = new EventEmitter<void>();

  uiState = inject(UiStateService);
  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
  ) { }

  ngOnInit(): void {
    // this.loadData();

    this.brands = this.brandService.getBrands();
    this.categories = this.categoryService.getCategories();
    this.priceFilters = this.categoryService.getPriceFilters();
    this.updateIsMobile();
    if (this.isMobile) {
      this.uiState.hideWidgetPanel();
      this.uiState.hideNavbar();
    }
  }

  ngOnDestroy(): void {
    if (this.isMobile) {
      this.uiState.showWidgetPanel();
      this.uiState.showNavbar();
    }
  }

  updateIsMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateIsMobile();
  }

  viewCategory(category: Category): void {
    //this.hoveredCategoryId = category.categoryId;
  }

  onCategoryHover(category: Category): void {
    if (!this.isMobile) {
      this.hoveredCategoryId = category.id;
      this.hoveredCategory = category;
    }
  }

  onCategoryClick(category: Category): void {
    if (this.isMobile) {
      this.hoveredCategoryId = this.hoveredCategoryId === category.id ? null : category.id;
    }
  }

  onCategoryLeave(): void {
    this.hoveredCategoryId = null;
    this.hoveredCategory = undefined;
  }

  searchProducts(categorySlug: string, brandSlug?: string, minPrice?: number, maxPrice?: number): void {
    this.toggleCategories.emit();

    if (brandSlug) {
      this.router.navigate(['/san-pham', categorySlug, brandSlug]);
    } else {
      if(minPrice !== undefined && maxPrice !== undefined){
        // this.router.navigate(['/san-pham', categorySlug, 'tat-ca', `${minPrice}-${maxPrice}`]);
        this.router.navigate(['/san-pham', categorySlug, 'tat-ca', 'gia-tu-' + `${minPrice}-den-${maxPrice}`]);
      }
      else if(minPrice !== undefined && maxPrice == undefined){
        this.router.navigate(['/san-pham', categorySlug, 'tat-ca', 'gia-tu-' + `${minPrice}-tro-len`]);
      }
      else if(minPrice == undefined && maxPrice !== undefined){
        this.router.navigate(['/san-pham', categorySlug, 'tat-ca', 'gia-tu-' + `${maxPrice}-tro-xuong`]);
      }
      else{
        this.router.navigate(['/danh-muc', categorySlug]);
      }
      // this.router.navigate(['/danh-muc', categorySlug]);
    }

    // if (minPrice !== undefined && maxPrice !== undefined) {
    //   if (brandSlug) {
    //     this.router.navigate(['/san-pham', categorySlug, brandSlug, `${minPrice}-${maxPrice}`]);
    //   }
    //   else {
    //     this.router.navigate(['/san-pham', categorySlug, 'tat-ca', `${minPrice}-${maxPrice}`]);
    //     //this.router.navigate(['/san-pham', categorySlug, 'tat-ca', 'gia-tu-' + `${minPrice}-den-${maxPrice}`]);
    //   }
    // } else {
    //   this.router.navigate(['/san-pham', categorySlug]);
    // }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    const clickedInside =
      this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  closeDropdown() {
    if (!this.istoggleCategory) {
      this.toggleCategories.emit();
    }
    this.istoggleCategory = false;
  }
}
