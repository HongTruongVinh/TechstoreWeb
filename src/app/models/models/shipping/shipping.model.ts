import { EShippingStatus } from "../../enum/etype_project.enum";

export interface ShippingModel {
    id: string;
    orderId: string;
    shipperId: string;

    shipperName: string;
    deliveryStaffName?: string;
    deliveryStaffPhoneNumber?: string;

    trackingNumber: string;
    status: EShippingStatus;

    shippedDate?: Date;
    estimatedArrival?: Date;
    shippingNote?: string;
}