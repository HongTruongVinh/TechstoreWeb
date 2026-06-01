import { createFeatureSelector, createSelector } from '@ngrx/store';
import { categoryAdapter, CategoryState } from './category.state';

export const selectCategoryState =
  createFeatureSelector<CategoryState>('categories');

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = categoryAdapter.getSelectors();

export const selectAllCategories =
  createSelector(selectCategoryState, selectAll);

export const selectCategoryLoading =
  createSelector(
    selectCategoryState,
    (state) => state.loading
  );