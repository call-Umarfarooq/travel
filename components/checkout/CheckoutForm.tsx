'use client';

import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export default function CheckoutForm({ amount, buyerInfo, onSuccess }: { 
  amount: number; 
  buyerInfo: { firstName: string; lastName: string; email: string; phone: string; countryCode: string };
  onSuccess: (paymentIntentId: string) => void 
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
        return_url: `${window.location.origin}/booking/success`,
        payment_method_data: {
            billing_details: {
                name: `${buyerInfo.firstName} ${buyerInfo.lastName}`.trim(),
                email: buyerInfo.email,
                phone: `${buyerInfo.countryCode}${buyerInfo.phone}`,
                address: {
                    country: 'AE' // defaulting to AE or mapping based on code if possible, but optional
                }
            }
        }
      },
      redirect: 'if_required', // Handle redirect manually or stay on page if no redirect needed (e.g. card)
    });

    if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }
        setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful!
        setMessage("Payment successful!");
        onSuccess(paymentIntent.id);
        // We will handle the redirect or success logic in the parent (saving order)
    } else {
        setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="mt-4">
      <PaymentElement 
        id="payment-element" 
        options={{ 
            layout: "tabs",
            defaultValues: {
                billingDetails: {
                    name: `${buyerInfo.firstName} ${buyerInfo.lastName}`.trim(),
                    email: buyerInfo.email,
                    phone: `${buyerInfo.countryCode}${buyerInfo.phone}`,
                }
            }
        } as any} 
      />
      {message && <div id="payment-message" className="text-red-500 text-sm mt-2">{message}</div>}
      
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-[#F85E46] text-white font-bold py-4 rounded-lg shadow-md hover:bg-[#e54d36] transition duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner">Processing...</div> : `Pay ${amount.toLocaleString()} AED`}
        </span>
      </button>
    </form>
  );
}
