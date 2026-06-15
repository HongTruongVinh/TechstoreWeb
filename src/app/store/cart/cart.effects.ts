import { Injectable, inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, switchMap } from 'rxjs/operators';

import * as CartItemActions from './cart.actions';

import { CartService } from '../../core/services/api/cart.service';

@Injectable()
export class CartItemEffects {

  private actions$ = inject(Actions);
  private cartService = inject(CartService);

  loadCartItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartItemActions.loadCartItem),

      switchMap(() =>
        this.cartService.getAllItems(1, 1000).pipe(
          map(apiResponse =>
            CartItemActions.loadCartItemSuccess({ cartitems: apiResponse.data || [] })
          )
        )
      )
    )
  );

  addCartItem$ = createEffect(() =>
    this.actions$.pipe(

      ofType(CartItemActions.addCartItem),

      switchMap(action =>

        this.cartService.addCartItem(action.cartItem).pipe(

          map(apiResponse => {

            if (!apiResponse.data) {

              return CartItemActions.addCartItemFailure({
                error: apiResponse.systemMessage ?? 'Add failed'
              });
            }

            return CartItemActions.addCartItemSuccess({
              cartItem: apiResponse.data
            });
          })
        )
      )
    )
  );

  removeCartItems$ = createEffect(() =>
    this.actions$.pipe(

      ofType(CartItemActions.removeCartItems),

      switchMap(action =>

        this.cartService.removeItems(action.cartItemIds).pipe(

          map(apiResponse => {

            if (!apiResponse.data) {

              return CartItemActions.removeCartItemsFailure({
                error: apiResponse.systemMessage ?? 'Remove failed'
              });
            }

            return CartItemActions.removeCartItemsSuccess({
              cartItemIds: action.cartItemIds
            });
          })
        )
      )
    )
  );
}