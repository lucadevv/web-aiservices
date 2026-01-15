'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBilling } from './hooks/useBilling';
import Button from '@/shared/components/ui/Button';

export default function BillingPage() {
    const {
        billingInfo,
        plans,
        invoices,
        paymentMethods,
        isLoading,
        error,
        fetchBillingInfo,
        fetchPlans,
        fetchInvoices,
        fetchPaymentMethods,
        cancelSubscription,
        reactivateSubscription,
        getBillingPortalUrl,
        getCheckoutUrl,
    } = useBilling();

    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        fetchBillingInfo();
        fetchPlans();
        fetchInvoices();
        fetchPaymentMethods();
    }, [fetchBillingInfo, fetchPlans, fetchInvoices, fetchPaymentMethods]);

    const handleUpgradePlan = async (planId: string) => {
        try {
            const checkoutUrl = await getCheckoutUrl(planId);
            window.location.href = checkoutUrl;
        } catch (error) {
            console.error('Error getting checkout URL:', error);
        }
    };

    const handleManageBilling = async () => {
        try {
            const portalUrl = await getBillingPortalUrl();
            window.open(portalUrl, '_blank');
        } catch (error) {
            console.error('Error getting billing portal URL:', error);
        }
    };

    const handleCancelSubscription = async () => {
        try {
            await cancelSubscription(false); // Cancel at period end
            setShowCancelModal(false);
        } catch (error) {
            console.error('Error canceling subscription:', error);
        }
    };

    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    };

    const getPlanFeatures = (plan: any) => {
        return [
            `${plan.features.executions.toLocaleString()} ejecuciones/mes`,
            `${plan.features.workflows} workflows`,
            `${plan.features.apiCalls.toLocaleString()} llamadas API/día`,
            `${plan.features.storage} MB de almacenamiento`,
            `Soporte ${plan.features.support}`,
        ];
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando información de facturación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
                    <p className="text-gray-600 mt-1">
                        Gestiona tu suscripción y métodos de pago
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={handleManageBilling}
                        disabled={!billingInfo}
                    >
                        Gestionar Facturación
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Current Plan */}
            {billingInfo?.subscription && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan Actual</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-900">
                                {plans.find(p => p.id === billingInfo.subscription?.plan)?.name || 'Plan Actual'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {formatCurrency(billingInfo.subscription.amountCents, billingInfo.subscription.currency)}
                                /mes
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Estado</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${billingInfo.subscription.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : billingInfo.subscription.status === 'trialing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {billingInfo.subscription.status === 'active' ? 'Activo' :
                                    billingInfo.subscription.status === 'trialing' ? 'En Prueba' :
                                        billingInfo.subscription.status === 'past_due' ? 'Pago Pendiente' :
                                            billingInfo.subscription.status === 'cancelled' ? 'Cancelado' : 'Inactivo'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Próxima facturación</p>
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(billingInfo.subscription.currentPeriodEnd).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>

                    {billingInfo.subscription.status === 'active' && (
                        <div className="mt-4 flex space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCancelModal(true)}
                            >
                                Cancelar Suscripción
                            </Button>
                        </div>
                    )}

                    {billingInfo.subscription.status === 'cancelled' && (
                        <div className="mt-4">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={reactivateSubscription}
                            >
                                Reactivar Suscripción
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Usage */}
            {billingInfo && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Uso del Mes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-600">Ejecuciones</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {billingInfo.usageThisMonth?.executions.toLocaleString() || '0'}
                            </p>
                            <p className="text-sm text-gray-500">
                                de {billingInfo.planLimits?.monthlyExecutions.toLocaleString() || '0'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Llamadas API</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {billingInfo.usageThisMonth?.apiCalls.toLocaleString() || '0'}
                            </p>
                            <p className="text-sm text-gray-500">
                                de {billingInfo.planLimits?.apiCallsPerDay.toLocaleString() || '0'}/día
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Almacenamiento</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {billingInfo.usageThisMonth?.storage || '0'} MB
                            </p>
                            <p className="text-sm text-gray-500">
                                de {(billingInfo.planLimits?.storageGB || 0) * 1024} MB
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Available Plans */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Planes Disponibles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`border rounded-lg p-6 ${billingInfo?.subscription?.plan === plan.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200'
                                }`}
                        >
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {formatCurrency(plan.priceCents, plan.currency)}
                                </p>
                                <p className="text-sm text-gray-600">por mes</p>
                            </div>

                            <ul className="mt-6 space-y-3">
                                {getPlanFeatures(plan).map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6">
                                {billingInfo?.subscription?.plan === plan.id ? (
                                    <Button variant="outline" disabled className="w-full">
                                        Plan Actual
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        onClick={() => handleUpgradePlan(plan.id)}
                                        className="w-full"
                                    >
                                        {billingInfo?.subscription ? 'Cambiar Plan' : 'Seleccionar Plan'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Methods */}
            {paymentMethods.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pago</h2>
                    <div className="space-y-4">
                        {paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center">
                                    {method.card && (
                                        <div className="flex items-center">
                                            <div className="w-8 h-6 bg-gray-200 rounded mr-3"></div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    •••• •••• •••• {method.card.last4}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Expira {method.card.expMonth}/{method.card.expYear}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {method.isDefault && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Por defecto
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Invoices */}
            {invoices.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Facturas Recientes</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Monto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {invoices.slice(0, 5).map((invoice) => (
                                    <tr key={invoice.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(invoice.created).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {invoice.description || 'Suscripción AirServices'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                invoice.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {invoice.status === 'paid' ? 'Pagada' :
                                                    invoice.status === 'open' ? 'Pendiente' :
                                                        invoice.status === 'void' ? 'Anulada' : 'No Cobrada'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(invoice.amountPaid, invoice.currency)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {invoice.hostedInvoiceUrl && (
                                                <a
                                                    href={invoice.hostedInvoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Ver Factura
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Cancelar Suscripción
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                ¿Estás seguro de que quieres cancelar tu suscripción?
                                Tendrás acceso hasta el final del período actual.
                            </p>
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleCancelSubscription}
                                    className="flex-1"
                                >
                                    Confirmar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 