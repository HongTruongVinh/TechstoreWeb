import { EPaymentMethod } from "../../enum/etype_project.enum";

export interface OrderCreateModel {
    id?: string;
    customerName: string;
    customerPhoneNumber: string;
    customerEmail?: string;
    shippingAddress: string;
    voucherCode?: string;
    items: OrderItemCreateModel[];
    note?: string;
    paymentMethod: EPaymentMethod;
}

export interface OrderItemCreateModel {
    orderId?: string;
    productVariantOptionId: string;
    quantity: number;
}   