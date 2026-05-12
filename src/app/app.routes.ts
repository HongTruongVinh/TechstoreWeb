import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ProductsComponent } from './components/pages/products/products.component';
import { ProductDetailsComponent } from './components/pages/product-details/product-details.component';
import { UserComponent  } from './components/pages/user/user.component';
import { ProfileComponent } from './components/pages/user/profile/profile.component';
import { CartComponent } from './components/pages/user/cart/cart.component';
import { CreateOrderComponent } from './components/pages/orders/create-order/create-order.component';
import { PurchesComponent } from './components/pages/user/purches/purches.component';
import { AuthGuard } from './core/guards/auth.guard';
import { OrderDetailComponent } from './components/pages/orders/order-detail/order-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'danh-muc/:categorySlug', component: ProductsComponent },
    { path: 'tim-kiem/:keyword', component: ProductsComponent },
    { path: 'san-pham/:categorySlug/:brandSlug', component: ProductsComponent },
    { path: ':slugWithId', component: ProductDetailsComponent },
    {
                path: 'user',
                component: UserComponent,
                canActivate: [AuthGuard],
                children: [
                    { path: 'profile', component: ProfileComponent },
                    { path: 'purchase', component: PurchesComponent },
                    { path: 'create-order', component: CreateOrderComponent },
                    { path: 'cart', component: CartComponent },
                ],
                
    },
    { path: 'order-details/:id', component: OrderDetailComponent },
];
