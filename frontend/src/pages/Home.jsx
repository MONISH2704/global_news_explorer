import React, { useState, useEffect } from 'react';
import { searchNews, getTrendingNews } from '../services/api';
import SearchBar from '../components/SearchBar';
import NewsCard from '../components/NewsCard';
import { Loader2, TrendingUp, Filter, AlertCircle } from 'lucide-react';

const CATEGORIES = ['General', 'Technology', 'Sports', 'Business', 'Entertainment', 'Health', 'Science'];

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState(false);
  const [sourceData, setSourceData] = useState({ fetchType: 'trending', source: '' });

  useEffect(() => {
    fetchNews(activeCategory, searchQuery);
  }, [activeCategory]);

  const fetchNews = async (category, query = '') => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (query) {
        data = await searchNews(query, category.toLowerCase(), aiSummaryEnabled);
        setSourceData({ fetchType: 'search', source: data.source });
      } else {
        data = await getTrendingNews(category.toLowerCase());
        setSourceData({ fetchType: 'trending', source: data.source });
      }
      setNews(data.articles || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch news');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchNews(activeCategory, query);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Search Header */}
      <section className="text-center py-12 px-4 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000&auto=format&fit=crop')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Global News Explorer</h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Stay informed with real-time headlines from reliable sources globally. Experience ultra-fast, curated news delivery.
          </p>
          <SearchBar onSearch={handleSearch} />
          <div className="mt-4 flex flex-wrap justify-center gap-4 items-center text-sm font-medium">
            <label className="flex items-center gap-2 cursor-pointer bg-white/20 backdrop-blur hover:bg-white/30 px-4 py-2 rounded-full transition-colors border border-white/20">
              <input
                type="checkbox"
                checked={aiSummaryEnabled}
                onChange={(e) => setAiSummaryEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900 accent-blue-500"
              />
              Enable AI Summaries (BART)
            </label>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
            {searchQuery ? <Filter className="w-6 h-6 text-blue-500" /> : <TrendingUp className="text-blue-500 w-6 h-6" />}
            {searchQuery ? `Results for "${searchQuery}"` : 'Top Headlines'}
          </h2>
          {!loading && !error && sourceData.source && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              Source: {sourceData.source.toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 transform shadow-sm ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-blue-500/25 dark:shadow-blue-900/50 scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                fetchNews(activeCategory, '');
              }}
              className="px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-all shadow-sm"
            >
              Clear Search
            </button>
          )}
        </div>
      </section>

      {/* News Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
            <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 dark:text-red-300 max-w-md">{error}</p>
            <button 
              onClick={() => fetchNews(activeCategory, searchQuery)}
              className="mt-6 px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-center shadow-sm">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {news.map((item, index) => (
              <NewsCard key={`${item.url}-${index}`} article={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
