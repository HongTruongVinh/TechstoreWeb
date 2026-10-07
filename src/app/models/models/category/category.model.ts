import { Brand } from "../brand/brand.model";

export interface Category {
    id: string;
    name: string;
    description: string;
    iconImageUrl: string;
    slug: string;
    brands: Brand[];
}