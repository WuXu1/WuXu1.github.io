import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NewsCard.css';

export default function NewsCard({ newsItem }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (newsItem.appID) {
      navigate(`/app/${newsItem.appID}`);
    }
  };

  const dateStr = new Date(newsItem.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <article className="news-card" onClick={handleClick} style={{ cursor: newsItem.appID ? 'pointer' : 'default' }}>
      <div className="news-image-container" style={{ backgroundColor: `#${newsItem.tintColor || 'e5e5e7'}` }}>
        {newsItem.imageURL && <img src={newsItem.imageURL} alt={newsItem.title} className="news-image" />}
      </div>
      <div className="news-content">
        <span className="news-date">{dateStr}</span>
        <h3 className="news-title" style={{ color: `#${newsItem.tintColor || '000000'}` }}>{newsItem.title}</h3>
        <p className="news-caption">{newsItem.caption}</p>
      </div>
    </article>
  );
}
