export interface CartItem{
    id: string;
    productId: string;
    productVariantOptionId: string;

    productName: string;
    variantName: string;
    optionName: string;

    mainImageUrl: string;
    quantity: number;
    price: number;
    salePrice?: number;

    discount: number;
    totalPrice: number;
    slug: string;
    stock: number;
}

