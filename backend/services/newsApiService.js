const axios = require('axios');

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

/**
 * Normalize NewsAPI article to standard format
 */
const normalizeArticle = (article) => ({
  title: article.title || '',
  description: article.description || '',
  content: article.content || '',
  url: article.url || '',
  image: article.urlToImage || null,
  publishedAt: article.publishedAt || new Date().toISOString(),
  source: {
    name: article.source?.name || 'Unknown',
    url: '',
  },
  summary: null,
});

/**
 * Search news by query using NewsAPI (fallback)
 */
const searchNews = async (query, category = 'general', pageSize = 20) => {
  try {
    const params = {
      apiKey: process.env.NEWS_API_KEY,
      q: query,
      pageSize,
      sortBy: 'publishedAt',
      language: 'en',
    };

    const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
      params,
      timeout: 10000,
    });

    const articles = (response.data?.articles || []).filter(
      (a) => a.title && a.title !== '[Removed]' && a.url
    );

    return articles.map(normalizeArticle);
  } catch (error) {
    console.error('NewsAPI search error:', error.message);
    throw error;
  }
};

/**
 * Get top headlines / trending news
 */
const getTrending = async (category = 'general', pageSize = 10) => {
  try {
    const params = {
      apiKey: process.env.NEWS_API_KEY,
      pageSize,
      sortBy: 'publishedAt',
      language: 'en',
      country: 'us',
    };

    if (category && category !== 'general') {
      params.category = category;
    }

    const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
      params,
      timeout: 10000,
    });

    const articles = (response.data?.articles || []).filter(
      (a) => a.title && a.title !== '[Removed]' && a.url
    );

    return articles.map(normalizeArticle);
  } catch (error) {
    console.error('NewsAPI trending error:', error.message);
    throw error;
  }
};

module.exports = { searchNews, getTrending };
