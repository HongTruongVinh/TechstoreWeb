import { CommonModule, Location } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SlickCarouselModule, SlickCarouselComponent } from 'ngx-slick-carousel';
import { FullImageUrlPipe } from '../../../pipes/full-image-url.pipe';
import { ThousandSeparatorPipe } from '../../../pipes/thousandSeparator.pipe';
import { ProductDetailsModel, ProductVariantModel, ProductVariantOptionModel } from '../../../models/models/product/product-details';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../../core/services/api/product.service';
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { CartItemCreateModel } from '../../../models/models/cart/cart-item-create.model';
import { TokenStorageService } from '../../../core/services/ui/token-storage.service';
import { BreadcrumbComponent, BreadcrumbItem } from "../../common/breadcrumb/breadcrumb.component";
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { ProductCardComponent } from "../../common/product-card/product-card.component";
import { ProductListItemModel } from '../../../models/models/product/product-list-item.model';
import { AuthDialogService } from '../../../core/services/ui/AuthDialogService';
import { Store } from '@ngrx/store';
import * as CartSelectors from '../../../store/cart/cart.selectors';
import * as CartActions from '../../../store/cart/cart.actions';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ProductSearchQuery } from '../../../models/models/product/product-search-query.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    SlickCarouselModule,
    ModalModule,
    FullImageUrlPipe,
    ThousandSeparatorPipe,
    BreadcrumbComponent,
    ProductCardComponent,
    LottieComponent
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Trang chủ', url: '/' },
    { label: 'Sản phẩm', url: '/products' },
    { label: 'Chi tiết sản phẩm' }
  ];

  isHover: boolean = false;

  userId?: string;
  product?: ProductDetailsModel;
  selectedVariant?: ProductVariantModel;
  selectedOption$ = new BehaviorSubject<ProductVariantOptionModel | null>(null);
  relatedProducts: ProductListItemModel[] = [];

  addToCartOptions: AnimationOptions = {
    path: '/assets/animations/add_to_cart_success.json',
    loop: false,
  };
  isShowAddToCardAnimation = false;


  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;

  authDialog = inject(AuthDialogService);
  tks = inject(TokenStorageService);
  private store = inject(Store);

  isItemInCart$ = combineLatest([
    this.selectedOption$,
    this.store.select(CartSelectors.selectCartItemEntities)
  ]).pipe(
    map(([option, entities]) =>
      !!entities[
      this.userId && option?.id
        ? `${this.userId}-${option.id}`
        : ''
      ]
    )
  );

  constructor(
    private location: Location,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly productService: ProductService,
    private readonly tss: TokenStorageService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slugWithId = params.get('slugWithId');

      const id = this.extractId(slugWithId!);

      this.loadProductDetails(id);
    });

    this.userId = this.tss.getUser()?.id;
  }

  slideConfig = {
    // Configuration options for the ngx-slick-carousel
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    adaptiveHeight: true,
  };

  slidesConfig = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
  }


  loadProductDetails(id: string) {
    this.productService.getProductDetails(id).subscribe((res) => {
      if (res.retCode === ERetCode.Successfull && res.data) {
        this.product = res.data;

        this.loadRelatedProducts();

        const product = this.product;
        if (product) {
          product.variants[0].options.forEach(option => {
            product.galleryImageUrls.push(option.imageUrl);
          });

          this.selectVariant(product.variants[0].id);
          this.titleService.setTitle(product.name);

          this.isItemInCart$.subscribe(data => {
            // console.log("isItemInCart: " + data);
          })
          this.selectedOption$.subscribe(data => {
            // console.log("slected: " + data?.id);
          })
        }

        if (this.product.galleryImageUrls.length === 0) {
          this.product.galleryImageUrls = [this.product.mainImageUrl];
        }
      } else {
        // Handle error or product not found
      }
    });
  }

  selectVariant(variantId: string) {
    const product = this.product;
    if (product) {
      const selectedVariant = product.variants?.find(variant => variant.id === variantId);
      if (selectedVariant) {
        this.selectedVariant = selectedVariant;
        this.selectOption(this.selectedVariant.options[0].id);
      }
    }
  }

  selectOption(optionId: string) {
    const selectedVariant = this.selectedVariant;
    if (selectedVariant) {
      const selectedOption = selectedVariant.options.find(op => op.id === optionId);
      if (selectedOption) {
        this.selectedOption$.next(selectedOption);
      }
    }
  }

  handleCartAction() {
    if (!this.tks.isLoggedIn()) {
      this.onLogin();
      return;
    }

    const selectedOption = this.selectedOption$.value;
    if (!selectedOption) {
      return;
    }

    this.isShowAddToCardAnimation = true;

    setTimeout(() => {
      this.isShowAddToCardAnimation = false;
    }, 3000);

    this.isItemInCart$.subscribe(data => {
      if (data === true) return;
    })

    const newCartItem: CartItemCreateModel = {
      productVariantOptionId: selectedOption.id,
      quantity: 1
    };

    this.store.dispatch(CartActions.addCartItem({ cartItem: newCartItem }));
  }

  extractId(slug: string): string {
    return slug.split('i.')[1];
  }

  slickChange(event: any) {
    const swiper = document.querySelectorAll('.swiperlist')
  }

  slidePreview(id: any, event: any) {
    const swiper = document.querySelectorAll('.swiperlist')
    swiper.forEach((el: any) => {
      el.classList.remove('swiper-slide-thumb-active')
    })
    event.target.closest('.swiperlist').classList.add('swiper-slide-thumb-active')
    this.slickModal.slickGoTo(id)
  }

  showImageModal = false;
  currentImage = '';

  openImageModal(img: string) {
    this.currentImage = img;
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
  }

  goBack(): void {
    this.location.back();
  }

  onLogin() {
    const ref = this.authDialog.openLogin();
    ref.closed.subscribe(result => {

    });
  }

  loadRelatedProducts() {
    if (this.product == undefined) return;

    const productName = this.product.name.substring(0, 3);

    if (!productName) return;

    const query: ProductSearchQuery = {
      page: 1,
      pageSize: 8,
      keyword: productName
    }

    this.productService.getProducts(query).subscribe((res) => {
      if (res.retCode == ERetCode.Successfull) {
        if (res.data) {
          this.relatedProducts = res.data.items;
        }
      }
    })
  }

}
