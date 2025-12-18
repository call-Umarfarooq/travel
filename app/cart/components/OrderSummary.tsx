'use client';

import React, { useState } from 'react';

interface OrderSummaryProps {
  tourName?: string;
  tourPrice?: number;
  currency?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  tourName = 'City Tour',
  tourPrice = 0.00,
  currency = 'AED',
}) => {
  const [promoCode, setPromoCode] = useState('');

  return (
    <div className="bg-[#D9D9D9] rounded-xl p-6 mt-28">
      <h3 className="text-[20px] text-[#000000] mb-4">Order Summary</h3>
      
      {/* Separator */}
      <hr className="border-t border-[#000000] mb-6" />

      {/* Tour Item */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-[20px] text-[#000000]">{tourName}</span>
        <span className="text-[20px] text-[#000000]">{tourPrice.toFixed(2)} {currency}</span>
      </div>

      {/* Separator */}
      <hr className="border-t border-[#000000] mb-6" />

      {/* Promo Code */}
      <div className="mb-6">
        <p className="text-[#DF6951] font-bold text-[20px] mb-3">Have a promo code ?</p>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Prom Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full px-4 py-4 bg-white border-0 rounded-xl text-[#000000] placeholder:text-gray-400 focus:outline-none pr-24"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#F85E46] text-[#000000] text-[20px] rounded-lg hover:bg-[#e54d36] transition-colors">
            Cheak
          </button>
        </div>
      </div>

      {/* Separator */}
      <hr className="border-t border-gray-400 mb-6" />

      {/* Total */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-[20px] text-[#000000]">Total Price</span>
          <span className=" text-[20px] text-[#000000]">{tourPrice.toFixed(2)} {currency}</span>
        </div>
        <div className="flex justify-end">
          <span className=" text-[20px] text-[#000000]">{tourPrice.toFixed(2)} {currency}</span>
        </div>
      </div>

      {/* Separator */}
      <hr className="border-t border-gray-400 mb-6" />

      {/* Accepted Payments */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-[#000000]">Accepted Payments</span>
        <div className="flex gap-2 items-center">
          {/* Visa */}
          <div className="bg-[#1A1F71] text-white text-xs px-3 py-1.5 rounded font-bold tracking-wide">
            VISA
          </div>
          {/* Google Pay */}
          <div className="bg-white border border-gray-200 px-2 py-1.5 rounded flex items-center">
            <span className="text-blue-500 font-medium text-sm">G</span>
            <span className="text-gray-600 font-medium text-sm">Pay</span>
          </div>
          {/* Mastercard */}
          <div className="flex items-center">
            <div className="w-6 h-6 bg-[#EB001B] rounded-full"></div>
            <div className="w-6 h-6 bg-[#F79E1B] rounded-full -ml-3"></div>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <button className="w-full py-4 bg-[#F85E46] text-white text-lg font-bold rounded-xl hover:bg-[#e54d36] transition-colors mb-4">
        Confirm & pay
      </button>

      {/* Privacy Text */}
      <p className="text-sm text-[#000000]">
        By clicking &apos;Confirm & pay&apos; you agree to our <span className="text-[#F85E46]">Privacy & Conditions</span>
      </p>
    </div>
  );
};

export default OrderSummary;
