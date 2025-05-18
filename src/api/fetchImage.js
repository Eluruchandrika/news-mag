/**
 * Calls the backend to get a fallback image from Unsplash.
 *
 * @param {string} query
 * @returns {Promise<string|null>}
 */
export const fetchImageFromUnsplash = async (query) => {
  if (!query || query.trim() === '') return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(`https://news-mag-12sg.onrender.com/api/image?query=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error('Backend failed to fetch Unsplash image.');
      return null;
    }

    const data = await res.json();
    return data.imageUrl || null;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Image fetch request timed out.');
    } else {
      console.error('Error fetching image:', error);
    }
    return null;
  }
};
