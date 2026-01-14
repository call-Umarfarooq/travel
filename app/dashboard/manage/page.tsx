'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManageContentPage() {
  const [activeTab, setActiveTab] = useState<'packages' | 'categories'>('packages');
  const [packages, setPackages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pkgRes = await fetch('/api/packages');
      const pkgJson = await pkgRes.json();
      if (pkgJson.success) setPackages(pkgJson.data);

      const catRes = await fetch('/api/categories');
      const catJson = await catRes.json();
      if (catJson.success) setCategories(catJson.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'packages' | 'categories') => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/${type}?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        alert('Deleted successfully');
        fetchData(); // Refresh list
      } else {
        alert('Failed to delete: ' + json.error);
      }
    } catch (err) {
      console.error('Delete error', err);
      alert('An error occurred during deletion');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#181E4B]">Manage Content</h1>
        <div className="flex gap-4">
             <Link href="/dashboard/create" className="bg-[#F85E46] text-white px-4 py-2 rounded-lg hover:bg-[#e54d36] transition">
                + New Package
             </Link>
             <Link href="/dashboard/categories/create" className="bg-[#181E4B] text-white px-4 py-2 rounded-lg hover:bg-[#12163a] transition">
                + New Category
             </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('packages')}
          className={`pb-4 px-2 text-lg font-medium transition-colors ${activeTab === 'packages' ? 'border-b-2 border-[#F85E46] text-[#F85E46]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Packages
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`pb-4 px-2 text-lg font-medium transition-colors ${activeTab === 'categories' ? 'border-b-2 border-[#F85E46] text-[#F85E46]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Categories
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === 'packages' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700">Image</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {packages.map((pkg) => (
                    <tr key={pkg._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-12 rounded-md overflow-hidden bg-gray-100">
                          {pkg.image && <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{pkg.title}</td>
                      <td className="px-6 py-4 text-gray-600">{pkg.category?.name || 'Uncategorized'}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{pkg.price} AED</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link 
                           href={`/dashboard/create?id=${pkg._id}`}
                           className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(pkg._id, 'packages')}
                          className="text-red-500 hover:text-red-700 font-medium text-sm ml-4"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && (
                     <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No packages found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700">Image</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Description</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                         <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                           {cat.image && <Image src={cat.image} alt={cat.name} fill className="object-cover" />}
                         </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                      <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{cat.description}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {/* Categories Edit not fully implemented yet, maybe just link to a generic page or show alert */}
                        <Link 
                           href={`/dashboard/categories/create?id=${cat._id}`}
                           className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(cat._id, 'categories')}
                          className="text-red-500 hover:text-red-700 font-medium text-sm ml-4"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                     <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No categories found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
