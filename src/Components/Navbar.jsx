import React, { useState } from 'react';

export const Navbar = ({ setCategory }) => {
  const [active, setActive] = useState('technology');

  const categories = [
    { label: 'Technology', key: 'technology' },
    { label: 'Business', key: 'business' },
    { label: 'Health', key: 'health' },
    { label: 'Science', key: 'science' },
    { label: 'Sports', key: 'sports' },
    { label: 'Entertainment', key: 'entertainment' },
  ];

  const handleClick = (key) => {
    setCategory(key);
    setActive(key);
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-dark sticky-top shadow-lg"
      style={{ padding: '1rem', borderBottom: '2px solid #ff4b2b' }}
    >
      <div className="container-fluid">
        <a
          href="#"
          className="navbar-brand d-flex align-items-center"
          style={{
            fontWeight: 'bold',
            fontSize: '1.7rem',
            color: '#fff',
            textShadow: '2px 2px 6px rgba(255, 75, 43, 0.7)',
            letterSpacing: '1.5px',
          }}
          aria-label="News Mag Brand"
        >
          <span
            className="badge bg-gradient rounded-pill shadow"
            style={{
              background:
                'linear-gradient(45deg, #ff4b2b, #ff6e7f)',
              color: '#fff',
              fontSize: '1rem',
              padding: '0.5rem 1.2rem',
              userSelect: 'none',
              boxShadow: '0 4px 15px rgba(255,75,43,0.6)',
            }}
          >
            News Mag
          </span>
        </a>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ filter: 'invert(100%)' }} // white hamburger icon
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">
            {categories.map(({ label, key }) => (
              <li key={key} className="nav-item">
                <button
                  type="button"
                  className={`nav-link btn btn-sm fw-semibold px-3 py-2 rounded-pill position-relative overflow-hidden ${
                    active === key ? 'active-category' : 'text-light'
                  }`}
                  onClick={() => handleClick(key)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff4b2b';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 15px rgba(255, 75, 43, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    if (active === key) {
                      e.currentTarget.style.backgroundColor = '#ff4b2b';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 12px rgba(255, 75, 43, 0.6)';
                    } else {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                  style={{
                    transition:
                      'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    backgroundColor: active === key ? '#ff4b2b' : 'transparent',
                    color: active === key ? '#fff' : '#ddd',
                    boxShadow:
                      active === key
                        ? '0 6px 12px rgba(255, 75, 43, 0.6)'
                        : 'none',
                  }}
                >
                  {label}
                  {active === key && (
                    <span
                      className="position-absolute"
                      style={{
                        bottom: '4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '50%',
                        height: '3px',
                        borderRadius: '3px',
                        backgroundColor: '#fff',
                        animation: 'underlinePulse 1.5s ease-in-out infinite',
                      }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes underlinePulse {
          0%, 100% {
            opacity: 0.7;
            width: 50%;
          }
          50% {
            opacity: 1;
            width: 70%;
          }
        }
        .nav-link:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255,75,43,0.6);
          border-radius: 9999px;
        }
      `}</style>
    </nav>
  );
};