import { createReducer, on } from '@ngrx/store';
import * as CategoryActions from './category.actions';

import {
  initialState,
  categoryAdapter
} from './category.state';

export const categoryReducer = createReducer(
  initialState,

  on(CategoryActions.loadCategories, (state) => ({
    ...state,
    loading: true
  })),

  on(CategoryActions.loadCategoriesSuccess, (state, { categories }) =>
    categoryAdapter.setAll(categories, {
      ...state,
      loading: false
    })
  ),

);