'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { useRouter } from 'next/navigation';
import { countryCodes } from '@/lib/countryCodes';

// Make sure to add your public key to .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CartPage() {
  const { items, removeFromCart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [buyerInfo, setBuyerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+971', // Default to UAE
  });

  const handleBuyerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBuyerInfo({ ...buyerInfo, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    // Basic validation
    if (!buyerInfo.email) {
       setError("Please enter your email address.");
       return;
    }
    setError(null);

    // Create Payment Intent
    try {
        const res = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, amount: cartTotal }),
        });
        const data = await res.json();
        if (data.clientSecret) {
            setClientSecret(data.clientSecret);
        } else {
            setError("Failed to initialize payment. Please try again.");
        }
    } catch (err) {
        console.error(err);
        setError("Network error. Please try again.");
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
      // Save order to database
      try {
          const res = await fetch('/api/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  items,
                  buyerInfo,
                  paymentIntentId,
                  totalAmount: cartTotal
              })
          });
          const json = await res.json();
          if (json.success) {
              clearCart();
              router.push('/booking/success');
          } else {
              setError("Payment successful but failed to save booking. Please contact support.");
          }
      } catch (err) {
          console.error(err);
          setError("Order saving failed.");
      }
  };

  const appearance = {
    theme: 'stripe' as const,
  };
  
  const options: any = {
    clientSecret: clientSecret || '',
    appearance,
    defaultValues: {
      billingDetails: {
        name: `${buyerInfo.firstName} ${buyerInfo.lastName}`.trim(),
        email: buyerInfo.email,
        phone: `${buyerInfo.countryCode}${buyerInfo.phone}`,
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header color="bg-black/20" />
      
      <main className="max-w-7xl mx-auto px-4 pb-12 pt-32">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
              <Link href="/" className="text-[#F85E46] font-bold hover:underline">Continue Browsing</Link>
           </div>
        ) : (
           <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                
                {/* Buyer Information */}
                <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Buyer Information</h2>
                    <p className="text-gray-500 text-sm mb-6">We'll use this information to send you confirmation and updates about your booking</p>
                    
                    {/* Login Banner */}
                    <div className="bg-gray-100 rounded-lg p-3 text-center mb-6 text-sm text-gray-600">
                        <span className="font-bold">Login</span> or <span className="font-bold">Sign Up</span> for a faster checkout.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">First Name</label>
                            <input type="text" name="firstName" value={buyerInfo.firstName} onChange={handleBuyerChange} className="w-full bg-gray-200 border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-[#F85E46]" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name</label>
                            <input type="text" name="lastName" value={buyerInfo.lastName} onChange={handleBuyerChange} className="w-full bg-gray-200 border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-[#F85E46]" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Email <span className="text-red-500">*</span></label>
                         <input type="email" name="email" value={buyerInfo.email} onChange={handleBuyerChange} className={`w-full bg-gray-200 border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-[#F85E46] ${!buyerInfo.email && error ? 'border border-red-300' : ''}`} />
                         {!buyerInfo.email && error && <p className="text-red-500 text-xs mt-1">Required Field</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                             <label className="block text-xs font-semibold text-gray-500 mb-1">Country Code</label>
                             <select name="countryCode" value={buyerInfo.countryCode} onChange={handleBuyerChange} className="w-full bg-gray-200 border-none rounded-md px-4 py-3">
                                {countryCodes.map((c) => (
                                    <option key={`${c.code}-${c.country}`} value={c.code}>
                                        {c.code} ({c.country})
                                    </option>
                                ))}
                             </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                            <input type="tel" name="phone" value={buyerInfo.phone} onChange={handleBuyerChange} className="w-full bg-gray-200 border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-[#F85E46]" />
                        </div>
                    </div>
                </section>

                {/* Cart Items */}
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
                            <button onClick={() => removeFromCart(item.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                            
                            <div className="flex gap-6">
                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                                     {/* Placeholder image if none provided */}
                                    <Image src={item.image || '/images/destination/d-1.jpg'} alt={item.title} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1">{item.title}</h3>
                                    <p className="text-sm text-[#F85E46] font-medium mb-2 flex items-center gap-1">
                                        <span className="text-xs">🏷️</span> {item.optionTitle}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-1">
                                           <span>📅</span> {new Date(item.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                           <span>⏰</span> {item.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                           <span>👥</span> 
                                           {item.pricingType === 'group' 
                                              ? `${item.items || 1} Items`
                                              : `${(item.adults || 0) + (item.children || 0) + (item.infants || 0)} Guests`
                                           }
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <Link href="#" className="text-gray-400 underline decoration-dashed text-xs">Cancellation policy</Link>
                                        <div className="font-bold text-gray-900 text-lg">{item.totalPrice.toLocaleString()} AED</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>

              {/* Right Column (Sticky Summary) */}
              <div className="w-full lg:w-[350px]">
                  <div className="bg-[#D9D3CC] rounded-xl p-6 sticky top-24">
                      <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-400/30">Order Summary</h3>
                      
                      <div className="space-y-3 mb-6">
                          {items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-700 truncate w-32">{item.title}</span>
                                  <span className="font-bold text-gray-900">{item.totalPrice.toLocaleString()} AED</span>
                              </div>
                          ))}
                      </div>

                      <div className="border-t border-gray-400/30 pt-4 mb-4">
                          <div className="flex justify-between mb-2 text-sm">
                              <span className="text-gray-600">Total Price</span>
                              <span className="font-bold text-gray-900">{cartTotal.toLocaleString()} AED</span>
                          </div>
                          <div className="flex justify-between text-lg">
                              <span className="font-bold text-gray-800">Total Payable</span>
                              <span className="font-bold text-gray-900">{cartTotal.toLocaleString()} AED</span>
                          </div>
                      </div>

                      {/* Payment Section */}
                      {clientSecret ? (
                         <Elements options={options} stripe={stripePromise}>
                             <CheckoutForm amount={cartTotal} buyerInfo={buyerInfo} onSuccess={handlePaymentSuccess} />
                         </Elements>
                      ) : (
                        items.length > 0 && ( /* Ensure checking items properly */
                            <button 
                                onClick={handleCheckout}
                                className="w-full bg-[#F85E46] text-white font-bold py-4 rounded-lg shadow-md hover:bg-[#e54d36] transition duration-200 mb-4"
                            >
                                Confirm & Pay
                            </button>
                        )
                      )}

                      {error && (
                          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md mb-4 border border-red-100">
                             {error}
                          </div>
                      )}
                      
                      <p className="text-[10px] text-gray-500 mb-6 leading-tight">
                          By clicking 'Confirm & Pay' you agree to our <span className="underline cursor-pointer">Privacy & Conditions</span>
                      </p>

                      {/* Trust Badges */}
                      <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                              <span className="bg-white p-1 rounded-full shadow-sm">🔒</span> Secure payment
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="bg-white p-1 rounded-full shadow-sm">💲</span> No hidden costs
                          </div>
                      </div>

                  </div>
              </div>
           </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
