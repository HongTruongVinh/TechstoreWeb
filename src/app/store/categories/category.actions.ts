import { createAction, props } from '@ngrx/store';
import { CategoryModel } from '../../models/models/category/category.model';

export const loadCategories = createAction(
  '[Category] Load Categories'
);

export const loadCategoriesSuccess = createAction(
  '[Category] Load Categories Success',
  props<{ categories: CategoryModel[] }>()
);
