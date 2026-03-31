const axios = require('axios');

const HF_API_URL =
  'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

/**
 * Generate a short summary for a news article using HuggingFace BART model
 */
const summarizeText = async (text) => {
  if (!text || text.trim().length < 50) {
    return null;
  }

  // Truncate to 1024 chars to stay within model limits
  const truncated = text.slice(0, 1024);

  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: truncated,
        parameters: {
          max_length: 80,
          min_length: 30,
          do_sample: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    const summary =
      response.data?.[0]?.summary_text || response.data?.summary_text;
    return summary || null;
  } catch (error) {
    // HuggingFace model may be loading (503) — fail silently
    if (error.response?.status === 503) {
      console.warn('HuggingFace model loading, skipping summary');
    } else {
      console.error('HuggingFace summarization error:', error.message);
    }
    return null;
  }
};

/**
 * Add AI summaries to an array of articles (in parallel, with graceful failure)
 */
const addSummariesToArticles = async (articles) => {
  const withSummaries = await Promise.all(
    articles.map(async (article) => {
      const textToSummarize =
        article.content || article.description || article.title;
      const summary = await summarizeText(textToSummarize);
      return { ...article, summary };
    })
  );
  return withSummaries;
};

module.exports = { summarizeText, addSummariesToArticles };
