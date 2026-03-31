const gnewsService = require('../services/gnewsService');
const newsApiService = require('../services/newsApiService');
const { addSummariesToArticles } = require('../services/huggingfaceService');
const {
  buildCacheKey,
  getCached,
  setCached,
  deduplicateArticles,
  sortByDate,
} = require('../services/cacheService');

/**
 * Fetch news with GNews primary → NewsAPI fallback logic
 */
const fetchWithFallback = async (type, query, category) => {
  let articles = [];
  let source = 'gnews';

  try {
    if (type === 'search') {
      articles = await gnewsService.searchNews(query, category);
    } else {
      articles = await gnewsService.getTrending(category);
    }
  } catch (gnewsErr) {
    console.warn('GNews failed, falling back to NewsAPI:', gnewsErr.message);
  }

  // Fallback to NewsAPI if GNews returned nothing or errored
  if (!articles || articles.length === 0) {
    try {
      source = 'newsapi';
      if (type === 'search') {
        articles = await newsApiService.searchNews(query, category);
      } else {
        articles = await newsApiService.getTrending(category);
      }
    } catch (newsApiErr) {
      console.error('NewsAPI also failed:', newsApiErr.message);
      throw new Error('All news sources failed. Please try again later.');
    }
  }

  return { articles, source };
};

/**
 * GET /api/news/search?q=<query>&category=<cat>&summarize=true
 */
const searchNews = async (req, res) => {
  try {
    const { q: query = '', category = 'general', summarize = 'false' } = req.query;

    if (!query.trim()) {
      return res.status(400).json({ success: false, message: 'Search query is required.' });
    }

    const cacheKey = buildCacheKey(query, category, 'search');

    // Check cache first
    const cached = await getCached(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        source: 'cache',
        count: cached.length,
        articles: cached,
      });
    }

    // Fetch fresh data
    const { articles, source } = await fetchWithFallback('search', query, category);

    // Deduplicate + sort by latest
    let processed = sortByDate(deduplicateArticles(articles));

    // Optional AI summarization (async, won't block if disabled)
    if (summarize === 'true') {
      processed = await addSummariesToArticles(processed);
    }

    // Store in cache
    await setCached(cacheKey, processed);

    return res.json({
      success: true,
      source,
      count: processed.length,
      articles: processed,
    });
  } catch (error) {
    console.error('searchNews controller error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/news/trending?category=<cat>
 */
const getTrending = async (req, res) => {
  try {
    const { category = 'general' } = req.query;
    const cacheKey = buildCacheKey('trending', category, 'trending');

    const cached = await getCached(cacheKey);
    if (cached) {
      return res.json({ success: true, source: 'cache', articles: cached });
    }

    const { articles, source } = await fetchWithFallback('trending', '', category);
    let processed = sortByDate(deduplicateArticles(articles));

    await setCached(cacheKey, processed);

    return res.json({ success: true, source, articles: processed });
  } catch (error) {
    console.error('getTrending controller error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { searchNews, getTrending };
