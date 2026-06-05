export const STORAGE_KEYS = {
  CART: 'coresystems.cart.v1',
  FAVORITES: 'coresystems.favorites.v1',
} as const;

export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  CATEGORY_IMAGES: 'category-images',
  AVATARS: 'avatars',
  BANNERS: 'banners',
  DOCUMENTS: 'documents',
} as const;

export const ROUTES = {
  HOME: '/',
  PRODUCT: (id: string) => `/product/${id}`,
  CART: '/cart',
  SEARCH: '/search',
  LOGIN: '/login',
  REGISTER: '/register',
  CATEGORY: (slug: string) => `/category/${slug}`,
  FAVORITES: '/favorites',
  ACCOUNT: '/account',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
} as const;
