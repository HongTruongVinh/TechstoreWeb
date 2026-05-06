import { CommonModule, Location } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SlickCarouselModule, SlickCarouselComponent } from 'ngx-slick-carousel';
import { FullImageUrlPipe } from '../../../pipes/full-image-url.pipe';
import { ThousandSeparatorPipe } from '../../../pipes/thousandSeparator.pipe';
import { ProductDetailsModel, ProductVariantModel, ProductVariantOptionModel } from '../../../models/models/product/product-details';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { CartItemCreateModel } from '../../../models/models/cart/cart-item-create.model';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { SessionStorageService } from '../../../core/services/session-storage.service';
import { CartItem } from '../../../models/models/cart/cart-item.model';
import { BreadcrumbComponent, BreadcrumbItem } from "../../common/breadcrumb/breadcrumb.component";
import { trigger, transition, style, animate } from '@angular/animations';
import { ProductCardComponent } from "../../common/product-card/product-card.component";
import { ProductListItemModel } from '../../../models/models/product/product-list-item.model';
import { AuthenticationService } from '../../../core/services/auth.service';

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
    ProductCardComponent
],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  animations: [
    trigger('flyToCart', [
      transition(':enter', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('800ms ease-in', style({
          transform: 'translate(300px, -200px) scale(0.2)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class ProductDetailsComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Trang chủ', url: '/' },
    { label: 'Sản phẩm', url: '/products' },
    { label: 'Chi tiết sản phẩm' }
  ];

  isHover: boolean = false;
  isItemInCart = false;

  product!: ProductDetailsModel;
  selectedVariant!: ProductVariantModel;
  selectedOption!: ProductVariantOptionModel;
  sameProducts: ProductListItemModel[] = [];

  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;

  auth = inject(AuthenticationService);
  constructor(
    private location: Location,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly tokenStorageService: TokenStorageService,
    private readonly sessionStorageService: SessionStorageService
  ) { }

  ngOnInit(): void {

    //this.createAimAddToCart();

    this.product = {
      productId: '',
      name: 'sản phẩm',
      shortDescription: '',

      description: '',
      mainImageUrl: '',
      galleryImageUrls: [],

      soldCount: 0,
      warranty: 0,

      salePrice: 0,
      saleStart: new Date(),
      saleEnd: new Date(),

      catagoryId: '',
      categoryName: '',

      brandId: '',
      brandName: '',

      ratedCount: 0,
      averageRating: 0,

      slug: '',
      tags: [],

      isOnSale: false,
      isFeatured: false,

      variants: []
    }

    this.selectedVariant = {
      id: '',
      name: '',
      description: '',
      price: 0,
      salePrice: 0,
      productId: '',
      soldCount: 0,
      options: []
    }

    // this.route.paramMap.subscribe(params => {
    //   const productSlug = params.get('productSlug')!;
    //   this.loadProductDetails(productSlug);
    // });

    this.route.paramMap.subscribe(params => {
      const slugWithId = params.get('slugWithId');

      const id = this.extractId(slugWithId!);

      this.loadProductDetails(id);
    });

    if(this.auth.isLoggedIn()) {
      this.sessionStorageService.getCartItems()?.forEach(item => {
        if (item.productVariantOptionId === this.selectedOption.id) {
          this.isItemInCart = true;
        }
      });
    }
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
    // Configuration options for the ngx-slick-carousel
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
  }



  loadProductDetails(id: string) {
    this.productService.getProductDetails(id).subscribe((res) => {
      if (res.retCode === ERetCode.Successfull && res.data) {
        this.product = res.data;

        if (this.product.galleryImageUrls?.length === 0) {
          this.product.galleryImageUrls = [this.product.mainImageUrl];
        }

        this.selectVariant(this.product.variants[0].id);
        this.titleService.setTitle(this.product.name);
      } else {
        // Handle error or product not found
      }
    });
  }

  extractId(slug: string): string {
    return slug.split('i.')[1];
  }

  selectVariant(variantId: string) {
    const selectedVariant = this.product.variants?.find(variant => variant.id === variantId);
    if (selectedVariant) {
      this.selectedVariant = selectedVariant;
      this.selectOption(this.selectedVariant.options[0].id);
    }
  }

  selectOption(optionId: string) {
    const selectedOption = this.selectedVariant.options.find(op => op.id === optionId);
    if (selectedOption) {
      this.selectedOption = selectedOption;
      if (this.sessionStorageService.isItemInCart(this.selectedOption.id)) {
        this.isItemInCart = true;
      }
      // this.slickModal.
    }
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

  addToCart() {
    const cartItem: CartItemCreateModel = {
      productVariantOptionId: this.selectedOption.id,
      quantity: 1
    };

    this.cartService.createItem(cartItem).subscribe((res) => {
      if (res.retCode === ERetCode.Successfull) {
        alert('Đã thêm vào giỏ hàng!');
        this.showAnim = true;
        setTimeout(() => this.showAnim = false, 800);
      } else {
        alert('Lỗi khi thêm vào giỏ hàng.');
      }
    }
    );
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

  showAnim = false;
  createAimAddToCart() {
    animations: [
      trigger('flyToCart', [
        transition(':enter', [
          style({ transform: 'scale(1)', opacity: 1 }),
          animate('800ms ease-in', style({
            transform: 'translate(300px, -200px) scale(0.2)',
            opacity: 0
          }))
        ])
      ])
    ]
  }


}
