import { EInvoiceStatus, EOrderStatus, EOrderType, EPaymentMethod, EPaymentStatus, EQRCodeType } from "../../enum/etype_project.enum";
import { ShippingModel } from "../shipping/shipping.model";
import { OrderItemModel } from "./order-item.model";

export interface OrderModel {
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
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  invoice?: InvoiceModel;
  shippingDetail?: ShippingModel;

  items: OrderItemModel[];
}

export interface InvoiceModel {
  id: string;
  orderId: string;

  customerName: string;
  customerPhonenumber: string;

  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;

  invoiceStatus: EInvoiceStatus;
  payments: PaymentModel[];

  cashierName?: string;
  paidAt?: Date;

  createdAt: Date;
}



export interface PaymentModel {
  id: string;
  amount: number;

  transactionCode: string;
  paymentMethod: EPaymentMethod;
  paymentStatus: EPaymentStatus;

  createdAt?: Date;
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