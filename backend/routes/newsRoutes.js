const express = require('express');
const router = express.Router();
const { searchNews, getTrending } = require('../controllers/newsController');

// GET /api/news/search?q=<query>&category=<cat>&summarize=true
router.get('/search', searchNews);

// GET /api/news/trending?category=<cat>
router.get('/trending', getTrending);

module.exports = router;
