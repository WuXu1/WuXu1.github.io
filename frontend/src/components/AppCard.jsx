import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AppCard({ app, isHidden }) {
  const navigate = useNavigate();

  const handleView = (e) => {
    navigate(`/app/${app.bundleIdentifier}`);
  };

  const displayRating = (
    <div className="rating">
      <span className="star">★</span> {app.size ? (app.size / 1024 / 1024).toFixed(1) + ' MB' : '4.8'}
    </div>
  );

  return (
    <article className={`app-card ${isHidden ? 'hidden' : ''}`} data-search={`${app.name} ${app.developerName} ${app.subtitle}`.toLowerCase()}>
      <div className="app-icon" style={{ backgroundColor: app.tintColor || '#e5e5e7' }}>
        {app.iconURL ? (
          <img src={app.iconURL} alt="" />
        ) : (
          <svg viewBox="0 0 66 66"><rect width="66" height="66" rx="14" fill="#e5e5e7"/></svg>
        )}
      </div>
      <div className="details">
        <div className="app-name">{app.name}</div>
        <div className="developer">{app.developerName}</div>
        <div className="category">{app.subtitle || 'App'}</div>
        {displayRating}
      </div>
      <button className="get" onClick={handleView}>VIEW</button>
    </article>
  );
}
