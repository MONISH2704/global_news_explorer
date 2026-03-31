const Bookmark = require('../models/Bookmark');

const isMongoAvailable = () => {
  try {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
};

/**
 * POST /api/bookmarks — Save an article
 */
const addBookmark = async (req, res) => {
  if (!isMongoAvailable()) {
    return res.status(503).json({ success: false, message: 'Database unavailable.' });
  }

  try {
    const { title, description, url, image, source, publishedAt, summary, category } = req.body;

    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required.' });
    }

    // Check for duplicate
    const existing = await Bookmark.findOne({ url });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Article already bookmarked.' });
    }

    const bookmark = new Bookmark({ title, description, url, image, source, publishedAt, summary, category });
    await bookmark.save();

    return res.status(201).json({ success: true, message: 'Bookmark saved!', bookmark });
  } catch (error) {
    console.error('addBookmark error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/bookmarks — List all bookmarks
 */
const getBookmarks = async (req, res) => {
  if (!isMongoAvailable()) {
    return res.status(503).json({ success: false, message: 'Database unavailable.' });
  }

  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: bookmarks.length, bookmarks });
  } catch (error) {
    console.error('getBookmarks error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/bookmarks/:id — Remove a bookmark
 */
const removeBookmark = async (req, res) => {
  if (!isMongoAvailable()) {
    return res.status(503).json({ success: false, message: 'Database unavailable.' });
  }

  try {
    const { id } = req.params;
    const deleted = await Bookmark.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Bookmark not found.' });
    }

    return res.json({ success: true, message: 'Bookmark removed.' });
  } catch (error) {
    console.error('removeBookmark error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/bookmarks/check?url=<url> — Check if already bookmarked
 */
const checkBookmark = async (req, res) => {
  if (!isMongoAvailable()) {
    return res.json({ success: true, bookmarked: false });
  }

  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, message: 'URL required.' });

    const exists = await Bookmark.findOne({ url });
    return res.json({ success: true, bookmarked: !!exists, id: exists?._id || null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addBookmark, getBookmarks, removeBookmark, checkBookmark };
