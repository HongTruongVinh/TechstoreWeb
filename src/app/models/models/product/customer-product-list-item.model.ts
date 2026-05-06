export interface CustomerProductListItemModel {
    productId: string;
    name: string;
    mainImageUrl: string;

    categoryName?: string;
    stock?: number;
    price?: number;

    averageRating?: number;
    soldCount?: number;
    ratedCount?: number;
}