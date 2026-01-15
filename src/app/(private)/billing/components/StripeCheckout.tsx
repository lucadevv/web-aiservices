'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '@/shared/components/ui/Button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
    amount: number;
    currency: string;
    planName: string;
    onSuccess: (paymentIntent: any) => void;
    onError: (error: string) => void;
    onCancel: () => void;
}

function CheckoutForm({ amount, currency, planName, onSuccess, onError, onCancel }: StripeCheckoutProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Error al cargar el formulario de pago');
            setIsLoading(false);
            return;
        }

        try {
            // Crear payment intent en el backend
            const response = await fetch('/api/billing/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    currency,
                    planName,
                }),
            });

            const { clientSecret } = await response.json();

            // Confirmar el pago con Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (stripeError) {
                setError(stripeError.message || 'Error al procesar el pago');
            } else if (paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent);
            }
        } catch (err) {
            setError('Error al procesar el pago');
            onError('Error al procesar el pago');
        } finally {
            setIsLoading(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Información de Pago
                </h3>
                <div className="border border-gray-300 rounded-lg p-4">
                    <CardElement options={cardElementOptions} />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total a pagar:</span>
                    <span className="text-lg font-semibold text-gray-900">
                        {new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: currency.toUpperCase(),
                        }).format(amount / 100)}
                    </span>
                </div>
            </div>

            <div className="flex space-x-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    disabled={!stripe}
                    className="flex-1"
                >
                    {isLoading ? 'Procesando...' : 'Pagar'}
                </Button>
            </div>
        </form>
    );
}

export default function StripeCheckout(props: StripeCheckoutProps) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm {...props} />
        </Elements>
    );
} 