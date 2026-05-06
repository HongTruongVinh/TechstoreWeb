import { EInvoiceStatus, EOrderStatus, EOrderType, EPaymentMethod, EPaymentStatus, EQRCodeType } from "../../enum/etype_project.enum";
import { OrderItemModel } from "./order-item.model";

export interface OrderDetailModel {
    orderId: string;
    customerId: string;
    customerName: string;
    customerPhonenumber: string;
    customerEmail: string;
    orderStatus: EOrderStatus; 
    shippingAddress: string;
    items: OrderItemModel[];
    totalPrice: number;
    shippingCharge: number;
    discountAmount: number;
    finalAmount: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    paymentMethod: EPaymentMethod;

    payment?: PaymentModel;
    invoice?: InvoiceModel;
    qrCode?: string;

    shipperId?: string;
    shipperName?: string;
    trackingNumber?: string;
    shippedDate?: Date;
    estimatedArrival?: Date;
    shippingNote?: string;
    failureCount?: number;
}

export interface PaymentModel {
    paymentId: string;
    orderId: string;
    customerId?: string;
    customerName: string;
    customerPhonenumber: string;
    amount: number;
    paymentMethod: EPaymentMethod;
    transactionCode?: string; 
    paymentStatus: EPaymentStatus;
    createdAt?: Date;
    qrCode?: QrcodeModel; 
  }

  export interface InvoiceModel {
    invoiceId: string;
    orderId: string;

    customerName: string;
    customerPhonenumber: string;

    totalPrice: number;
    discountAmount: number;
    finalAmount: number;

    orderType: EOrderType;
    invoiceStatus: EInvoiceStatus;

    cashierName?: string;
    paidAt?: Date;

    createdAt: Date;
  }

  export interface QrcodeModel {
    id: string;
    content: string;
    imageData: string;
    type: EQRCodeType;
    relatedId: string; 
    createdAt?: Date;
    expiredAt?: Date;
  }