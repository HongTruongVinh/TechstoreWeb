import { CommonModule, Location } from '@angular/common';
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SlickCarouselModule, SlickCarouselComponent } from 'ngx-slick-carousel';
import { FullImageUrlPipe } from '../../../pipes/full-image-url.pipe';
import { ThousandSeparatorPipe } from '../../../pipes/thousandSeparator.pipe';
import { ProductDetailsModel, ProductVariantModel, ProductVariantOptionModel } from '../../../models/models/product/product-details';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../../core/services/api/product.service';
import { EErrorType } from '../../../models/enum/etype_project.enum';
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
import { ConvertPhotoUrl } from '../../../library/share-function/convert-image-url';
import { MessengerServices } from '../../../core/services/ui/messenger.service';

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
  @ViewChild('showedImg') showedImg!: ElementRef<HTMLImageElement>;;

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
    private readonly messengerService: MessengerServices,
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
    autoplay: false,
    adaptiveHeight: false,
  };

  slidesConfig = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    focusOnSelect: true,
  }


  loadProductDetails(id: string) {
    this.productService.getProductDetails(id).subscribe((res) => {
      if (res.data) {
        this.product = res.data;

        this.loadRelatedProducts();

        const product = this.product;
        if (product) {
          product.variants.flatMap(variant => variant.options).forEach(option => {
            if (option.imageUrl && !product.galleryImageUrls.includes(option.imageUrl)) {
              product.galleryImageUrls.push(option.imageUrl);
            }
          });

          const initialVariant = product.variants.find(variant => this.isVariantAvailable(variant))
            ?? product.variants[0];
          this.selectVariant(initialVariant.id);
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

        // if(this.slickModal) {
        //   this.slickModal.slickGoTo(0);
        // }
      } else {
        this.messengerService.errorNotification(res.message ?? '');
      }
    });
  }

  selectVariant(variantId: string) {
    const product = this.product;
    if (product) {
      const selectedVariant = product.variants?.find(variant => variant.id === variantId);
      if (selectedVariant) {
        this.selectedVariant = selectedVariant;
        const initialOption = selectedVariant.options.find(option => this.isOptionAvailable(option))
          ?? selectedVariant.options[0];
        this.selectedOption$.next(initialOption ?? null);
        if (initialOption) {
          this.showOptionImage(initialOption);
        }
      }
    }
  }

  selectOption(optionId: string) {
    const selectedVariant = this.selectedVariant;
    if (selectedVariant) {
      const selectedOption = selectedVariant.options.find(op => op.id === optionId);
      if (selectedOption && this.isOptionAvailable(selectedOption)) {

        // if(this.showedImg) {
        //   this.showedImg.nativeElement.src = ConvertPhotoUrl.convertPublicIdToUrl(selectedOption.imageUrl);
        // }

        this.selectedOption$.next(selectedOption);
        this.showOptionImage(selectedOption);
      }
    }
  }

  isOptionAvailable(
    option: ProductVariantOptionModel | null | undefined
  ): option is ProductVariantOptionModel {
    return !!option && option.stock > 0;
  }

  isVariantAvailable(variant: ProductVariantModel): boolean {
    return variant.options.some(option => this.isOptionAvailable(option));
  }

  getBasePrice(
    variant: ProductVariantModel,
    option?: ProductVariantOptionModel | null
  ): number {
    return option?.price ?? variant.price;
  }

  getFinalPrice(
    variant: ProductVariantModel,
    option?: ProductVariantOptionModel | null
  ): number {
    return Math.max(0, this.getBasePrice(variant, option) - (variant.salePrice || 0));
  }

  getVariantFinalPrice(variant: ProductVariantModel): number {
    const availableOptions = variant.options.filter(option => this.isOptionAvailable(option));
    const options = availableOptions.length > 0 ? availableOptions : variant.options;

    if (options.length === 0) {
      return this.getFinalPrice(variant);
    }

    return Math.min(...options.map(option => this.getFinalPrice(variant, option)));
  }

  private showOptionImage(option: ProductVariantOptionModel): void {
    const imageIndex = this.product?.galleryImageUrls.indexOf(option.imageUrl) ?? -1;
    if (imageIndex < 0) return;

    this.selectedImageIndex = imageIndex;
    setTimeout(() => this.slickModal?.slickGoTo(imageIndex));
  }

  handleCartAction() {
    if (!this.tks.isLoggedIn()) {
      this.onLogin();
      return;
    }

    const selectedOption = this.selectedOption$.value;
    if (!this.isOptionAvailable(selectedOption)) {
      this.messengerService.errorNotification('Sản phẩm này hiện đã hết hàng.');
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
    this.selectedImageIndex = event.currentSlide ?? 0;
  }

  slidePreview(index: number) {
    this.selectedImageIndex = index;
    this.slickModal.slickGoTo(index);
  }

  showImageModal = false;
  currentImage = '';
  selectedImageIndex = 0;

  openImageModal(img: string, index: number) {
    this.currentImage = img;
    this.selectedImageIndex = index;
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
  }

  @HostListener('document:keydown.escape')
  closeImageModalOnEscape() {
    if (this.showImageModal) {
      this.closeImageModal();
    }
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
      if (res.data) {
          this.relatedProducts = res.data.items;
      }
    })
  }

}
