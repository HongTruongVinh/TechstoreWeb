import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../core/services/ui/token-storage.service';
import { DeviceService } from '../../../core/services/ui/device.service';
import { LoginDialogResult } from '../../../models/models/authentication/login-result.model';
import { AuthDialogService } from '../../../core/services/ui/AuthDialogService';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { PagedResult } from '../../../models/models/api-response.model';
import { ProductListItemModel } from '../../../models/models/product/product-list-item.model';
import { ProductSearchQuery } from '../../../models/models/product/product-search-query.model';
import { ProductService } from '../../../core/services/api/product.service';
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { FullImageUrlPipe } from "../../../pipes/full-image-url.pipe";
import { Store } from '@ngrx/store';
import { selectCartItemCount } from '../../../store/cart/cart.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FullImageUrlPipe
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output()
  login = new EventEmitter<void>();

  device = inject(DeviceService);

  searchForm!: FormGroup;
  pagedResult?: PagedResult<ProductListItemModel>;
  query: ProductSearchQuery = {
    page: 1,
    pageSize: 7,
    keyword: ''
  }

  totalQuantity$: Observable<number>;

  isScrolled: boolean = false;

  isLoading = false;

  @Output()
  toggleCategories = new EventEmitter<void>();

  fisrtName: string = '';

  authDialog = inject(AuthDialogService);
  tks = inject(TokenStorageService);
  constructor(
    private readonly router: Router,
    private fb: UntypedFormBuilder,
    private readonly productService: ProductService,
    private store: Store
  ) { 
    this.totalQuantity$ = this.store.select(selectCartItemCount);
    
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      keyword: [''],
      categoryId: ['']
    });

    this.searchForm.valueChanges.pipe(debounceTime(700), distinctUntilChanged(),).subscribe(value => {
      this.query.keyword = value.keyword.trim();

      this.productService.getProducts(this.query).subscribe((res) => {
        if (res.retCode == ERetCode.Successfull) {
          if (res.data) {
            this.pagedResult = res.data;
          }
        }
      })
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  onSearch(): void {
    this.query.keyword = this.searchForm.value.keyword;
    if (this.query.keyword) {
      if (this.query.keyword.trim()) {
        this.router.navigate(['/tim-kiem', this.query.keyword.trim()]);
      }
    }
  }

  viewProductDetails(slugWithId: string) {
    this.router.navigate(['', slugWithId]);
  }

  buildProductUrl(product: ProductListItemModel): string {
    return `${product.slug}-i.${product.id}`;
  }

  isSearching = false;

  onBlur() {
    setTimeout(() => {
        this.isSearching = false;
    }, 150);
  }

  openCategories() {
    this.toggleCategories.emit();
  }

  phoneNumber = '0393574180';
  contact(): void {
    window.open(`https://zalo.me/${this.phoneNumber}`, '_blank');
  }

  onLogin() {

    const ref = this.authDialog.openLogin();

    ref.closed.subscribe(result => {
      const data = result as LoginDialogResult | undefined;

      if (data?.success) {
        this.tks.isLoggedIn.set(true);
        if (this.tks.getUser() != null) {
          this.fisrtName = this.tks.getUser()!.firstName;
        }
      }
    });
  }

  openCart() {
    this.router.navigate(['/user/cart']);
  }

}
