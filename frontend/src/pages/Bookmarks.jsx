import React, { useState, useEffect } from 'react';
import { getBookmarks, removeBookmark } from '../services/api';
import NewsCard from '../components/NewsCard';
import { Bookmark, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookmarks();
      setBookmarks(data.bookmarks || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemove = (id) => {
    setBookmarks(bookmarks.filter((b) => b._id !== id && b.id !== id));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-gray-900 dark:text-white">
            <Bookmark className="w-8 h-8 text-blue-500 fill-blue-500/20" />
            Saved Articles
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Read your favorite news anytime, anywhere.</p>
        </div>
        <button 
          onClick={fetchBookmarks}
          disabled={loading}
          className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-96 animate-pulse p-4 shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl mb-4"></div>
             <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
             <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
             <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
             <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
           </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/50 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Failed to load bookmarks</h3>
            <p className="text-red-600 dark:text-red-300 max-w-md">{error}</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 text-center">
          <Bookmark className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No bookmarks yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            Articles you bookmark will appear here so you can easily find them later.
          </p>
          <Link 
            to="/" 
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition transform hover:-translate-y-0.5"
          >
            Explore News
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {bookmarks.map((bookmark) => (
            <NewsCard key={bookmark._id} article={bookmark} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
