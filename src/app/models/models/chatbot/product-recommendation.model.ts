export interface ProductRecommendation {
    productId: string; 
    slug: string;
    productName: string; 
    price: number;
    imgUrl: string; 
    rank: number;
    reason: string;
}

export interface ProductRecommendationResponse {
    summary: string;
    recommendations: ProductRecommendation[];
}