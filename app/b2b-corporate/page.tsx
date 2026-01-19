'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Header */}
      <Header color="bg-black/20" />

      {/* Page Content */}
      <main className="flex-grow max-w-4xl mx-auto p-6 sm:p-12 bg-white mt-28 rounded-2xl shadow-sm space-y-8">
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Terms and Conditions
        </h1>

        {/* General */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">General</h2>
          <p>
            Desert Smart Tourism provides tour, travel, transportation, attraction tickets, 
            and related tourism services in the United Arab Emirates. All bookings are 
            subject to availability and confirmation.
          </p>
        </section>

        {/* Booking and Payment */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Booking and Payment</h2>
          <p>
            Full or partial payment may be required at the time of booking, depending on 
            the service. Prices are quoted in AED unless stated otherwise. Payments once 
            made are considered confirmation of acceptance of these terms.
          </p>
        </section>

        {/* Pricing and Changes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Pricing and Changes</h2>
          <p>
            Prices may change due to fuel costs, government fees, taxes, or operational reasons. 
            Desert Smart Tourism reserves the right to amend itineraries, schedules, or vehicles 
            if required for safety or operational reasons.
          </p>
        </section>

        {/* Guest Responsibilities */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Guest Responsibilities</h2>
          <p>
            Guests must provide accurate personal details at the time of booking. Guests must 
            follow safety instructions provided by guides, drivers, or staff. Desert Smart 
            Tourism is not responsible for delays caused by guests arriving late or failing 
            to comply with instructions.
          </p>
        </section>

        {/* Health and Safety */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Health and Safety</h2>
          <p>
            Certain activities such as desert safaris, dune bashing, quad biking, and adventure 
            experiences involve inherent risks. Guests participate at their own risk and must 
            disclose any medical conditions, pregnancy, or health concerns prior to booking.
          </p>
        </section>

        {/* Liability */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Liability</h2>
          <p>
            Desert Smart Tourism acts as an agent for hotels, transport providers, attraction 
            operators, and other third parties. We are not liable for loss, injury, delay, 
            accident, or damage caused by factors beyond our control, including weather, 
            mechanical issues, or third party service providers.
          </p>
        </section>

        {/* Force Majeure */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Force Majeure</h2>
          <p>
            Desert Smart Tourism shall not be held responsible for cancellations or changes 
            caused by events beyond our control such as natural disasters, government 
            restrictions, strikes, or emergencies.
          </p>
        </section>

        {/* Privacy Policy */}
        <section className="space-y-4 pt-8 border-t border-gray-300">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Privacy Policy
          </h1>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">Information We Collect</h2>
          <p>
            We may collect personal information such as name, phone number, email address, 
            passport details if required for bookings, and payment information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">Use of Information</h2>
          <p>
            Your information is used only to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Process bookings and payments</li>
              <li>Communicate booking confirmations and updates</li>
              <li>Improve our services</li>
              <li>Meet legal and regulatory requirements</li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">Data Protection</h2>
          <p>
            All personal information is stored securely and accessed only by authorized personnel. 
            We do not sell, rent, or trade your personal data to third parties.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">Third Party Sharing</h2>
          <p>
            Your information may be shared only with trusted partners such as hotels, transport 
            providers, and attraction operators when necessary to deliver booked services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">Cookies</h2>
          <p>
            Our website may use cookies to improve user experience and analyze website traffic. 
            You may disable cookies through your browser settings.
          </p>
        </section>

        {/* Cancellation and Refund Policy */}
        <section className="space-y-4 pt-8 border-t border-gray-300">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Cancellation and Refund Policy
          </h1>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">Cancellation by Guest</h2>
          <p>
            Cancellation charges depend on the type of service booked:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>More than 48 hours before service: full refund or rescheduling, subject to supplier terms</li>
              <li>24 to 48 hours before service: partial refund or credit, depending on the service</li>
              <li>Less than 24 hours before service or no show: no refund</li>
            </ul>
          </p>
          <p>
            Certain tickets, attractions, private tours, and special event bookings may be non refundable once confirmed.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">Cancellation by Desert Smart Tourism</h2>
          <p>
            If a service is canceled by Desert Smart Tourism due to operational reasons, weather conditions, or safety concerns, 
            guests will be offered a full refund or alternative service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">Refund Processing</h2>
          <p>
            Approved refunds will be processed to the original payment method within 7 to 14 working days, 
            subject to bank processing timelines.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 pt-4">Non Refundable Items</h2>
          <p>
            Government tickets, attraction tickets, special promotions, and discounted offers may be strictly non refundable.
          </p>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}