export interface ProductListItemModel {
    productId: string;
    productVariantId: string;
    productName: string;
    productVariantName: string;
    slug: string;

    mainImageUrl: string;
    categoryName?: string;
    price: number;
    salePrice: number;

    averageRating?: number;
    soldCount?: number;
    ratedCount?: number;
    warranty: number;

    startSellingDate?: Date;
}   