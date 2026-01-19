'use client';

import Link from 'next/link';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // B2B Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  // Bookings State
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    fetchInquiries();
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
        const res = await fetch('/api/bookings');
        const json = await res.json();
        if (json.success) {
            setBookings(json.data);
        }
    } catch (error) {
        console.error('Failed to fetch bookings', error);
    } finally {
        setLoadingBookings(false);
    }
  };

  const fetchInquiries = async () => {
    try {
        const res = await fetch('/api/b2b');
        const json = await res.json();
        if (json.success) {
            setInquiries(json.data);
        }
    } catch (error) {
        console.error('Failed to fetch inquiries', error);
    } finally {
        setLoadingInquiries(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus('Please select an image.');
      return;
    }

    setLoading(true);
    setStatus('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('image', file);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        setStatus('Category created successfully!');
        setFormData({ name: '', description: '' });
        setFile(null);
        // Reset file input manually if needed
        const fileInput = document.getElementById('imageInput') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error) {
        console.error(error);
      setStatus('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#181E4B]">Manage Content</h1>
        <div className="flex gap-4 my-8">
             <Link href="/dashboard/create" className="bg-[#F85E46] text-white px-4 py-2 rounded-lg hover:bg-[#e54d36] transition">
                 + New Package
              </Link>
              <Link href="/dashboard/categories/create" className="bg-[#181E4B] text-white px-4 py-2 rounded-lg hover:bg-[#12163a] transition">
              + New Category
              </Link>
              <Link href="/dashboard/manage" className="bg-[#181E4B] text-white px-4 py-2 rounded-lg hover:bg-[#12163a] transition">
              Content
              </Link>
          </div>
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Category Creation Form */}
        {/* <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto">
            <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create Category
            </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
                <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Category Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g. Hiking"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                </div>
                <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Description of the category"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                </div>
                <div className="mb-4">
                <label htmlFor="imageInput" className="block text-sm font-medium text-gray-700">
                    Category Image
                </label>
                <input
                    id="imageInput"
                    name="image"
                    type="file"
                    accept="image/*"
                    required
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={handleFileChange}
                />
                </div>
            </div>

            <div>
                <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                {loading ? 'Creating...' : 'Create Category'}
                </button>
            </div>
            {status && (
                <div className={`text-center text-sm ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {status}
                </div>
            )}
            </form>
        </div> */}

        {/* Bookings Section */}
        <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                Recent Bookings
            </h2>
            
            {loadingBookings ? (
                <div className="text-center py-8 text-gray-500">Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No bookings yet.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pick Up Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                                        {booking._id.substring(booking._id.length - 6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(booking.date).toLocaleDateString()} <br/>
                                        <span className="text-xs text-gray-500">{booking.time}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="font-medium">{booking.contactInfo?.firstName} {booking.contactInfo?.lastName}</div>
                                        <div className="text-xs text-gray-500">{booking.contactInfo?.email}</div>
                                        <div className="text-xs text-gray-500">{booking.contactInfo?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="max-w-[150px] truncate" title={booking.contactInfo?.pickupLocation || 'Not provided'}>
                                            {booking.contactInfo?.pickupLocation || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="font-medium text-gray-900 truncate max-w-[150px]" title={booking.title}>{booking.title}</div>
                                        <div className="text-xs text-blue-500">{booking.optionTitle}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.guestDetails?.totalGuests || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        {booking.pricing?.totalPrice?.toLocaleString()} AED
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${
                                                booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {booking.paymentStatus || 'Pending'}
                                            </span>
                                            <span className="text-[10px] text-gray-500 uppercase">
                                                {(booking.paymentMethod === 'pay_later' || booking.paymentMethod === 'cash' || booking.paymentIntentId?.startsWith('pay_later_')) 
                                                    ? 'User will pay by cash' 
                                                    : 'Card'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* B2B Inquiries Section */}
        <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                B2B Inquiries & Partnerships
            </h2>
            
            {loadingInquiries ? (
                <div className="text-center py-8 text-gray-500">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No inquiries yet.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {inquiries.map((inquiry) => (
                                <tr key={inquiry._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {inquiry.companyName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {inquiry.fullName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <a href={`mailto:${inquiry.businessEmail}`} className="text-indigo-600 hover:underline">
                                           {inquiry.businessEmail}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {inquiry.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {inquiry.country}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={inquiry.message}>
                                        {inquiry.message}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
