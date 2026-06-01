import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

import { loadingInterceptor } from './core/services/loading/loading.interceptor';

// import store
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { categoryReducer } from './store/categories/category.reducer';
import { CategoryEffects } from './store/categories/category.effects';
import { cartItemReducer } from './store/cart/cart.reducer';
import { CartItemEffects } from './store/cart/cart.effects';

const store = {
  categories: categoryReducer,
  cartItems: cartItemReducer
}
const effects = [
  CategoryEffects,
  CartItemEffects
]
//end import store 


export const appConfig: ApplicationConfig = {
  providers: [

    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),

    provideHttpClient(
      // withInterceptors([
      //   loadingInterceptor
      // ])
    ),

    provideStore(store),

    provideEffects(effects),

    provideAnimations(),

    provideLottieOptions({
      player: () => player
    })
  ]
};
