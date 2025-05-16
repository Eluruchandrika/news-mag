const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

/**
 * Fetches an image URL from Unsplash based on the provided search query.
 *
 * @param {string} query - The search term (e.g., news title).
 * @returns {Promise<string|null>} - URL of the image or null if not found.
 */
export const fetchImageFromUnsplash = async (query) => {
  if (!UNSPLASH_KEY) {
    console.error('❌ Unsplash API key is missing.');
    return null;
  }
  
  if (!query || query.trim() === '') {
    return null; // no point searching empty query
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7 seconds timeout
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(query)}&client_id=${UNSPLASH_KEY}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`❌ Unsplash API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    return data?.results?.[0]?.urls?.regular || null;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ Unsplash fetch aborted due to timeout.');
    } else {
      console.error('❌ Unsplash fetch error:', error);
    }
    return null;
  }
};
