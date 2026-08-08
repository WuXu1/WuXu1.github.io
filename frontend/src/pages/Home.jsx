import React, { useState } from 'react';
import { LayoutGrid, Library, Layers, Download, Compass, Search, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppCard from '../components/AppCard';
import NewsCard from '../components/NewsCard';

export default function Home({ apps, news = [], loading, darkMode, setDarkMode }) {
  const [currentView, setCurrentView] = useState('Discover');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getFilteredApps = () => {
    let filtered = apps;

    const q = searchQuery.trim().toLowerCase();
    if (q && currentView === 'Library') {
      filtered = filtered.filter(app => {
        const str = `${app.name} ${app.developerName} ${app.subtitle || ''}`.toLowerCase();
        return str.includes(q);
      });
    }

    // Sort alphabetically
    if (currentView === 'Library') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  };

  const displayedApps = getFilteredApps();

  const showcaseRef = React.useRef(null);

  React.useEffect(() => {
    if (currentView !== 'Discover' || news.length === 0) return;
    
    const interval = setInterval(() => {
      if (showcaseRef.current) {
        const container = showcaseRef.current;
        const scrollAmount = container.clientWidth;
        // If we are at the end, scroll back to 0
        if (container.scrollLeft + scrollAmount >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [currentView, news]);

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <h1>WuXu's Library</h1>
          <p>The most Up-To-Date IPA Libraries on AltStore</p>
        </div>
        
        <div className="top-center" role="navigation" aria-label="Library categories">
          {/* Toggle moved to Settings */}
        </div>

        <div className="top-actions" role="navigation" aria-label="Updates">
          <button className={`top-action ${currentView === 'Updates' ? 'active' : ''}`} aria-pressed={currentView === 'Updates'} onClick={() => setCurrentView('Updates')}>
            <Download size={27} strokeWidth={currentView === 'Updates' ? 3 : 2.35} />
            <span style={{ fontWeight: currentView === 'Updates' ? 600 : 400 }}>Updates</span>
          </button>
        </div>
      </header>

      {currentView === 'Discover' && !loading && (
        <>
        <section className="hero-banner" style={{ margin: '20px 20px 10px', padding: '30px 20px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(216,26,20,0.08) 0%, rgba(216,26,20,0.03) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(216,26,20,0.15)' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>Get Started</h2>
          <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '15px', maxWidth: '400px', lineHeight: 1.4 }}>
            Add our repositories to your package manager to instantly install and update your favorite apps.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="altstore://source?url=https://wuxu1.github.io/wuxu-complete.json" style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #40C4B5 0%, #2BA093 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(51,181,166,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to AltStore
            </a>
            <a href="sidestore://source?url=https://wuxu1.github.io/wuxu-complete.json" style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(139,92,246,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to SideStore
            </a>
            <a href="scarlet://source?url=https://wuxu1.github.io/wuxu-complete-scarlet.json" style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #FF2400 0%, #D91000 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(255,36,0,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to Scarlet
            </a>
            <a href="feather://source?url=https://wuxu1.github.io/wuxu-complete.json" style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(14,165,233,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to Feather
            </a>
            <a href="trollapps://source?url=https://wuxu1.github.io/wuxu-complete.json" style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to TrollApps
            </a>
          </div>
        </section>
        <section 
          className="showcase" 
          aria-label="Featured releases" 
          ref={showcaseRef} 
          style={{ 
            scrollBehavior: 'smooth', 
            overflowX: 'auto', 
            scrollSnapType: 'x mandatory',
            minWidth: 'auto', // Override the max-content from CSS so it can scroll
            width: '100%',
            paddingRight: '20px' // Add some padding to the end of the scroll
          }}
        >
          {news.slice(0, 5).map((item, index) => (
            <article 
              key={index} 
              className="feature" 
              style={{ 
                backgroundImage: `url(${item.imageURL})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                cursor: item.appID ? 'pointer' : 'default',
                backgroundColor: item.tintColor ? `#${item.tintColor}` : '#e5e5e7',
                width: '430px',
                flexShrink: 0,
                scrollSnapAlign: 'start'
              }}
              onClick={() => item.appID && navigate(`/app/${item.appID}`)}
            >
              {/* Dark overlay to make text legible */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)' }}></div>
              
              <h2 style={{ 
                position: 'absolute', 
                left: '20px', // Reverting to 20px now that the double-margin is fixed
                bottom: '15px', 
                margin: 0, 
                color: 'white', 
                fontSize: '25px', 
                letterSpacing: '-.9px',
                fontWeight: 750, 
                lineHeight: 1,
                zIndex: 4 
              }}>{item.title}</h2>
            </article>
          ))}
          {news.length === 0 && (
            <div style={{ padding: '20px', color: '#8e8e93' }}>No featured releases at the moment.</div>
          )}
        </section>
        </>
      )}

      <main className="catalog" style={{ paddingTop: currentView === 'Discover' ? '10px' : '20px' }}>
        {loading ? (
          <div className="loading-state">Loading apps...</div>
        ) : (
          <>
            {currentView === 'Discover' && (
              <>
                <div className="sections">
                  <section className="section">
                    <h3>New This Month</h3>
                    <div className="mini-grid">
                      {[...displayedApps]
                        .sort((a, b) => new Date(b.versionDate || 0) - new Date(a.versionDate || 0))
                        .slice(0, 6)
                        .map((app, index) => (
                          <AppCard key={`new-${app.bundleIdentifier}-${index}`} app={app} isHidden={false} />
                      ))}
                    </div>
                  </section>
                  <section className="section">
                    <h3>WuXu's Picks</h3>
                    <div className="mini-grid">
                      {["Spotify++ (NEW)", "YouTube++", "Instagram++", "Angry Birds Star Wars", "TikTok++", "Duolingo++"]
                        .map(name => apps.find(a => a.name === name))
                        .filter(Boolean)
                        .map((app, index) => (
                          <AppCard key={`pick-${app.bundleIdentifier}-${index}`} app={app} isHidden={false} />
                      ))}
                    </div>
                  </section>
                </div>
              </>
            )}

            {currentView === 'Updates' && (
              <section className="news-list" style={{ padding: '0 20px' }}>
                {news.map((item, index) => (
                  <NewsCard key={`news-${index}`} newsItem={item} />
                ))}
                {news.length === 0 && <p style={{ textAlign: 'center', color: '#8e8e93', marginTop: '40px' }}>No updates available.</p>}
              </section>
            )}

            {currentView === 'Library' && (
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                  <label className="search-wrap" aria-label="Search apps" style={{ display: 'flex', width: '100%', maxWidth: '340px' }}>
                    <Search size={20} strokeWidth={2.35} style={{ marginRight: '10px' }} />
                    <input 
                      id="search" 
                      type="search" 
                      placeholder="Search Apps & Games..." 
                      autoComplete="off" 
                      value={searchQuery}
                      onChange={handleSearchChange}
                      autoFocus
                      style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '17px' }}
                    />
                  </label>
                  <button 
                    onClick={() => window.open('https://github.com/WuXu1/WuXu1.github.io/issues', '_blank')} 
                    style={{ padding: '0 20px', height: '48px', borderRadius: '12px', background: 'var(--get-bg)', color: 'var(--get-text)', fontWeight: 650, fontSize: '15px', display: 'flex', alignItems: 'center', transition: 'background 0.2s', border: 'none', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
                  >
                    Request an app
                  </button>
                </div>
                <section className="cards">
                  {displayedApps.map((app, index) => (
                    <AppCard key={`search-${app.bundleIdentifier}-${index}`} app={app} isHidden={false} />
                  ))}
                  {displayedApps.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>No results found.</p>}
                </section>
              </div>
            )}

            {currentView === 'Settings' && (
              <div className="settings-container">
                <h2>Settings</h2>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Dark Mode</h3>
                    <p>Toggle deep dark appearance</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={darkMode} 
                      onChange={(e) => setDarkMode(e.target.checked)} 
                    />
                    <span className="switch-slider"></span>
                  </label>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Primary navigation">
        <button className={currentView === 'Discover' ? 'active' : ''} onClick={() => setCurrentView('Discover')} aria-label="Discover">
          <Compass size={24} strokeWidth={currentView === 'Discover' ? 2.5 : 2} />
          <span data-text="Discover">Discover</span>
        </button>
        <button className={currentView === 'Library' ? 'active' : ''} onClick={() => setCurrentView('Library')} aria-label="Library">
          <Library size={24} strokeWidth={currentView === 'Library' ? 2.5 : 2} />
          <span data-text="Library">Library</span>
        </button>
        <button className={currentView === 'Settings' ? 'active' : ''} onClick={() => setCurrentView('Settings')} aria-label="Settings">
          <Settings size={24} strokeWidth={currentView === 'Settings' ? 2.5 : 2} />
          <span data-text="Settings">Settings</span>
        </button>
      </nav>
    </div>
  );
}
