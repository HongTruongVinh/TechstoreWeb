import { createReducer, on } from '@ngrx/store';
import * as CartItemActions from './cart.actions';

import {
  initialState,
  cartItemAdapter
} from './cart.state';

export const cartItemReducer = createReducer(
  initialState,

  on(CartItemActions.loadCartItem, (state) => ({
    ...state,
    loading: true
  })),

  on(CartItemActions.loadCartItemSuccess, (state, { cartitems }) =>
    cartItemAdapter.setAll(cartitems, {
      ...state,
      loading: false
    })
  ),

  on(CartItemActions.addCartItemSuccess, (state, { cartItem }) =>
    cartItemAdapter.addOne(cartItem, state)
  ),

  on(CartItemActions.removeCartItems, (state) => ({
    ...state,
    loading: true
  })),

  on(CartItemActions.removeCartItemsSuccess, (state, { cartItemIds }) =>
    cartItemAdapter.removeMany(cartItemIds, {
      ...state,
      loading: false
    })
  ),

  on(CartItemActions.removeCartItemsFailure, (state) => ({
    ...state,
    loading: false
  })),

  on(
    CartItemActions.updateCartItemQuantity,
    (state, { id, quantity }) => {

      const item = state.entities[id];

      if (!item) {
        return state;
      }

      const unitPrice =
        item.salePrice ?? (item.price - item.discount);

      return cartItemAdapter.updateOne(
        {
          id: id,
          changes: {
            quantity,
            totalPrice: unitPrice * quantity
          }
        },
        state
      );
    }
  ),

  on(CartItemActions.toggleSelectItem, (state, { cartItemId }) => {
    const exists = state.selectedItemIds.includes(cartItemId);

    return {
      ...state,
      selectedItemIds: exists
        ? state.selectedItemIds.filter(id => id !== cartItemId)
        : [...state.selectedItemIds, cartItemId]
    };
  }),

  on(CartItemActions.toggleSelectAllItems, (state, { checked }) => {
    const allItemIds = Object.keys(state.entities);

    return {
      ...state,
      selectedItemIds: checked ? allItemIds : []
    };
  }),
);
