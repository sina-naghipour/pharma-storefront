// API endpoints configuration
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/accounts/auth/login/',
    LOGOUT: '/accounts/auth/logout/',
    REFRESH: '/accounts/auth/refresh/',
  },

  // Accounts
  ACCOUNTS: {
    USERS: '/accounts/users/',
    USER_ME: '/accounts/users/me/',
    CHANGE_PASSWORD: '/accounts/users/change_password/',
    PASSWORD_RESET: '/accounts/users/password_reset/',
    PASSWORD_RESET_CONFIRM: '/accounts/users/password_reset_confirm/',
    PROFILES: '/accounts/profiles/',
    MY_PROFILE: '/accounts/profiles/my_profile/',
    ADDRESSES: '/accounts/addresses/',
    DEFAULT_BILLING: '/accounts/addresses/default_billing/',
    DEFAULT_SHIPPING: '/accounts/addresses/default_shipping/',
    LICENSES: '/accounts/licenses/',
  },

  // Products
  PRODUCTS: {
    PRODUCTS: '/products/products/',
    FEATURED: '/products/products/featured/',
    ON_SALE: '/products/products/on_sale/',
    CATEGORIES: '/products/categories/',
    ROOT_CATEGORIES: '/products/categories/root/',
    MANUFACTURERS: '/products/manufacturers/',
    IMAGES: '/products/images/',
    REVIEWS: '/products/reviews/',
    MY_REVIEWS: '/products/reviews/my_reviews/',
    BATCHES: '/products/batches/',
    EXPIRING_SOON: '/products/batches/expiring_soon/',
  },

  // Orders
  ORDERS: {
    CART: '/orders/cart/',
    CART_CURRENT: '/orders/cart/current/',
    CART_ADD_ITEM: '/orders/cart/add_item/',
    CART_UPDATE_ITEM: '/orders/cart/update_item/',
    CART_REMOVE_ITEM: '/orders/cart/remove_item/',
    CART_CLEAR: '/orders/cart/clear/',
    CART_APPLY_COUPON: '/orders/cart/apply_coupon/',
    CART_SET_ADDRESSES: '/orders/cart/set_addresses/',
    CART_UPLOAD_PRESCRIPTION: '/orders/cart/upload_prescription/',
    ORDERS: '/orders/orders/',
    PAYMENTS: '/orders/payments/',
    REFUNDS: '/orders/refunds/',
    SHIPMENTS: '/orders/shipments/',
  },

  // Payments
  PAYMENTS: {
    PAYMENTS: '/payments/payments/',
    MY_PAYMENTS: '/payments/payments/my_payments/',
    METHODS: '/payments/methods/',
    SAVED_METHODS: '/payments/saved-methods/',
    GATEWAYS: '/payments/gateways/',
    DISPUTES: '/payments/disputes/',
    REFUNDS: '/payments/refunds/',
    WEBHOOKS: '/payments/webhooks/',
  },

  // Promotions
  PROMOTIONS: {
    PROMOTIONS: '/promotions/promotions/',
    ACTIVE: '/promotions/promotions/active/',
    COUPONS: '/promotions/coupons/',
    VALIDATE_COUPON: '/promotions/coupons/validate/',
    REFERRALS: '/promotions/referrals/',
    MY_REFERRALS: '/promotions/referrals/my_referrals/',
    REFERRAL_PROGRAMS: '/promotions/referral-programs/',
    REWARD_POINTS: '/promotions/reward-points/',
  },

  // Reviews
  REVIEWS: {
    REVIEWS: '/reviews/reviews/',
    MY_REVIEWS: '/reviews/reviews/my_reviews/',
    QUESTIONS: '/reviews/questions/',
    MY_QUESTIONS: '/reviews/questions/my_questions/',
    ANSWERS: '/reviews/answers/',
    MY_ANSWERS: '/reviews/answers/my_answers/',
  },

  // Support
  SUPPORT: {
    TICKETS: '/support/tickets/',
    MY_TICKETS: '/support/tickets/my_tickets/',
    CATEGORIES: '/support/categories/',
    FAQS: '/support/faqs/',
    CONTACT: '/support/contact/',
    MY_MESSAGES: '/support/contact/my_messages/',
    KB_ARTICLES: '/support/kb/articles/',
    KB_CATEGORIES: '/support/kb/categories/',
  },
};