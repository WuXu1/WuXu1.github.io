import React, { useState } from 'react';
import { LayoutGrid, Library, Layers, Compass, Search, Settings, Info } from 'lucide-react';
import { FaDiscord, FaTwitter, FaGithub } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import AppCard from '../components/AppCard';
import NewsCard from '../components/NewsCard';

export default function Home({ apps, plusApps, news = [], loading, darkMode, setDarkMode, librarySource, setLibrarySource }) {
  const [currentView, setCurrentView] = useState('Discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [heroSource, setHeroSource] = useState('wuxu-plus');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const allApps = librarySource === 'both' ? [...apps, ...plusApps] :
                  librarySource === 'wuxu' ? [...apps] : [...plusApps];

  const getFilteredApps = () => {
    let filtered = allApps;

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
    
    let animationFrameId;
    const container = showcaseRef.current;
    if (!container) return;
    
    let isUserInteracting = false;
    
    const onTouchStart = () => isUserInteracting = true;
    const onTouchEnd = () => isUserInteracting = false;
    
    container.addEventListener('touchstart', onTouchStart, {passive: true});
    container.addEventListener('touchend', onTouchEnd, {passive: true});
    container.addEventListener('mousedown', onTouchStart, {passive: true});
    container.addEventListener('mouseup', onTouchEnd, {passive: true});
    container.addEventListener('mouseleave', onTouchEnd, {passive: true});

    const scrollStep = () => {
      if (!isUserInteracting) {
        container.scrollLeft += 0.8; // Scrolling speed
        
        // Seamless loop check: if we've scrolled exactly halfway
        if (container.scrollLeft >= (container.scrollWidth / 2)) {
           container.scrollLeft -= (container.scrollWidth / 2);
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('mousedown', onTouchStart);
      container.removeEventListener('mouseup', onTouchEnd);
      container.removeEventListener('mouseleave', onTouchEnd);
    };
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

        <div className="top-actions" role="navigation" aria-label="Socials" style={{ gap: '15px' }}>
          <a href="https://bit.ly/wuxuslibrary-discord" target="_blank" rel="noopener noreferrer" className="top-action" aria-label="Discord" style={{ color: 'var(--text)' }}>
            <FaDiscord size={24} />
          </a>
          <a href="https://bit.ly/wuxustwitter" target="_blank" rel="noopener noreferrer" className="top-action" aria-label="Twitter" style={{ color: 'var(--text)' }}>
            <FaTwitter size={24} />
          </a>
          <a href="https://bit.ly/wuxuslibrary-github" target="_blank" rel="noopener noreferrer" className="top-action" aria-label="GitHub" style={{ color: 'var(--text)' }}>
            <FaGithub size={24} />
          </a>
        </div>
      </header>

      {currentView === 'Discover' && !loading && (
        <>
        <section className="hero-banner" style={{ margin: '20px 20px 10px', padding: '30px 20px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(216,26,20,0.08) 0%, rgba(216,26,20,0.03) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(216,26,20,0.15)' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>Get Started</h2>
          <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '15px', maxWidth: '430px', lineHeight: 1.4 }}>
            Select your desired source library below, then tap a button to add it to your package manager.
          </p>

          <div className="library-selector" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(142,142,147,0.15)', borderRadius: '999px', padding: '3px 3px 3px 12px', marginBottom: '15px', gap: '2px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '6px' }}>Source:</span>
            <button onClick={() => setHeroSource('wuxu-plus')} style={{ whiteSpace: 'nowrap', padding: '4px 16px', borderRadius: '999px', border: 'none', background: heroSource === 'wuxu-plus' ? 'var(--card-bg)' : 'transparent', color: heroSource === 'wuxu-plus' ? 'var(--text)' : 'var(--text-muted)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: heroSource === 'wuxu-plus' ? '0 2px 10px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>WuXu's Library++</button>
            <button onClick={() => setHeroSource('wuxu')} style={{ whiteSpace: 'nowrap', padding: '4px 16px', borderRadius: '999px', border: 'none', background: heroSource === 'wuxu' ? 'var(--card-bg)' : 'transparent', color: heroSource === 'wuxu' ? 'var(--text)' : 'var(--text-muted)', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: heroSource === 'wuxu' ? '0 2px 10px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>WuXu's Library</button>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={`altstore://source?url=https://wuxu1.github.io/${heroSource === 'wuxu' ? 'wuxu-complete.json' : 'wuxu-complete-plus.json'}`} style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #40C4B5 0%, #2BA093 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(51,181,166,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to AltStore
            </a>
            <a href={`sidestore://source?url=https://wuxu1.github.io/${heroSource === 'wuxu' ? 'wuxu-complete.json' : 'wuxu-complete-plus.json'}`} style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(139,92,246,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to SideStore
            </a>
            <a href="scarlet://source?url=https://wuxu1.github.io/wuxu-complete-scarlet.json" style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #FF2400 0%, #D91000 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(255,36,0,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to Scarlet
            </a>
            <a href={`feather://source?url=https://wuxu1.github.io/${heroSource === 'wuxu' ? 'wuxu-complete.json' : 'wuxu-complete-plus.json'}`} style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #8a95fb 0%, #6a76e0 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(121,133,250,0.4)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to Feather
            </a>
            <a href={`trollapps://source?url=https://wuxu1.github.io/${heroSource === 'wuxu' ? 'wuxu-complete.json' : 'wuxu-complete-plus.json'}`} style={{ padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to TrollApps
            </a>
          </div>

          <button 
            onClick={() => setIsInfoModalOpen(true)}
            style={{ marginTop: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Info size={14} />
            What's the difference between WuXu's Library and ++?
          </button>
        </section>
        <section 
          className="showcase" 
          ref={showcaseRef}
          style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            overflowY: 'hidden',
            minWidth: 'auto',
            width: '100%',
            gap: '15px',
            padding: '0 20px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none'  // IE/Edge
          }}
        >
          {[...news.slice(0, 5), ...news.slice(0, 5)].map((item, index) => (
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
                flexShrink: 0
              }}
              onClick={() => item.appID && navigate(`/app/${item.appID}`)}
            >
              {/* Dark overlay to make text legible */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)' }}></div>
              
              <h2 style={{ 
                position: 'absolute', 
                left: '20px',
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
                        .map(name => allApps.find(a => a.name === name))
                        .filter(Boolean)
                        .map((app, index) => (
                          <AppCard key={`pick-${app.bundleIdentifier}-${index}`} app={app} isHidden={false} />
                      ))}
                    </div>
                  </section>
                </div>
              </>
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
                    <h3>Library Source</h3>
                    <p>Select which library to browse</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '14px', padding: '4px' }}>
                    <button onClick={() => setLibrarySource('wuxu')} style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', border: 'none', background: librarySource === 'wuxu' ? 'var(--get-bg)' : 'transparent', color: librarySource === 'wuxu' ? 'var(--get-text)' : 'var(--text-muted)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>Library</button>
                    <button onClick={() => setLibrarySource('wuxu-plus')} style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', border: 'none', background: librarySource === 'wuxu-plus' ? 'var(--get-bg)' : 'transparent', color: librarySource === 'wuxu-plus' ? 'var(--get-text)' : 'var(--text-muted)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>Library++</button>
                    <button onClick={() => setLibrarySource('both')} style={{ flex: 1, padding: '8px 12px', borderRadius: '10px', border: 'none', background: librarySource === 'both' ? 'var(--get-bg)' : 'transparent', color: librarySource === 'both' ? 'var(--get-text)' : 'var(--text-muted)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>Both</button>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Light Mode</h3>
                    <p>Toggle bright light appearance</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={!darkMode} 
                      onChange={(e) => setDarkMode(!e.target.checked)} 
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

      {isInfoModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-out' }} onClick={() => setIsInfoModalOpen(false)}>
          <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '24px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>Library Differences</h3>
            
            <div style={{ marginBottom: '16px', padding: '14px', background: 'rgba(142,142,147,0.1)', borderRadius: '16px' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: '16px', color: 'var(--text)', fontWeight: 650 }}>WuXu's Library</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.4 }}>Contains all your favorite emulators, games, jailbreaks, utilities, and more.</p>
            </div>
            
            <div style={{ marginBottom: '24px', padding: '14px', background: 'rgba(142,142,147,0.1)', borderRadius: '16px' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: '16px', color: 'var(--text)', fontWeight: 650 }}>WuXu's Library++</h4>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.4 }}>Contains all your favorite tweaked apps, free streaming apps, cracked apps, and more.</p>
            </div>

            <button 
              onClick={() => setIsInfoModalOpen(false)} 
              style={{ width: '100%', padding: '14px', background: 'var(--get-bg)', color: 'var(--get-text)', border: 'none', borderRadius: '14px', fontWeight: 650, fontSize: '16px', cursor: 'pointer', transition: 'filter 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
