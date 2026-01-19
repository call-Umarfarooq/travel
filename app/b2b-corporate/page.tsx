'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function B2BCorporatePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    date: '',
    guests: '',
    preference: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          phone: '',
          company: '',
          date: '',
          guests: '',
          preference: '',
          message: '',
        });
      } else {
        setError(data.error || 'Submission failed');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex  flex-col bg-gray-50">
      <Header color="bg-black/20" />

      <main className="flex-grow max-w-4xl mb-4 mx-auto p-6 sm:p-12 mt-28 bg-white rounded-2xl shadow-sm space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Corporate B2B Inquiry
        </h1>

        <p className="text-center text-gray-700">
          Fill out the form below to get in touch with our corporate team.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary w-full"
            />
            <input
              type="date"
              name="date"
              placeholder="Date of Event"
              value={formData.date}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="guests"
              placeholder="Estimated Number of Guests"
              value={formData.guests}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary w-full"
            />
            <input
              type="text"
              name="preference"
              placeholder="Event Preference"
              value={formData.preference}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary w-full"
            />
          </div>

          <textarea
            name="message"
            placeholder="Message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary w-full"
          ></textarea>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">Form submitted successfully!</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#F85E46] hover:bg-[#e54d36] text-white font-medium rounded-md"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}