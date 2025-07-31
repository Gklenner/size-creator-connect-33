import { DataEncryption } from '@/lib/crypto';

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'click' | 'conversion' | 'signup' | 'login' | 'product_create' | 'referral_click';
  userId?: string;
  productId?: string;
  affiliateId?: string;
  referralId?: string;
  data: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userAgent: string;
  ip?: string;
  url: string;
  referrer?: string;
}

export interface ConversionMetrics {
  totalViews: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  earnings: number;
  topReferrers: Array<{ id: string; clicks: number; conversions: number }>;
  dailyStats: Array<{ date: string; views: number; clicks: number; conversions: number }>;
}

class AnalyticsService {
  private readonly EVENTS_KEY = 'size_analytics_events';
  private readonly SESSION_KEY = 'size_analytics_session';
  private readonly MAX_EVENTS = 10000;
  
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSession();
  }

  // Event tracking
  track(type: AnalyticsEvent['type'], data: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer || undefined,
      ...this.extractContextData(data)
    };

    this.storeEvent(event);
    this.processRealTimeMetrics(event);
  }

  // Page view tracking
  trackPageView(path: string, title?: string): void {
    this.track('page_view', {
      path,
      title: title || document.title,
      timestamp: Date.now()
    });
  }

  // Click tracking with referral support
  trackClick(element: string, url?: string, productId?: string, affiliateId?: string): void {
    this.track('click', {
      element,
      url,
      productId,
      affiliateId,
      timestamp: Date.now()
    });
  }

  // Conversion tracking
  trackConversion(productId: string, affiliateId?: string, value?: number): void {
    this.track('conversion', {
      productId,
      affiliateId,
      value,
      timestamp: Date.now()
    });
  }

  // User action tracking
  trackUserAction(action: string, context: Record<string, any> = {}): void {
    const actionTypes: Record<string, AnalyticsEvent['type']> = {
      signup: 'signup',
      login: 'login',
      product_create: 'product_create',
      referral_click: 'referral_click'
    };

    const eventType = actionTypes[action] || 'click';
    this.track(eventType, { action, ...context });
  }

  // Get analytics data
  getEvents(filters?: {
    type?: AnalyticsEvent['type'];
    userId?: string;
    productId?: string;
    startDate?: number;
    endDate?: number;
  }): AnalyticsEvent[] {
    const events = this.getAllEvents();
    
    if (!filters) return events;

    return events.filter(event => {
      if (filters.type && event.type !== filters.type) return false;
      if (filters.userId && event.userId !== filters.userId) return false;
      if (filters.productId && event.productId !== filters.productId) return false;
      if (filters.startDate && event.timestamp < filters.startDate) return false;
      if (filters.endDate && event.timestamp > filters.endDate) return false;
      return true;
    });
  }

  // Get conversion metrics
  getConversionMetrics(productId?: string, affiliateId?: string): ConversionMetrics {
    const events = this.getEvents({
      productId,
      startDate: Date.now() - (30 * 24 * 60 * 60 * 1000) // Last 30 days
    });

    const views = events.filter(e => e.type === 'page_view').length;
    const clicks = events.filter(e => e.type === 'click' || e.type === 'referral_click');
    const conversions = events.filter(e => e.type === 'conversion');

    const conversionRate = clicks.length > 0 ? (conversions.length / clicks.length) * 100 : 0;
    const earnings = conversions.reduce((sum, conv) => sum + (conv.data.value || 0), 0);

    // Group by referrer
    const referrerStats = new Map<string, { clicks: number; conversions: number }>();
    clicks.forEach(click => {
      const referrerId = click.affiliateId || 'direct';
      const current = referrerStats.get(referrerId) || { clicks: 0, conversions: 0 };
      current.clicks++;
      referrerStats.set(referrerId, current);
    });

    conversions.forEach(conversion => {
      const referrerId = conversion.affiliateId || 'direct';
      const current = referrerStats.get(referrerId) || { clicks: 0, conversions: 0 };
      current.conversions++;
      referrerStats.set(referrerId, current);
    });

    const topReferrers = Array.from(referrerStats.entries())
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 10);

    // Daily stats for the last 7 days
    const dailyStats = this.getDailyStats(events, 7);

    return {
      totalViews: views,
      totalClicks: clicks.length,
      totalConversions: conversions.length,
      conversionRate: Math.round(conversionRate * 100) / 100,
      earnings,
      topReferrers,
      dailyStats
    };
  }

  // Real-time metrics for dashboard
  getRealTimeMetrics(): {
    activeUsers: number;
    recentEvents: AnalyticsEvent[];
    liveConversions: number;
  } {
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    const recentEvents = this.getEvents({ startDate: fiveMinutesAgo });

    const activeUsers = new Set(
      recentEvents
        .filter(e => e.sessionId)
        .map(e => e.sessionId)
    ).size;

    const liveConversions = recentEvents.filter(e => e.type === 'conversion').length;

    return {
      activeUsers,
      recentEvents: recentEvents.slice(-10),
      liveConversions
    };
  }

  // Export data for external analytics
  exportData(format: 'json' | 'csv' = 'json'): string {
    const events = this.getAllEvents();
    
    if (format === 'csv') {
      const headers = ['id', 'type', 'timestamp', 'url', 'userAgent', 'data'];
      const rows = events.map(event => [
        event.id,
        event.type,
        new Date(event.timestamp).toISOString(),
        event.url,
        event.userAgent,
        JSON.stringify(event.data)
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    return JSON.stringify(events, null, 2);
  }

  // Clear old data
  clearOldData(daysToKeep: number = 90): void {
    const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const events = this.getAllEvents().filter(event => event.timestamp > cutoffDate);
    this.storeAllEvents(events);
  }

  // Private methods
  private getOrCreateSession(): string {
    const existing = localStorage.getItem(this.SESSION_KEY);
    if (existing) {
      const decrypted = DataEncryption.decrypt(existing);
      if (decrypted) return decrypted;
    }

    const newSession = this.generateSessionId();
    localStorage.setItem(this.SESSION_KEY, DataEncryption.encrypt(newSession));
    return newSession;
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractContextData(data: Record<string, any>): Partial<AnalyticsEvent> {
    return {
      userId: data.userId,
      productId: data.productId,
      affiliateId: data.affiliateId,
      referralId: data.referralId
    };
  }

  private storeEvent(event: AnalyticsEvent): void {
    const events = this.getAllEvents();
    events.push(event);
    
    // Keep only the most recent events
    if (events.length > this.MAX_EVENTS) {
      events.splice(0, events.length - this.MAX_EVENTS);
    }
    
    this.storeAllEvents(events);
  }

  private getAllEvents(): AnalyticsEvent[] {
    const encrypted = localStorage.getItem(this.EVENTS_KEY);
    if (!encrypted) return [];
    
    return DataEncryption.decryptObject<AnalyticsEvent[]>(encrypted) || [];
  }

  private storeAllEvents(events: AnalyticsEvent[]): void {
    const encrypted = DataEncryption.encryptObject(events);
    localStorage.setItem(this.EVENTS_KEY, encrypted);
  }

  private processRealTimeMetrics(event: AnalyticsEvent): void {
    // Could send to external analytics service here
    if (import.meta.env.PROD) {
      // Example: send to Google Analytics, Mixpanel, etc.
      console.log('Analytics event:', event.type, event.data);
    }
  }

  private getDailyStats(events: AnalyticsEvent[], days: number): Array<{
    date: string;
    views: number;
    clicks: number;
    conversions: number;
  }> {
    const stats = new Map<string, { views: number; clicks: number; conversions: number }>();
    
    // Initialize with empty days
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      stats.set(dateStr, { views: 0, clicks: 0, conversions: 0 });
    }

    // Fill with actual data
    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      const current = stats.get(date);
      if (!current) return;

      switch (event.type) {
        case 'page_view':
          current.views++;
          break;
        case 'click':
        case 'referral_click':
          current.clicks++;
          break;
        case 'conversion':
          current.conversions++;
          break;
      }
    });

    return Array.from(stats.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

export const analytics = new AnalyticsService();
