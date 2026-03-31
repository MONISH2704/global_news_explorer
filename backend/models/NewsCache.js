const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  url: String,
  image: String,
  publishedAt: String,
  source: {
    name: String,
    url: String,
  },
  summary: String,
});

const newsCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true, index: true },
  articles: [articleSchema],
  fetchedAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    index: { expireAfterSeconds: 0 },
  },
});

module.exports = mongoose.model('NewsCache', newsCacheSchema);
