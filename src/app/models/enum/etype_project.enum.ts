export enum EOrderStatus {
    Pending,     // Đang chờ xử lý
    Processing,  // Đang xử lý
    Delivering,   // Đang giao hàng
    Completed,   // Hoàn thành
    Canceled,     // Đã hủy
    Refunded,    // Đã hoàn tiền
    Failed       // Thất bại
}

export enum EInvoiceStatus {
    Unpaid, 
    PartiallyPaid,
    Paid, 
    Canceled,
    Refunded
}

export enum EPaymentStatus {
    Pending,   // Chờ thanh toán
    Paid,      // Đã thanh toán
    Failed,    // Thanh toán thất bại
    Refunded,  // Đã hoàn tiền
    Canceled,
}

export enum EPaymentMethod
{
    COD,
    DomesticBank,
    Cash
}

export enum EShippingStatus
{
    Preparing,   // Đang chuẩn bị
    Shipping,    // Đang giao hàng
    Delivered,   // Đã giao hàng
    Failed,      // Giao hàng thất bại
    Canceled     // Đã hủy giao hàng
}

export enum EUserStatus
{
    Active,
    Inactive,
    Banned,
    Deleted
}

export enum ERoles {
    Admin,
    Staff,
    User
}

export enum EPhotoType {
    Product,
    Category,
    Brand
}

export enum EGender
{
    Other,
    Male,
    Female
}

export enum EQRCodeType
{
    Payment,
    OrderTracking
}

export enum EOrderType
{
    InStore, // Đơn hàng tại cửa hàng
    Online,  // Đơn hàng trực tuyến
}

export enum EErrorType
{
    BadRequest,
    SystemError,
    NotFound,
    ConfictData,
    Unauthorized,
    Forbidden,
    Status500InternalServerError,

    IdempotencyKeyConflict
}

export enum EDiscountType
{
    Percentage,
    FixedAmount
}

export enum EVoucherStatus
{
    Draft,
    Active,
    Expired,
    Disabled
}