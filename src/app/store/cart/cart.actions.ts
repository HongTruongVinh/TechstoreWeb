import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../models/models/cart/cart-item.model';
import { CartItemCreateModel } from '../../models/models/cart/cart-item-create.model';

export const loadCartItem = createAction(
  '[CartItem] Load CartItem'
);

export const loadCartItemSuccess = createAction(
  '[CartItem] Load CartItem Success',
  props<{ cartitems: CartItem[] }>()
);



export const addCartItem = createAction(
  '[CartItem] Add CartItem',
  props<{ cartItem: CartItemCreateModel }>()
);

export const addCartItemSuccess = createAction(
  '[CartItem] Add CartItem Success',
  props<{ cartItem: CartItem }>()
);

export const addCartItemFailure = createAction(
  '[CartItem] Add CartItem Failure',
  props<{ error: string }>()
);


// export const removeCartItems = createAction(
//   '[CartItem] Remove CartItems',
//   props<{ cartItemIds: string[] }>()
// );

export const removeCartItems = createAction(
  '[CartItem] Remove CartItems'
);

export const removeCartItemsSuccess = createAction(
  '[CartItem] Remove CartItems Success',
  props<{ cartItemIds : string[] }>()
);

export const removeCartItemsFailure = createAction(
  '[CartItem] Remove CartItems Failure',
  props<{ error: string }>()
);

export const updateCartItemQuantity = createAction(
  '[CartItem] Update Quantity',
  props<{
    id: string;
    quantity: number;
  }>()
);

export const toggleSelectItem = createAction(
  '[CartItem] Toggle Select Item',
  props<{ cartItemId: string }>()
);

export const toggleSelectAllItems = createAction(
  '[CartItem] Toggle Select All Items'
);