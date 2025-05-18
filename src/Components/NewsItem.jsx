import React, { useState } from 'react';
import fallbackImage from '../assets/image.png'; // Local fallback image
import { fetchImageFromUnsplash } from '../api/fetchImage';

function NewsItem({ title, description, imageUrl, url }) {
  const [shared, setShared] = useState(false);
  const [imgSrc, setImgSrc] = useState(imageUrl || fallbackImage);
  const [triedUnsplash, setTriedUnsplash] = useState(false);

  const handleShare = async () => {
    if (!navigator.clipboard) {
      alert('Clipboard API not supported in this browser.');
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleImageError = async () => {
    if (!triedUnsplash) {
      setTriedUnsplash(true);
      const unsplashUrl = await fetchImageFromUnsplash(title);
      if (unsplashUrl) {
        setImgSrc(unsplashUrl);
        return;
      }
    }
    setImgSrc(fallbackImage);
  };

  return (
    <div
      className="card text-light mb-4 shadow-lg rounded-4 animate__animated animate__fadeInUp w-100 mx-auto news-item-card"
      style={{
        maxWidth: '345px',
        background: 'linear-gradient(to bottom right, #1c1c1c, #2e2e2e)',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <img
        src={imgSrc}
        onError={handleImageError}
        className="card-img-top rounded-top-4"
        alt="news"
        style={{
          objectFit: 'cover',
          height: '200px',
          width: '100%',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      />

      <div className="card-body">
        <h5 className="card-title fw-semibold text-truncate" title={title}>
          {title}
        </h5>
        <p
          className="card-text"
          style={{ fontSize: '0.95rem', color: '#ccc', minHeight: '60px' }}
        >
          {description ? `${description.slice(0, 100)}...` : 'No description available.'}
        </p>

        <div className="d-flex justify-content-between align-items-center flex-sm-wrap gap-2 mt-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light flex-grow-1"
            style={{
              borderRadius: '30px',
              padding: '6px 18px',
              fontWeight: '500',
              transition: 'all 0.3s ease-in-out',
              minWidth: '130px',
            }}
          >
            Read More →
          </a>

          <button
            onClick={handleShare}
            className="btn share-button flex-grow-1"
            style={{
              borderRadius: '30px',
              fontWeight: '600',
              fontSize: '0.9rem',
              padding: '6px 16px',
              color: shared ? '#fff' : '#0dcaf0',
              background: shared ? '#28a745' : 'transparent',
              border: `1px solid ${shared ? '#28a745' : '#0dcaf0'}`,
              transition: 'all 0.3s ease-in-out',
              boxShadow: shared ? '0 0 12px #28a74588' : '0 0 8px #0dcaf044',
              minWidth: '130px',
            }}
            aria-live="polite"
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {shared ? 'Copied!' : ' Share'}
          </button>
        </div>
      </div>

      <style>{`
        .news-item-card:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }
        .news-item-card {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default NewsItem;
