import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use clearer env var names for backend
const NEWS_API_KEY = process.env.NEWS_API_KEY;       
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;

// Check if keys are loaded properly
if (!NEWS_API_KEY) {
  console.error('ERROR: NEWS_API_KEY is not defined in .env');
  process.exit(1);
}
if (!UNSPLASH_API_KEY) {
  console.error('ERROR: UNSPLASH_API_KEY is not defined in .env');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Route to fetch news data
app.get('/api/news', async (req, res) => {
  const category = req.query.category || 'general';
  const page = req.query.page || 1;
  const pageSize = 12;

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${encodeURIComponent(
        category
      )}&page=${page}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch news data' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('News fetch error:', err);
    res.status(500).json({ error: 'Server error while fetching news' });
  }
});

// Route to fetch image from Unsplash
app.get('/api/image', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
        query
      )}&client_id=${UNSPLASH_API_KEY}`
    );

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch image' });
    }

    const data = await response.json();
    res.json({ imageUrl: data?.urls?.regular });
  } catch (err) {
    console.error('Image fetch error:', err);
    res.status(500).json({ error: 'Server error while fetching image' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
