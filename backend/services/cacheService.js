const NewsCache = require('../models/NewsCache');

let mongoAvailable = true;

// Detect if MongoDB is connected
mongoose_check = () => {
  try {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
};

/**
 * Build a consistent cache key from search params
 */
const buildCacheKey = (query, category, type = 'search') => {
  return `${type}:${query.toLowerCase().trim()}:${category.toLowerCase()}`;
};

/**
 * Get cached articles if available and not expired
 */
const getCached = async (cacheKey) => {
  if (!mongoose_check()) return null;
  try {
    const cached = await NewsCache.findOne({ cacheKey });
    if (!cached) return null;

    // Check if expired (belt-and-suspenders alongside TTL index)
    if (new Date() > cached.expiresAt) {
      await NewsCache.deleteOne({ cacheKey });
      return null;
    }

    console.log(`📦 Cache HIT for key: ${cacheKey}`);
    return cached.articles;
  } catch (err) {
    console.error('Cache read error:', err.message);
    return null;
  }
};

/**
 * Store articles in cache with 10-minute expiry
 */
const setCached = async (cacheKey, articles) => {
  if (!mongoose_check()) return;
  try {
    await NewsCache.findOneAndUpdate(
      { cacheKey },
      {
        cacheKey,
        articles,
        fetchedAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { upsert: true, new: true }
    );
    console.log(`💾 Cached ${articles.length} articles for key: ${cacheKey}`);
  } catch (err) {
    console.error('Cache write error:', err.message);
  }
};

/**
 * Remove duplicate articles by URL
 */
const deduplicateArticles = (articles) => {
  const seen = new Set();
  return articles.filter((article) => {
    if (!article.url || seen.has(article.url)) return false;
    seen.add(article.url);
    return true;
  });
};

/**
 * Sort articles by publishedAt descending (latest first)
 */
const sortByDate = (articles) => {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
};

module.exports = { buildCacheKey, getCached, setCached, deduplicateArticles, sortByDate };
