
export interface ProductDetailsModel {
    productId: string;
    name: string;
    shortDescription: string;

    description: string;
    mainImageUrl: string;
    galleryImageUrls?: string[];

    soldCount: number;
    warranty: Number;

    salePrice: number;
    saleStart?: Date;
    saleEnd?: Date;

    catagoryId: string;
    categoryName: string;

    brandId: string;
    brandName: string;

    ratedCount: number;
    averageRating: number;

    slug: string;
    tags?: string[];

    isOnSale: boolean;
    isFeatured: boolean;

    variants: ProductVariantModel[];
}

export interface ProductVariantModel {
    id: string;
    productId: string;
    name: string;
    description: string;

    stock?: number;
    price: number;
    soldCount: number;

    salePrice: number;
    saleStart?: Date;
    saleEnd?: Date;

    options: ProductVariantOptionModel[];
}

export interface ProductVariantOptionModel{
    id: string;
    productVariantId: string;
    name: string;

    imageUrl: string;
    stock: number;
    price?: number; 
}

// export interface ProductDetailsModel {
//     productId: string;
//     name: string;
//     shortDescription: string;

//     description: string;
//     mainImageUrl: string;
//     galleryImageUrls?: string[];

//     stock: number;
//     price: number;
//     soldCount: number;

//     salePrice: number;
//     saleStart?: Date;
//     saleEnd?: Date;

//     catagoryId: string;
//     categoryName: string;

//     brandId: string;
//     brandName: string;

//     ratedCount: number;
//     averageRating: number;

//     slug:string;
//     tags?: string[];
    
//     isOnSale: boolean;
//     isFeatured: boolean;
// }


