import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ElementRef, HostListener, Input, inject } from '@angular/core';
import { CategoryModel } from '../../../models/models/category/category.model';
import { BrandModel } from '../../../models/models/brand/brand.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { BrandService } from '../../../core/services/brand.service';
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { FullImageUrlPipe } from "../../../pipes/full-image-url.pipe";
import { UiStateService } from '../../../core/services/ui-state.service';

@Component({
  selector: 'app-category-panel',
  standalone: true,
  imports: [CommonModule, FullImageUrlPipe],
  templateUrl: './category-panel.component.html',
  styleUrl: './category-panel.component.scss'
})
export class CategoryPanelComponent {
  hoveredCategoryId: string | null = null;
  hoveredCategory: CategoryModel | undefined;
  categories: CategoryModel[] = [];
  brands: BrandModel[] = [];
  isMobile: boolean = false;

  get selectedCategory(): CategoryModel | undefined {
    return this.categories.find(c => c.categoryId === (this.hoveredCategoryId ?? ''));
  }

  @Input() istoggleCategory = false;

  @Output()
  toggleCategories = new EventEmitter<void>();

  uiState = inject(UiStateService);
  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.loadData();
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

  loadData(): void {
    this.categoryService.getAllItems().subscribe((res) => {
      if (res.retCode == ERetCode.Successfull) {
        if (res.data) {
          this.categories = res.data;
        } else {
          this.categories = [];
        }
      } else {

      }
    })

    this.brandService.getAllItems().subscribe((res) => {
      if (res.retCode == ERetCode.Successfull) {
        if (res.data) {
          this.brands = res.data;
        } else {
          this.brands = [];
        }
      } else {

      }
    })
  }

  viewCategory(category: CategoryModel): void {
    //this.hoveredCategoryId = category.categoryId;
  }

  onCategoryHover(category: CategoryModel): void {
    if (!this.isMobile) {
      this.hoveredCategoryId = category.categoryId;
      this.hoveredCategory = category;
    }
  }

  onCategoryClick(category: CategoryModel): void {
    if (this.isMobile) {
      this.hoveredCategoryId = this.hoveredCategoryId === category.categoryId ? null : category.categoryId;
    }
  }

  onCategoryLeave(): void {
    this.hoveredCategoryId = null;
    this.hoveredCategory = undefined;
  }

  viewProducts(categorySlug: string, brandSlug?: string): void {
    this.toggleCategories.emit();
    if (brandSlug) {
      this.router.navigate(['/san-pham', categorySlug, brandSlug]);
    } else {
      this.router.navigate(['/danh-muc', categorySlug]);
    }
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
