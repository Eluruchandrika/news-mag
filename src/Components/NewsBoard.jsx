import React, { useEffect, useState, useCallback } from 'react';
import NewsItem from './NewsItem';

export const NewsBoard = ({ category }) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // track if more articles exist

  // Fetch articles function
  const fetchArticles = useCallback(async (pageNum = 1, categoryParam = category) => {
    setLoading(true);
    const pageSize = 12; // number of articles per page
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${categoryParam}&page=${pageNum}&pageSize=${pageSize}&apiKey=${import.meta.env.VITE_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (pageNum === 1) {
        setArticles(data.articles || []);
      } else {
        setArticles(prev => [...prev, ...(data.articles || [])]);
      }

      // If received less articles than pageSize, no more pages
      setHasMore((data.articles?.length || 0) === pageSize);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Initial fetch and category change
  useEffect(() => {
    setPage(1);
    fetchArticles(1, category);
  }, [category, fetchArticles]);

  // Handle scroll event to load more articles
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 200 && // near bottom
        !loading &&
        hasMore
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // Fetch articles when page changes (except first page which is handled on category change)
  useEffect(() => {
    if (page === 1) return;
    fetchArticles(page, category);
  }, [page, category, fetchArticles]);

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background: '#121212',
        color: '#fff',
        transition: 'background 0.3s ease',
      }}
    >
      <div className="container">
        <h2
          className="text-center mb-5 fw-bold display-5"
          style={{
            color: '#ffffff',
            borderBottom: '2px solid #ff4b2b',
            paddingBottom: '10px',
            width: 'fit-content',
            margin: '0 auto',
          }}
        >
          Latest <span style={{ color: '#ff4b2b' }}>News</span>
        </h2>

        <div className="row gx-4 gy-5 justify-content-center">
          {articles.map((news, index) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
              key={`${news.url}-${index}`}
            >
              <div
                className="news-card-wrapper"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  opacity: 0,
                  transform: 'translateY(20px)',
                  animation: 'slideUpFade 0.6s ease forwards',
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <NewsItem
                  title={news.title}
                  description={news.description}
                  src={news.urlToImage}
                  url={news.url}
                />
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center mt-4">
            <div
              className="spinner-border text-light"
              role="status"
              style={{ width: '3rem', height: '3rem' }}
            ></div>
          </div>
        )}

        {!hasMore && !loading && articles.length > 0 && (
          <p className="text-center mt-4 text-muted">No more articles to load.</p>
        )}
      </div>

      {/* Custom Animation */}
      <style>{`
        @keyframes slideUpFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .news-card-wrapper:hover {
          transform: scale(1.02);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
      `}</style>
    </div>
  );
};
