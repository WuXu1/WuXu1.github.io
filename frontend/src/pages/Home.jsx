import React, { useState } from 'react';
import { LayoutGrid, Library, Layers, Download, Compass, Search, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppCard from '../components/AppCard';
import NewsCard from '../components/NewsCard';

export default function Home({ apps, plusApps, news = [], loading, darkMode, setDarkMode }) {
  const [currentView, setCurrentView] = useState('Discover');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const allApps = [...apps, ...plusApps];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.trim().toLowerCase());
  };

  const getFilteredApps = () => {
    let filtered = allApps;
    
    if (currentView === 'Library') {
      filtered = [...apps];
    } else if (currentView === 'LibraryPlus') {
      filtered = [...plusApps];
    }

    if (searchQuery && currentView === 'Search') {
      filtered = filtered.filter(app => {
        const str = `${app.name} ${app.developerName} ${app.subtitle || ''}`.toLowerCase();
        return str.includes(searchQuery);
      });
    }

    // Sort alphabetically
    if (currentView === 'Library' || currentView === 'LibraryPlus' || currentView === 'Search') {
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
          <div className="premium-toggle">
            <div className={`toggle-slider ${currentView === 'LibraryPlus' ? 'right' : ''}`}></div>
            <button 
              className={currentView === 'Library' ? 'active' : ''} 
              onClick={() => setCurrentView('Library')}
            >
              WuXu's Library
            </button>
            <button 
              className={currentView === 'LibraryPlus' ? 'active' : ''} 
              onClick={() => setCurrentView('LibraryPlus')}
            >
              WuXu's Library++
            </button>
          </div>
        </div>

        <div className="top-actions" role="navigation" aria-label="Updates">
          <button className={`top-action ${currentView === 'Updates' ? 'active' : ''}`} aria-pressed={currentView === 'Updates'} onClick={() => setCurrentView('Updates')}>
            <Download size={27} strokeWidth={currentView === 'Updates' ? 3 : 2.35} />
            <span style={{ fontWeight: currentView === 'Updates' ? 600 : 400 }}>Updates</span>
          </button>
        </div>
      </header>

      {currentView === 'Discover' && !loading && (
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
                      {apps.slice(0, 4).map((app, index) => (
                        <AppCard key={`new-${app.bundleIdentifier}-${index}`} app={app} isHidden={false} />
                      ))}
                    </div>
                  </section>
                  <section className="section">
                    <h3>WuXu's Choice</h3>
                    <div className="mini-grid">
                      {plusApps.slice(0, 4).map((app, index) => (
                        <AppCard key={`editor-${app.bundleIdentifier}-${index}`} app={app} isHidden={false} />
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

            {currentView === 'Search' && (
              <div>
                <div className="search-container">
                  <label className="search-wrap" aria-label="Search apps">
                    <Search size={22} strokeWidth={2} />
                    <input 
                      id="search" 
                      type="search" 
                      placeholder="Search Apps & Games..." 
                      autoComplete="off" 
                      value={searchQuery}
                      onChange={handleSearchChange}
                      autoFocus
                    />
                  </label>
                </div>
                <section className="cards" style={{ padding: '0 20px' }}>
                  {displayedApps.map((app, index) => (
                    <AppCard key={`search-${app.bundleIdentifier}-${index}`} app={app} isHidden={false} />
                  ))}
                  {displayedApps.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>No results found.</p>}
                </section>
              </div>
            )}

            {['Library', 'LibraryPlus'].includes(currentView) && (
              <section className="cards" style={{ padding: '0 20px' }}>
                {displayedApps.map((app, index) => (
                  <AppCard key={`grid-${app.bundleIdentifier}-${index}`} app={app} isHidden={false} />
                ))}
              </section>
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
          <span>Discover</span>
        </button>
        <button className={currentView === 'Search' ? 'active' : ''} onClick={() => setCurrentView('Search')} aria-label="Search">
          <Search size={24} strokeWidth={currentView === 'Search' ? 2.5 : 2} />
          <span>Search</span>
        </button>
        <button className={currentView === 'Settings' ? 'active' : ''} onClick={() => setCurrentView('Settings')} aria-label="Settings">
          <Settings size={24} strokeWidth={currentView === 'Settings' ? 2.5 : 2} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}
