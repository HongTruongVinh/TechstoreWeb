import { ProductSearchQuery } from "../../models/models/product/product-search-query.model";

export const apiEndpoints = {
  category: {
    getCategories: 'categories',
    getCategory: (id: string) => `categories/${id}`,
  },

  brand: {
    getBrands: 'brands',
    getBrand: (id: string) => `brands/${id}`,
  },

  product: {
    getProducts: (query: ProductSearchQuery) => {
      const params = new URLSearchParams();

      if (query.page !== undefined) {
        params.set('page', query.page.toString());
      }

      if (query.pageSize !== undefined) {
        params.set('pageSize', query.pageSize.toString());
      }

      if (query.keyword) {
        params.set('keyword', query.keyword);
      }

      if (query.categoryId) {
        params.set('categoryId', query.categoryId);
      }

      if (query.brandId) {
        params.set('brandId', query.brandId);
      }

      if (query.minPrice) {
        params.set('minPrice', query.minPrice);
      }

      if (query.maxPrice) {
        params.set('maxPrice', query.maxPrice);
      }

      if (query.isActive !== undefined) {
        params.set('isActive', query.isActive.toString());
      }

      return `products?${params.toString()}`;
    },

    getProductDetails: (id: string) => `products/${id}`,
  },

  home: {
    getFeatureProducts: 'home/feature',

    getProductsByBrandName: (
      brandName: string,
      page: number,
      pageSize: number
    ) =>
      `home/products?brandName=${encodeURIComponent(brandName)}&page=${page}&pageSize=${pageSize}`,

    getSystemConfigs: 'home/system-configs',
  },

  order: {
    userOrders: (page: number, pageSize: number) =>
      `orders?page=${page}&pageSize=${pageSize}`,

    createCodOrder: 'orders/create-cod-order',

    createSnapshotOrder: 'orders/create-snapshot-order',

    cancelOrder: (id: string) =>
      `orders/${id}/cancel`,

    orderDetails: (id: string) =>
      `orders/${id}`,

    updateOrder: (id: string) =>
      `orders/${id}`,
  },

  user: {
    updateProfile: 'Users',

    cart: 'Cart',

    getUsers: (id: string) =>
      `Users/profile/${id}`,
  },

  cart: {
    getAllItems: 'Carts',

    addItemToCart: 'Carts',

    updateItemInCart: (id: string) =>
      `Carts/${id}`,

    removeItemFromCart: 'Carts/remove',

    clearCart: (id: string) =>
      `Carts/clear/${id}`,
  },

  statistics: {
    getDashboardOverviewData: 'admin/statistics/overview',
  },

  uploadDataCloud: {
    uploadPhotoToCloud: (id: string) =>
      `upload-to-cloud/cloudinary/${id}`,

    deletePhotoCloud: (id: string) =>
      `upload-to-cloud/cloudinary/${id}`,

    updateStatusSoftware: (id: string) =>
      `upload-to-cloud/file-software/status/${id}`,

    updateInformationSoftware: (id: string) =>
      `upload-to-cloud/file-software/${id}`,

    getListFileSoftware: 'upload-to-cloud/file-software',
  },

  authentication: {
    registerUser: 'authentication/register',

    refresh: 'authentication/refresh',

    loginNormalAccount: 'authentication/login',

    changePassword: 'authentication/change-password',

    loginWithGoogle: 'authentication/login-google',

    loginWithFacebook: 'authentication/login-facebook',
  },

  shipper: {
    getShippers: 'shippers',

    getShipper: (id: string) =>
      `shippers/${id}`,
  },

  invoice: {
    getInvoices: 'invoices',

    getInvoice: (id: string) =>
      `invoices/${id}`,
  },

  payment: {
    getPaymentQrForSnapshot: (id: string) =>
      `payments/get-payment-qr-for-snapshot/${id}`,

    paymentHub: 'payments/hub',
  },

  voucher: {
    getVoucherByCode: (code: string) =>
      `vouchers/${code}`,

    getVouchers: 'vouchers',
  },

  mockingDataApi: {
    paymentHub: 'PaymentWebhook/verify-payment-of-snapshot',
  },

  chatbot: {
    sendMessage: 'ai/recommend-products',
  },
} as const;