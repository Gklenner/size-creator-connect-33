// Size Platform Constants

export const APP_CONFIG = {
  name: "Size Platform",
  description: "A plataforma mais completa para impulsionar suas vendas digitais",
  version: "1.0.0",
  url: "https://sizeplatform.com",
  supportEmail: "suporte@sizeplatform.com",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  ANALYTICS: "/analytics",
  MATERIALS: "/materials",
  CREATE_PRODUCT: "/products/create",
} as const;

export const USER_TYPES = {
  AFFILIATE: "affiliate",
  CREATOR: "creator",
} as const;

export const PRODUCT_CATEGORIES = [
  "Educação",
  "Marketing",
  "Tecnologia", 
  "Design",
  "Negócios",
  "Saúde",
  "Fitness",
  "Culinária",
  "Finanças",
  "Desenvolvimento Pessoal",
] as const;

export const STORAGE_KEYS = {
  USER: "size_user",
  USERS: "size_users",
  PRODUCTS: "size_products",
  LAST_LOGIN: "size_last_login",
} as const;

export const COMMISSION_LIMITS = {
  MIN: 1,
  MAX: 90,
  DEFAULT: 30,
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PRODUCT_TITLE_MAX_LENGTH: 100,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 500,
} as const;