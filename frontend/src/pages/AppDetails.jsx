import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download } from 'lucide-react';
import './AppDetails.css';

export default function AppDetails({ apps, plusApps, loading }) {
  const { bundleId } = useParams();
  const navigate = useNavigate();

  if (loading) {
    return <div className="page loading-state">Loading...</div>;
  }

  // Find app in either library
  const allApps = [...apps, ...plusApps];
  const app = allApps.find(a => a.bundleIdentifier === bundleId);

  if (!app) {
    return (
      <div className="page error-state">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} /> Back
        </button>
        <div style={{ marginTop: '50px', textAlign: 'center' }}>App not found.</div>
      </div>
    );
  }

  const handleDownload = () => {
    window.location.href = app.downloadURL;
  };

  const handleAltStore = () => {
    window.location.href = `altstore://install?url=${encodeURIComponent(app.downloadURL)}`;
  };

  const formattedSize = app.size ? (app.size / 1024 / 1024).toFixed(1) + ' MB' : 'Unknown Size';
  const versionDate = app.versionDate ? new Date(app.versionDate).toLocaleDateString() : 'Unknown Date';

  return (
    <div className="page app-details-page">
      <header className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={28} strokeWidth={2.5} /> 
          <span>Discover</span>
        </button>
      </header>

      <main className="details-main">
        {/* Top Info Section */}
        <section className="app-hero">
          <div className="hero-icon" style={{ backgroundColor: app.tintColor || '#e5e5e7' }}>
            {app.iconURL ? (
              <img src={app.iconURL} alt={app.name} />
            ) : (
              <svg viewBox="0 0 66 66"><rect width="66" height="66" rx="14" fill="#e5e5e7"/></svg>
            )}
          </div>
          <div className="hero-info">
            <h1 className="hero-title">{app.name}</h1>
            <h2 className="hero-developer">{app.developerName}</h2>
            <p className="hero-subtitle">{app.subtitle}</p>
            <div className="hero-actions" style={{ display: 'flex', gap: '10px' }}>
              <button className="hero-get" onClick={handleDownload}>GET</button>
              <button className="hero-altstore" onClick={handleAltStore}>ALTSTORE</button>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="stats-strip">
          <div className="stat">
            <span className="stat-value">4.8</span>
            <span className="stat-label">★ Rating</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-value">{formattedSize}</span>
            <span className="stat-label">Size</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-value">{app.version}</span>
            <span className="stat-label">Version</span>
          </div>
        </section>

        {/* Screenshots */}
        {app.screenshotURLs && app.screenshotURLs.length > 0 && (
          <section className="screenshots-section">
            <div className="screenshots-scroll">
              {app.screenshotURLs.map((url, i) => (
                <img key={i} src={url} alt={`Screenshot ${i + 1}`} className="screenshot-img" />
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        {app.localizedDescription && (
          <section className="description-section">
            <p>{app.localizedDescription}</p>
          </section>
        )}

        {/* What's New / Version Info */}
        <section className="whats-new-section">
          <h3>What's New</h3>
          <div className="version-header">
            <span className="version-num">Version {app.version}</span>
            <span className="version-date">{versionDate}</span>
          </div>
          <p className="version-notes">{app.versionDescription || 'Includes minor bug fixes and performance improvements.'}</p>
        </section>
      </main>
    </div>
  );
}
