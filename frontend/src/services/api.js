import axios from 'axios';

const api = axios.create({
  baseURL: 'https://global-news-explorer-51qq.onrender.com',
});

export const searchNews = async (query, category, summarize = false) => {
  const response = await api.get('/news/search', {
    params: { q: query, category, summarize }
  });
  return response.data;
};

export const getTrendingNews = async (category) => {
  const response = await api.get('/news/trending', {
    params: { category }
  });
  return response.data;
};

export const addBookmark = async (article) => {
  const response = await api.post('/bookmarks', article);
  return response.data;
};

export const getBookmarks = async () => {
  const response = await api.get('/bookmarks');
  return response.data;
};

export const removeBookmark = async (id) => {
  const response = await api.delete(`/bookmarks/${id}`);
  return response.data;
};

export const checkBookmarkStatus = async (url) => {
  const response = await api.get('/bookmarks/check', { params: { url } });
  return response.data;
};
