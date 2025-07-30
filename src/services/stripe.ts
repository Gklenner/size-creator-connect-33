// Stripe integration service (mock implementation for now)
// In production, this would integrate with Stripe API

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
  subscriptions: StripeSubscription[];
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  plan: StripePlan;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  trialEnd?: number;
  cancelAtPeriodEnd: boolean;
}

export interface StripePlan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  clientSecret: string;
}

class StripeService {
  private readonly CUSTOMERS_KEY = 'size_stripe_customers';
  private readonly SUBSCRIPTIONS_KEY = 'size_stripe_subscriptions';
  
  // Available plans
  private readonly plans: StripePlan[] = [
    {
      id: 'plan_basic',
      name: 'Basic',
      amount: 2900, // $29.00
      currency: 'usd',
      interval: 'month',
      features: [
        'Até 5 produtos',
        'Materiais básicos',
        'Dashboard simples',
        'Suporte por email'
      ]
    },
    {
      id: 'plan_pro',
      name: 'Pro',
      amount: 4900, // $49.00
      currency: 'usd',
      interval: 'month',
      features: [
        'Produtos ilimitados',
        'IA para materiais',
        'Analytics avançado',
        'Microsites personalizados',
        'Suporte prioritário'
      ]
    },
    {
      id: 'plan_enterprise',
      name: 'Enterprise',
      amount: 9900, // $99.00
      currency: 'usd',
      interval: 'month',
      features: [
        'Tudo do Pro',
        'API personalizada',
        'White label',
        'Suporte dedicado',
        'Treinamento incluso'
      ]
    }
  ];

  // Create customer
  async createCustomer(email: string, name: string): Promise<StripeCustomer> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const customer: StripeCustomer = {
      id: `cus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      created: Date.now(),
      subscriptions: []
    };

    this.storeCustomer(customer);
    return customer;
  }

  // Get customer
  async getCustomer(customerId: string): Promise<StripeCustomer | null> {
    const customers = this.getAllCustomers();
    return customers.find(c => c.id === customerId) || null;
  }

  // Get customer by email
  async getCustomerByEmail(email: string): Promise<StripeCustomer | null> {
    const customers = this.getAllCustomers();
    return customers.find(c => c.email === email) || null;
  }

  // Create subscription
  async createSubscription(
    customerId: string, 
    planId: string, 
    trialDays?: number
  ): Promise<StripeSubscription> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const plan = this.plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plano não encontrado');
    }

    const now = Date.now();
    const subscription: StripeSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      status: trialDays ? 'trialing' : 'active',
      plan,
      currentPeriodStart: now,
      currentPeriodEnd: now + (30 * 24 * 60 * 60 * 1000), // 30 days
      trialEnd: trialDays ? now + (trialDays * 24 * 60 * 60 * 1000) : undefined,
      cancelAtPeriodEnd: false
    };

    this.storeSubscription(subscription);
    return subscription;
  }

  // Get subscription
  async getSubscription(subscriptionId: string): Promise<StripeSubscription | null> {
    const subscriptions = this.getAllSubscriptions();
    return subscriptions.find(s => s.id === subscriptionId) || null;
  }

  // Get customer subscriptions
  async getCustomerSubscriptions(customerId: string): Promise<StripeSubscription[]> {
    const subscriptions = this.getAllSubscriptions();
    return subscriptions.filter(s => s.customerId === customerId);
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean = true): Promise<StripeSubscription> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const subscriptions = this.getAllSubscriptions();
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    subscription.cancelAtPeriodEnd = atPeriodEnd;
    if (!atPeriodEnd) {
      subscription.status = 'canceled';
    }

    this.updateSubscription(subscription);
    return subscription;
  }

  // Resume subscription
  async resumeSubscription(subscriptionId: string): Promise<StripeSubscription> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const subscription = await this.getSubscription(subscriptionId);
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    subscription.cancelAtPeriodEnd = false;
    subscription.status = 'active';

    this.updateSubscription(subscription);
    return subscription;
  }

  // Create payment intent for one-time payment
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    customerId?: string
  ): Promise<PaymentIntent> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: 'requires_payment_method',
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  // Confirm payment intent
  async confirmPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      id: paymentIntentId,
      amount: 0, // Would be filled from stored data
      currency: 'usd',
      status: 'succeeded',
      clientSecret: `${paymentIntentId}_confirmed`
    };
  }

  // Get available plans
  getPlans(): StripePlan[] {
    return [...this.plans];
  }

  // Get plan by ID
  getPlan(planId: string): StripePlan | null {
    return this.plans.find(p => p.id === planId) || null;
  }

  // Calculate proration for plan change
  calculateProration(
    currentPlan: StripePlan,
    newPlan: StripePlan,
    daysRemaining: number
  ): number {
    const daysInMonth = 30;
    const currentDailyRate = currentPlan.amount / daysInMonth;
    const newDailyRate = newPlan.amount / daysInMonth;
    
    const refund = currentDailyRate * daysRemaining;
    const newCharge = newDailyRate * daysRemaining;
    
    return newCharge - refund;
  }

  // Webhook simulation for subscription status updates
  simulateWebhook(event: {
    type: string;
    data: {
      object: Partial<StripeSubscription>;
    };
  }): void {
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      if (subscription.id) {
        this.updateSubscription(subscription as StripeSubscription);
      }
    }
  }

  // Check if customer has active subscription
  async hasActiveSubscription(customerId: string): Promise<boolean> {
    const subscriptions = await this.getCustomerSubscriptions(customerId);
    return subscriptions.some(sub => 
      sub.status === 'active' || sub.status === 'trialing'
    );
  }

  // Get subscription status for user
  async getSubscriptionStatus(email: string): Promise<{
    hasSubscription: boolean;
    subscription?: StripeSubscription;
    isTrialing: boolean;
    trialEndsAt?: number;
    plan?: StripePlan;
  }> {
    const customer = await this.getCustomerByEmail(email);
    if (!customer) {
      return { hasSubscription: false, isTrialing: false };
    }

    const subscriptions = await this.getCustomerSubscriptions(customer.id);
    const activeSubscription = subscriptions.find(sub => 
      sub.status === 'active' || sub.status === 'trialing'
    );

    if (!activeSubscription) {
      return { hasSubscription: false, isTrialing: false };
    }

    return {
      hasSubscription: true,
      subscription: activeSubscription,
      isTrialing: activeSubscription.status === 'trialing',
      trialEndsAt: activeSubscription.trialEnd,
      plan: activeSubscription.plan
    };
  }

  // Private methods
  private storeCustomer(customer: StripeCustomer): void {
    const customers = this.getAllCustomers();
    const existingIndex = customers.findIndex(c => c.id === customer.id);
    
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
  }

  private getAllCustomers(): StripeCustomer[] {
    const stored = localStorage.getItem(this.CUSTOMERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private storeSubscription(subscription: StripeSubscription): void {
    const subscriptions = this.getAllSubscriptions();
    subscriptions.push(subscription);
    localStorage.setItem(this.SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  }

  private updateSubscription(subscription: StripeSubscription): void {
    const subscriptions = this.getAllSubscriptions();
    const index = subscriptions.findIndex(s => s.id === subscription.id);
    
    if (index >= 0) {
      subscriptions[index] = subscription;
      localStorage.setItem(this.SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
    }
  }

  private getAllSubscriptions(): StripeSubscription[] {
    const stored = localStorage.getItem(this.SUBSCRIPTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

export const stripeService = new StripeService();