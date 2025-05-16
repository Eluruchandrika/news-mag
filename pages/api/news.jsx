import axios from 'axios';

const cache = new Map();

export default async function handler(req, res) {
  try {
    const { category = 'general', page = 1 } = req.query;
    const cacheKey = `${category}-${page}`;
    const cacheExpiry = 10 * 60 * 1000; // 10 minutes

    if (cache.has(cacheKey)) {
      const { timestamp, data } = cache.get(cacheKey);
      if (Date.now() - timestamp < cacheExpiry) {
        return res.status(200).json(data);
      }
      cache.delete(cacheKey);
    }

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        category,
        page,
        pageSize: 12,
        apiKey,
      },
    });

    const data = response.data;

    cache.set(cacheKey, { timestamp: Date.now(), data });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching news:', error?.response?.status || error.message);

    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }

    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
