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
    Paid,    // Đã thanh toán
    Unpaid,  // Chưa thanh toán 
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

export enum ERetCode
{
    Successfull,

    BadRequest,

    SystemError,

    LoginSuccess,

    LoginError,

    ExitAccount,

    ErrorCookie,

    PasswordNotSame,

    NoExitData,

    ConfictData,

    NoPermission
}