import { EDiscountType, EVoucherStatus } from "../../enum/etype_project.enum";

export interface Voucher {
  id: string;
  code: string;
  description: string;

  discountType: EDiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  minOrderPrice: number;

  usageLimit: number;
  available: number;

  startDate: Date;
  endDate: Date;
  status: EVoucherStatus;
}