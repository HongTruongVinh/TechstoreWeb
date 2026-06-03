export interface OrderItemModel {
    productVariantOptionId: string;
    productName: string;
    optionName: string;
    variantName: string;
    categoryName: string;
    quantity: number;
    priceAtOrderTime: number; // giá mỗi đơn vị (chưa chiết khấu, chưa thuế)
    discount?: number; // giảm giá theo dòng
    totalPrice: number; // quantity * unitPrice - discount + tax
    mainImageUrl: string; // để hiển thị đẹp hơn
    note?: string; // ghi chú riêng cho dòng hàng này
}