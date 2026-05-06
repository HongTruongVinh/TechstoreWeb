export interface OrderCreateModel {
    customerId: string;
    customerName: string;
    customerPhoneNumber: string;
    customerEmail?: string;
    shippingAddress: string;
    voucherCode?: string;
    items: OrderItemCreateModel[];
    note?: string;
    paymentMethod: number;
}

export interface OrderItemCreateModel {
    orderId?: string;
    productVariantOptionId: string;
    quantity: number;
    discount: number;
}   