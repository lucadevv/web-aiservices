export interface SubscriptionPlan {
    id: string;
    name: string;
    stripePriceId: string;
    type: 'free' | 'starter' | 'pro' | 'business';
    priceCents: number;
    currency: string;
    interval: 'month' | 'year';
    features: PlanFeatures;
    limits: PlanLimits;
    trialDays?: number;
    isActive: boolean;
}

export interface PlanFeatures {
    executions: number;
    workflows: number;
    apiCalls: number;
    storage: number; // MB
    support: 'community' | 'email' | 'priority' | 'dedicated';
    features: string[];
}

export interface PlanLimits {
    maxWorkflows: number;
    monthlyExecutions: number;
    apiCallsPerDay: number;
    storageGB: number;
    webhooks: number;
    customDomains: number;
}

export interface Subscription {
    id: string;
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    plan: string;
    status: 'active' | 'past_due' | 'cancelled' | 'unpaid' | 'trialing' | 'incomplete';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    trialStart?: Date;
    trialEnd?: Date;
    cancelledAt?: Date;
    cancelAtPeriodEnd: boolean;
    amountCents: number;
    currency: string;
    metadata?: Record<string, string>;
    createdAt: Date;
    updatedAt: Date;
}

export interface StripeCustomer {
    id: string;
    email: string;
    name?: string;
    defaultPaymentMethod?: string;
    created: number;
    currency?: string;
    balance?: number;
}

export interface PaymentMethod {
    id: string;
    type: 'card' | 'bank_account' | 'paypal';
    card?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
    };
    isDefault: boolean;
    created: number;
}

export interface Invoice {
    id: string;
    stripeInvoiceId: string;
    customerId: string;
    subscriptionId: string;
    status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
    amountPaid: number;
    amountDue: number;
    currency: string;
    description?: string;
    hostedInvoiceUrl?: string;
    invoicePdf?: string;
    created: Date;
    dueDate?: Date;
    paidAt?: Date;
}

export interface BillingInfo {
    customer: StripeCustomer;
    subscription?: Subscription;
    paymentMethods: PaymentMethod[];
    upcomingInvoice?: Invoice;
    usageThisMonth: {
        executions: number;
        apiCalls: number;
        storage: number;
    };
    planLimits: PlanLimits;
}

export interface CreateSubscriptionRequest {
    planId: string;
    paymentMethodId?: string;
    interval?: 'month' | 'year';
}

export interface ChangePlanRequest {
    newPlanId: string;
    prorate?: boolean;
}

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
    clientSecret: string;
    paymentMethod?: string;
} 