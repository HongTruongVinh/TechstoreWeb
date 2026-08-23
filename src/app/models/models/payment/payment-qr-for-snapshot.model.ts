export interface PaymentDataForSnapshotModel{
    snapshotId: string;
    amount: number;
    qrDataURL: string;
    createdAt: Date,
    expiredAt: Date,
}