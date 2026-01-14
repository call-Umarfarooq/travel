'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';

interface B2BModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const B2BModal: React.FC<B2BModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    businessEmail: '',
    phone: '',
    country: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setFormData({
          fullName: '',
          companyName: '',
          businessEmail: '',
          phone: '',
          country: '',
          message: '',
        });
        setTimeout(() => {
            onClose();
            setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
        console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-scale-in">
        {/* Header */}
        <div className="bg-[#DF6951] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-serif">B2B Partnership & Collaboration</h2>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Proposal Submitted!</h3>
              <p className="text-gray-600">Thank you for reaching out. Our team will review your proposal and get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DF6951] focus:border-transparent outline-none transition-shadow"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DF6951] focus:border-transparent outline-none transition-shadow"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Email *</label>
                  <input
                    type="email"
                    name="businessEmail"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DF6951] focus:border-transparent outline-none transition-shadow"
                    value={formData.businessEmail}
                    onChange={handleChange}
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp *</label>
                    <input
                        type="text"
                        name="phone"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DF6951] focus:border-transparent outline-none transition-shadow"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
              </div>
              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DF6951] focus:border-transparent outline-none transition-shadow"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message / Partnership Proposal *</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DF6951] focus:border-transparent outline-none transition-shadow"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your company and how you'd like to partner with us..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#DF6951] hover:bg-[#c85a43]'
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit Proposal'}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-sm text-center mt-3">Failed to submit. Please try again.</p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default B2BModal;
