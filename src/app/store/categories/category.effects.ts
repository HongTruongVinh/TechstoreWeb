import { Injectable, inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, switchMap } from 'rxjs/operators';

import * as CategoryActions from './category.actions';

import { CategoryService } from '../../core/services/category.service';

@Injectable()
export class CategoryEffects {

  private actions$ = inject(Actions);
  private categoryService = inject(CategoryService);

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),

      switchMap(() =>
        this.categoryService.getAllItems().pipe(
          map(apiResponse  =>
            CategoryActions.loadCategoriesSuccess({ categories: apiResponse.data || [] })
          )
        )
      )
    )
  );
}