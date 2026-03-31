const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    url: { type: String, required: true, unique: true },
    image: String,
    source: {
      name: String,
      url: String,
    },
    publishedAt: String,
    summary: String,
    category: { type: String, default: 'general' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);
