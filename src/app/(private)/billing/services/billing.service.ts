// ===============================================
// BILLING SERVICE - FRONTEND
// ===============================================

import { apiService } from '@/shared/services/api.service';

export interface BillingInfo {
    id: string;
    customer_id: string;
    subscription_status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    created_at: string;
    updated_at: string;
    subscription?: {
        id: string;
        status: string;
        plan: string;
        amountCents: number;
        currency: string;
        currentPeriodEnd: string;
    };
    usageThisMonth?: {
        executions: number;
        apiCalls: number;
        storage: number;
    };
    planLimits?: {
        monthlyExecutions: number;
        apiCallsPerDay: number;
        storageGB: number;
    };
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    priceCents: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    popular?: boolean;
}

export interface Subscription {
    id: string;
    status: string;
    plan_id: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
}

export interface Invoice {
    id: string;
    amount: number;
    amountPaid: number;
    currency: string;
    status: string;
    created_at: string;
    created: number;
    description?: string;
    hostedInvoiceUrl?: string;
    pdf_url?: string;
}

export interface PaymentMethod {
    id: string;
    type: string;
    last4: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    is_default: boolean;
    card?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
    };
    isDefault?: boolean;
}

export interface CreateSubscriptionRequest {
    plan_id: string;
    payment_method_id?: string;
}

export interface ChangePlanRequest {
    plan_id: string;
    prorate?: boolean;
}

export class BillingService {
    private static instance: BillingService;
    private baseUrl = '/billing';

    private constructor() { }

    public static getInstance(): BillingService {
        if (!BillingService.instance) {
            BillingService.instance = new BillingService();
        }
        return BillingService.instance;
    }

    async getBillingInfo(): Promise<BillingInfo> {
        try {
            const response = await apiService.get<BillingInfo>(`${this.baseUrl}/info`);
            if (!response.data) {
                throw new Error('No billing info received');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching billing info:', error);
            throw error;
        }
    }

    async getAvailablePlans(): Promise<SubscriptionPlan[]> {
        try {
            const response = await apiService.get<SubscriptionPlan[]>(`${this.baseUrl}/plans`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching plans:', error);
            throw error;
        }
    }

    async getInvoices(): Promise<Invoice[]> {
        try {
            const response = await apiService.get<Invoice[]>(`${this.baseUrl}/invoices`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw error;
        }
    }

    async getPaymentMethods(): Promise<PaymentMethod[]> {
        try {
            const response = await apiService.get<PaymentMethod[]>(`${this.baseUrl}/payment-methods`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            throw error;
        }
    }

    async createSubscription(data: CreateSubscriptionRequest): Promise<Subscription> {
        try {
            const response = await apiService.post<Subscription>(`${this.baseUrl}/subscriptions`, data);
            if (!response.data) {
                throw new Error('No subscription data received');
            }
            return response.data;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }

    async changePlan(data: ChangePlanRequest): Promise<Subscription> {
        try {
            const response = await apiService.put<Subscription>(`${this.baseUrl}/subscriptions`, data);
            if (!response.data) {
                throw new Error('No subscription data received');
            }
            return response.data;
        } catch (error) {
            console.error('Error changing plan:', error);
            throw error;
        }
    }

    async cancelSubscription(immediately: boolean = false): Promise<Subscription> {
        try {
            const response = await apiService.delete<Subscription>(`${this.baseUrl}/subscriptions?immediately=${immediately}`);
            if (!response.data) {
                throw new Error('No subscription data received');
            }
            return response.data;
        } catch (error) {
            console.error('Error canceling subscription:', error);
            throw error;
        }
    }

    async reactivateSubscription(): Promise<Subscription> {
        try {
            const response = await apiService.post<Subscription>(`${this.baseUrl}/subscriptions/reactivate`);
            if (!response.data) {
                throw new Error('No subscription data received');
            }
            return response.data;
        } catch (error) {
            console.error('Error reactivating subscription:', error);
            throw error;
        }
    }

    async addPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
        try {
            const response = await apiService.post<PaymentMethod>(`${this.baseUrl}/payment-methods`, { payment_method_id: paymentMethodId });
            if (!response.data) {
                throw new Error('No payment method data received');
            }
            return response.data;
        } catch (error) {
            console.error('Error adding payment method:', error);
            throw error;
        }
    }

    async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
        try {
            await apiService.put(`${this.baseUrl}/payment-methods/${paymentMethodId}/default`);
        } catch (error) {
            console.error('Error setting default payment method:', error);
            throw error;
        }
    }

    async removePaymentMethod(paymentMethodId: string): Promise<void> {
        try {
            await apiService.delete(`${this.baseUrl}/payment-methods/${paymentMethodId}`);
        } catch (error) {
            console.error('Error removing payment method:', error);
            throw error;
        }
    }

    async getBillingPortalUrl(): Promise<string> {
        try {
            const response = await apiService.get<{ url: string }>(`${this.baseUrl}/portal`);
            if (!response.data) {
                throw new Error('No portal URL received');
            }
            return response.data.url;
        } catch (error) {
            console.error('Error getting billing portal URL:', error);
            throw error;
        }
    }

    async getCheckoutUrl(planId: string, interval: 'month' | 'year' = 'month'): Promise<string> {
        try {
            const response = await apiService.post<{ url: string }>(`${this.baseUrl}/checkout`, { plan_id: planId, interval });
            if (!response.data) {
                throw new Error('No checkout URL received');
            }
            return response.data.url;
        } catch (error) {
            console.error('Error getting checkout URL:', error);
            throw error;
        }
    }

    async hasFeatureAccess(feature: string): Promise<boolean> {
        try {
            const response = await apiService.get<{ has_access: boolean }>(`${this.baseUrl}/features/${feature}`);
            if (!response.data) {
                return false;
            }
            return response.data.has_access;
        } catch (error) {
            console.error('Error checking feature access:', error);
            return false;
        }
    }
}

export default BillingService.getInstance(); 