'use client';

import { useState, useCallback } from 'react';
import billingService from '../services/billing.service';
import type {
    BillingInfo,
    SubscriptionPlan,
    Subscription,
    Invoice,
    PaymentMethod,
    CreateSubscriptionRequest,
    ChangePlanRequest
} from '../services/billing.service';

interface UseBillingReturn {
    // Estado
    billingInfo: BillingInfo | null;
    plans: SubscriptionPlan[];
    invoices: Invoice[];
    paymentMethods: PaymentMethod[];
    isLoading: boolean;
    error: string | null;

    // Acciones
    fetchBillingInfo: () => Promise<void>;
    fetchPlans: () => Promise<void>;
    fetchInvoices: () => Promise<void>;
    fetchPaymentMethods: () => Promise<void>;
    createSubscription: (data: CreateSubscriptionRequest) => Promise<Subscription>;
    changePlan: (data: ChangePlanRequest) => Promise<Subscription>;
    cancelSubscription: (immediately?: boolean) => Promise<Subscription>;
    reactivateSubscription: () => Promise<Subscription>;
    addPaymentMethod: (paymentMethodId: string) => Promise<PaymentMethod>;
    setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
    removePaymentMethod: (paymentMethodId: string) => Promise<void>;
    getBillingPortalUrl: () => Promise<string>;
    getCheckoutUrl: (planId: string, interval?: 'month' | 'year') => Promise<string>;
    hasFeatureAccess: (feature: string) => Promise<boolean>;
}

export function useBilling(): UseBillingReturn {
    const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBillingInfo = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await billingService.getBillingInfo();
            setBillingInfo(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar información de facturación');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchPlans = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await billingService.getAvailablePlans();
            setPlans(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar planes');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await billingService.getInvoices();
            setInvoices(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar facturas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchPaymentMethods = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await billingService.getPaymentMethods();
            setPaymentMethods(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar métodos de pago');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createSubscription = useCallback(async (data: CreateSubscriptionRequest): Promise<Subscription> => {
        setIsLoading(true);
        setError(null);
        try {
            const subscription = await billingService.createSubscription(data);
            // Actualizar información de facturación
            await fetchBillingInfo();
            return subscription;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear suscripción');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchBillingInfo]);

    const changePlan = useCallback(async (data: ChangePlanRequest): Promise<Subscription> => {
        setIsLoading(true);
        setError(null);
        try {
            const subscription = await billingService.changePlan(data);
            // Actualizar información de facturación
            await fetchBillingInfo();
            return subscription;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cambiar plan');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchBillingInfo]);

    const cancelSubscription = useCallback(async (immediately: boolean = false): Promise<Subscription> => {
        setIsLoading(true);
        setError(null);
        try {
            const subscription = await billingService.cancelSubscription(immediately);
            // Actualizar información de facturación
            await fetchBillingInfo();
            return subscription;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cancelar suscripción');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchBillingInfo]);

    const reactivateSubscription = useCallback(async (): Promise<Subscription> => {
        setIsLoading(true);
        setError(null);
        try {
            const subscription = await billingService.reactivateSubscription();
            // Actualizar información de facturación
            await fetchBillingInfo();
            return subscription;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al reactivar suscripción');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchBillingInfo]);

    const addPaymentMethod = useCallback(async (paymentMethodId: string): Promise<PaymentMethod> => {
        setIsLoading(true);
        setError(null);
        try {
            const paymentMethod = await billingService.addPaymentMethod(paymentMethodId);
            // Actualizar métodos de pago
            await fetchPaymentMethods();
            return paymentMethod;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al agregar método de pago');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchPaymentMethods]);

    const setDefaultPaymentMethod = useCallback(async (paymentMethodId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await billingService.setDefaultPaymentMethod(paymentMethodId);
            // Actualizar métodos de pago
            await fetchPaymentMethods();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al establecer método de pago por defecto');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchPaymentMethods]);

    const removePaymentMethod = useCallback(async (paymentMethodId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await billingService.removePaymentMethod(paymentMethodId);
            // Actualizar métodos de pago
            await fetchPaymentMethods();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar método de pago');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchPaymentMethods]);

    const getBillingPortalUrl = useCallback(async (): Promise<string> => {
        try {
            const url = await billingService.getBillingPortalUrl();
            return url;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al obtener URL del portal de facturación');
            throw err;
        }
    }, []);

    const getCheckoutUrl = useCallback(async (planId: string, interval: 'month' | 'year' = 'month'): Promise<string> => {
        try {
            const url = await billingService.getCheckoutUrl(planId, interval);
            return url;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al obtener URL de checkout');
            throw err;
        }
    }, []);

    const hasFeatureAccess = useCallback(async (feature: string): Promise<boolean> => {
        try {
            return await billingService.hasFeatureAccess(feature);
        } catch (err) {
            console.error('Error checking feature access:', err);
            return false;
        }
    }, []);

    return {
        // Estado
        billingInfo,
        plans,
        invoices,
        paymentMethods,
        isLoading,
        error,

        // Acciones
        fetchBillingInfo,
        fetchPlans,
        fetchInvoices,
        fetchPaymentMethods,
        createSubscription,
        changePlan,
        cancelSubscription,
        reactivateSubscription,
        addPaymentMethod,
        setDefaultPaymentMethod,
        removePaymentMethod,
        getBillingPortalUrl,
        getCheckoutUrl,
        hasFeatureAccess,
    };
} 