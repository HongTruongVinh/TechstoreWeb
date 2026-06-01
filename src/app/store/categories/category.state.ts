import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CategoryModel } from '../../models/models/category/category.model';

export interface CategoryState extends EntityState<CategoryModel> {
  loading: boolean;
}

export const categoryAdapter: EntityAdapter<CategoryModel> =
  createEntityAdapter<CategoryModel>();

export const initialState: CategoryState =
  categoryAdapter.getInitialState({
    loading: false
  });