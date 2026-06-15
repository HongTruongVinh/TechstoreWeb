import { EOrderStatus, EOrderType, EPaymentMethod } from "../../enum/etype_project.enum";
import { OrderItemModel } from "./order-item.model";

export interface ListItemOrderModel {
    id: string;
    customerId: string;
    customerName: string;

    customerPhonenumber: string;
    customerEmail: string;
    orderStatus: EOrderStatus; 

    shippingAddress: string;
    totalPrice: number;
    shippingCharge: number;

    discountAmount: number;
    finalAmount: number;
    paymentMethod: EPaymentMethod;

    orderType: EOrderType;
    createdAt: Date;
    updatedAt: Date;

    items: OrderItemModel[];
}