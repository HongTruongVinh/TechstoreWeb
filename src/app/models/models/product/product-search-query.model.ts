import { PagedQuery } from "../api-response.model";

export interface ProductSearchQuery extends  PagedQuery 
{
    keyword?: string;
    categoryId?: string;
    brandId?: string;
    
    minPrice?: string;
    maxPrice?: string;
    isActive?: boolean;
}