export default async function handler(req, res) {
  const { title } = req.query;
  const apiKey = 'LTlVl6vaEoAbdfsBgIsqa-WQ1vYEBybuv9RDQjc4owg';  // Unsplash API Key

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(title)}&client_id=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash');
    }

    const data = await response.json();
    const imageUrl = data.results[0]?.urls?.regular || null;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Unsplash fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch image from Unsplash' });
  }
}
