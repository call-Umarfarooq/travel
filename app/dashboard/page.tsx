'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
        (document.getElementById('imageInput') as HTMLInputElement).value = '';
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
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-md">
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
      </div>
    </div>
  );
}
