import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { addBookmark, removeBookmark, checkBookmarkStatus } from '../services/api';
import { motion } from 'framer-motion';

const NewsCard = ({ article, onRemove }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (article.url) {
        try {
          const res = await checkBookmarkStatus(article.url);
          setIsBookmarked(res.bookmarked);
          if (res.id) setBookmarkId(res.id);
        } catch (err) {
          console.error('Error checking bookmark status', err);
        }
      }
    };
    checkStatus();
  }, [article.url]);

  const toggleBookmark = async (e) => {
    e.preventDefault(); // Prevent opening link if clicking bookmark
    setLoading(true);
    try {
      if (isBookmarked) {
        // Find ID and delete (in a real app, you might need to fetch the ID or store it)
        // Here we assume we got it from checkStatus or it's passed if it's from the bookmark page
        const idToRemove = article._id || bookmarkId;
        if (idToRemove) {
          await removeBookmark(idToRemove);
          setIsBookmarked(false);
          if (onRemove) onRemove(idToRemove);
        }
      } else {
        const res = await addBookmark(article);
        setIsBookmarked(true);
        setBookmarkId(res.bookmark._id);
      }
    } catch (error) {
      console.error('Bookmark toggle failed', error);
      alert('Failed to toggle bookmark. Make sure backend is running with MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 h-full"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={!imageError && article.image ? article.image : fallbackImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-sm">
            {article.source?.name || 'News Source'}
          </span>
        </div>
        <button
          onClick={toggleBookmark}
          disabled={loading}
          className="absolute top-4 right-4 p-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-full shadow-sm hover:scale-110 transition-transform focus:outline-none"
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
        </button>
      </div>

      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {formattedDate}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        
        {article.summary ? (
          <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center gap-1.5 mb-1 text-sm font-semibold text-blue-700 dark:text-blue-400">
              <Sparkles className="w-4 h-4" /> AI Summary
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {article.summary}
            </p>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
            {article.description || 'No description available.'}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Read Full Article <ExternalLink className="w-4 h-4 ml-1.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
