// Size Platform Types

export interface User {
  uid: string;
  name: string;
  email: string;
  type: "affiliate" | "creator";
  createdAt: Date;
  referredBy?: string;
  avatar?: string;
  bio?: string;
}

export interface Product {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  affiliateLink: string;
  category: string;
  commission: number;
  materials: {
    instagram: string[];
    tiktok: string[];
    email: string[];
    banners: string[];
  };
  createdAt: Date;
  isActive: boolean;
  clickCount: number;
  conversionCount: number;
  price: number;
}

export interface Referral {
  id: string;
  productId: string;
  affiliateId: string;
  clickCount: number;
  conversionCount: number;
  earnings: number;
  createdAt: Date;
  lastClick?: Date;
}

export interface Subscription {
  userId: string;
  status: "trial" | "active" | "cancelled" | "expired";
  plan: "basic" | "premium" | "enterprise";
  startDate: Date;
  endDate: Date;
  trialUsed: boolean;
}

export interface DashboardStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  activeProducts: number;
  conversionRate: number;
}

export interface MaterialType {
  id: string;
  type: "instagram" | "tiktok" | "email" | "banner";
  content: string;
  imageUrl?: string;
  description: string;
}