import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Category } from '../../models/models/category/category.model';

export interface CategoryState extends EntityState<Category> {
  loading: boolean;
}

export const categoryAdapter: EntityAdapter<Category> =
  createEntityAdapter<Category>();

export const initialState: CategoryState =
  categoryAdapter.getInitialState({
    loading: false
  });