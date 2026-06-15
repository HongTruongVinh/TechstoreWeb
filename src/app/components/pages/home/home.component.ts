import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../common/product-card/product-card.component';
import { Category } from '../../../models/models/category/category.model';
import { ProductListItemModel } from '../../../models/models/product/product-list-item.model';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/api/product.service';
import { ERetCode } from '../../../models/enum/etype_project.enum';
import { BrandModel } from '../../../models/models/brand/brand.model';
import { CategoryPanelComponent } from "../../common/category-panel/category-panel.component";
import { DeviceService } from '../../../core/services/ui/device.service';
import { HomeService } from '../../../core/services/api/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    CategoryPanelComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  device = inject(DeviceService);
  searchQuery: string = '';
  currentSlide: number = 0;
  autoSlideInterval: any;
  
  featureProducts: ProductListItemModel[] = [];

  brandName1 = "Iphone";
  brandProducts1: ProductListItemModel[] = [];
  brandName2 = "Samsung";
  brandProducts2: ProductListItemModel[] = [];

  heroAdvertisementImageLink = "https://res.cloudinary.com/dc8ijvcze/image/upload/v1777281828/TechShop/images/advertisement/hero-advertisement/April30th.jpg";
  // Carousel slides data
  carouselSlides = [
    {
      id: 1,
      title: 'iPhone 16 Series',
      description: 'Công nghệ tiên tiến nhất từ Apple',
      icon: 'bi-phone',
      imageUrl: 'https://res.cloudinary.com/dc8ijvcze/image/upload/v1777282884/TechShop/images/advertisement/hero-carousel/samsung-s26-ultra.webp'
    },
    {
      id: 2,
      title: 'MacBook Pro M4',
      description: 'Hiệu năng vượt trội cho công việc chuyên nghiệp',
      icon: 'bi-laptop',
      imageUrl: 'https://res.cloudinary.com/dc8ijvcze/image/upload/v1777282884/TechShop/images/advertisement/hero-carousel/oppo-ultra.webp'
    },
    {
      id: 3,
      title: 'iPad Pro M4',
      description: 'Máy tính bảng mạnh mẽ nhất thế giới',
      icon: 'bi-tablet',
      imageUrl: 'https://res.cloudinary.com/dc8ijvcze/image/upload/v1777282884/TechShop/images/advertisement/hero-carousel/macbook.webp'
    },
    {
      id: 4,
      title: 'AirPods Pro 3',
      description: 'Âm thanh không dây chất lượng cao',
      icon: 'bi-headphones',
      imageUrl: 'https://res.cloudinary.com/dc8ijvcze/image/upload/v1777282884/TechShop/images/advertisement/hero-carousel/tai-nghe-logitech-dealhot.webp'
    },
    {
      id: 5,
      title: 'Apple Watch Ultra 2',
      description: 'Đồng hồ thông minh cho vận động viên',
      icon: 'bi-smartwatch',
      imageUrl: 'https://res.cloudinary.com/dc8ijvcze/image/upload/v1777282884/TechShop/images/advertisement/hero-carousel/iPhone-17-Pro-Max.webp'
    }
  ];

  // Promotions data
  promotions = [
    {
      id: 1,
      title: 'Sale iPhone',
      description: 'Giảm giá lên đến 2 triệu',
      discount: '-20%',
      icon: 'bi-phone'
    },
    {
      id: 2,
      title: 'Laptop Gaming',
      description: 'Trả góp 0% lãi suất',
      discount: '-15%',
      icon: 'bi-laptop'
    },
    {
      id: 3,
      title: 'Phụ kiện',
      description: 'Mua 2 tặng 1',
      discount: '-30%',
      icon: 'bi-headphones'
    }
  ];

  constructor(
    private router: Router,
    private readonly homeService: HomeService,
    private readonly productService: ProductService
  ) { }


  ngOnInit(): void {
    document.body.classList.add('home-background');
    this.startAutoSlide();
    
    this.loadData();
  }

  loadData(): void {

    this.homeService.getFeaturedProducts().subscribe((res) => {
      if (res.retCode == ERetCode.Successfull) {
        if (res.data) {
          this.featureProducts = res.data;
        }
      }
    })

    this.productService.searchProducts(this.brandName1, 1, 16).subscribe((res) => {
      if (res.retCode == ERetCode.Successfull) {
        if (res.data) {
          this.brandProducts1 = res.data;
        }
      }
    })

    this.productService.searchProducts(this.brandName2, 1, 16).subscribe((res) => {
      if (res.retCode == ERetCode.Successfull) {
        if (res.data) {
          this.brandProducts2 = res.data;
        }
      }
    })
  }

  ngOnDestroy(): void {
    document.body.classList.remove('home-background');
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  onSearch(query: string): void {
    this.router.navigate(['/san-pham', query.trim()]);
  }

  viewPromotion(promotion: any): void {
    console.log('Viewing promotion:', promotion);
  }

  getStarsArray(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(1); // Full star
    }

    if (hasHalfStar) {
      stars.push(0.5); // Half star
    }

    while (stars.length < 5) {
      stars.push(0); // Empty star
    }

    return stars;
  }

  // Carousel methods
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Auto slide every 4 seconds
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0
      ? this.carouselSlides.length - 1
      : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    // Reset auto slide timer when user manually navigates
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.startAutoSlide();
    }
  }
}
