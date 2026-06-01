import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CartItem } from '../../models/models/cart/cart-item.model';

export interface CartItemState extends EntityState<CartItem> {
  loading: boolean;
  selectedItemIds: string[];
}

// export const cartItemAdapter: EntityAdapter<CartItem> =
//   createEntityAdapter<CartItem>();

export const cartItemAdapter =
  createEntityAdapter<CartItem>({
    selectId: (item) => item.productVariantOptionId
  });

export const initialState: CartItemState =
  cartItemAdapter.getInitialState({
    loading: false,
    selectedItemIds: []
  });

  