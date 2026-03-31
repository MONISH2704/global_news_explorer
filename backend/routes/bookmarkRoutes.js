const express = require('express');
const router = express.Router();
const {
  addBookmark,
  getBookmarks,
  removeBookmark,
  checkBookmark,
} = require('../controllers/bookmarkController');

// GET /api/bookmarks
router.get('/', getBookmarks);

// GET /api/bookmarks/check?url=<url>
router.get('/check', checkBookmark);

// POST /api/bookmarks
router.post('/', addBookmark);

// DELETE /api/bookmarks/:id
router.delete('/:id', removeBookmark);

module.exports = router;
