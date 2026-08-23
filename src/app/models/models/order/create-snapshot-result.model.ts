import { EPaymentSnapshotStatus } from "../../enum/etype_project.enum";

export interface CreatePaymentSnapshotResult {
  snapshotId: string;
  orderId?: string;
  amount: number;
  status: EPaymentSnapshotStatus;
  message?: string;
}