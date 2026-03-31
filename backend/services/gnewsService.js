const axios = require('axios');

const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

/**
 * Normalize GNews article to standard format
 */
const normalizeArticle = (article) => ({
  title: article.title || '',
  description: article.description || '',
  content: article.content || '',
  url: article.url || '',
  image: article.image || null,
  publishedAt: article.publishedAt || new Date().toISOString(),
  source: {
    name: article.source?.name || 'Unknown',
    url: article.source?.url || '',
  },
  summary: null,
});

/**
 * Search news by query using GNews API
 */
const searchNews = async (query, category = 'general', lang = 'en', max = 20) => {
  try {
    const params = {
      apikey: process.env.GNEWS_API_KEY,
      q: query,
      lang,
      max,
      sortby: 'publishedAt',
    };

    if (category && category !== 'general') {
      params.topic = mapCategoryToTopic(category);
    }

    const response = await axios.get(`${GNEWS_BASE_URL}/search`, {
      params,
      timeout: 10000,
    });

    const articles = response.data?.articles || [];
    return articles.map(normalizeArticle);
  } catch (error) {
    console.error('GNews search error:', error.message);
    throw error;
  }
};

/**
 * Get top headlines / trending news
 */
const getTrending = async (category = 'general', lang = 'en', max = 10) => {
  try {
    const params = {
      apikey: process.env.GNEWS_API_KEY,
      lang,
      max,
      topic: mapCategoryToTopic(category),
    };

    const response = await axios.get(`${GNEWS_BASE_URL}/top-headlines`, {
      params,
      timeout: 10000,
    });

    const articles = response.data?.articles || [];
    return articles.map(normalizeArticle);
  } catch (error) {
    console.error('GNews trending error:', error.message);
    throw error;
  }
};

/**
 * Map UI category to GNews topic
 */
const mapCategoryToTopic = (category) => {
  const map = {
    general: 'breaking-news',
    technology: 'technology',
    sports: 'sports',
    business: 'business',
    entertainment: 'entertainment',
    health: 'health',
    science: 'science',
    world: 'world',
    nation: 'nation',
  };
  return map[category.toLowerCase()] || 'breaking-news';
};

module.exports = { searchNews, getTrending };
