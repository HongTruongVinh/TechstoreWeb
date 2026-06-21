import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cartItemAdapter, CartItemState } from './cart.state';

export const selectCartItemState =
  createFeatureSelector<CartItemState>('cartItems');

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = cartItemAdapter.getSelectors(selectCartItemState);

export const selectAllCartItems = selectAll;
export const selectAllCartItemIds = selectIds;
export const selectCartItemEntities = selectEntities;
export const selectCartItemCount = selectTotal;

export const selectCartItemLoading =
  createSelector(
    selectCartItemState,
    (state) => state.loading
  );

export const selectCartItemById = (id: string) =>
  createSelector(
    selectEntities,
    entities => entities[id]
  );

export const selectIsItemInCart = (optionId: string) =>
  createSelector(
    selectCartItemEntities,
    entities => !!entities[optionId]
  );


export const selectSelectedItemIds = createSelector(
  selectCartItemState,
  state => state.selectedItemIds
);

export const selectSelectedItems = createSelector(
  selectAllCartItems,
  selectSelectedItemIds,
  (items, selectedIds) =>
    items.filter(item => selectedIds.includes(item.id))
);

export const selectTotalPrice = createSelector(
  selectSelectedItems,
  items =>
    items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    )
);

