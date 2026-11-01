import React, { useState } from 'react';
import { Library, Compass, Search, Sun, Moon, Copy, Check } from 'lucide-react';
import { FaDiscord, FaTwitter, FaGithub } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import AppCard from '../components/AppCard';
import NewsCard from '../components/NewsCard';

export default function Home({ apps, plusApps, news = [], loading, darkMode, setDarkMode, librarySource, setLibrarySource }) {
  const [currentView, setCurrentView] = useState('Discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCopySource = () => {
    navigator.clipboard.writeText('https://bit.ly/wuxuslibrary');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const allApps = [...apps, ...plusApps];

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
  
  const carouselApps = React.useMemo(() => {
    const combined = [...apps, ...plusApps].filter(app => app.name && app.iconURL);
    // Fisher-Yates shuffle
    const shuffled = [...combined];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [apps, plusApps]);

  React.useEffect(() => {
    if (currentView !== 'Discover' || carouselApps.length === 0) return;
    
    let animationFrameId;
    const container = showcaseRef.current;
    if (!container) return;
    
    let isInteracting = false;
    let isDown = false;
    let startX;
    let initialScrollLeft;
    
    const onTouchStart = () => { isInteracting = true; };
    const onTouchEnd = () => { isInteracting = false; };
    
    const onMouseLeave = () => { 
      isInteracting = false; 
      isDown = false; 
    };
    const onMouseDown = (e) => {
      isInteracting = true;
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      initialScrollLeft = container.scrollLeft;
    };
    const onMouseUp = () => {
      isInteracting = false;
      isDown = false;
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed multiplier
      container.scrollLeft = initialScrollLeft - walk;
    };
    
    container.addEventListener('touchstart', onTouchStart, {passive: true});
    container.addEventListener('touchend', onTouchEnd, {passive: true});
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);

    let lastTime = performance.now();
    const speedPerSecond = 48; // Equivalent to 0.8 at 60Hz
    let exactScroll = container.scrollLeft;

    const scrollStep = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      // Each card is 130px + 15px gap = 145px per item
      const loopWidth = carouselApps.length * 145;

      if (!isInteracting && delta < 100 && loopWidth > 0) { 
        exactScroll += (speedPerSecond * delta) / 1000;
        
        // Seamless loop check
        if (exactScroll >= loopWidth) {
           exactScroll -= loopWidth;
        }
        
        container.scrollLeft = exactScroll;
      } else if (isInteracting) {
        // Sync exactScroll when user manually scrolls
        exactScroll = container.scrollLeft;
      }

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
    };
  }, [currentView, carouselApps]);

  return (
    <div className="page">
      <header className="topbar" style={{ position: 'relative' }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
          style={{
            position: 'absolute',
            top: '22px',
            right: 'max(4.15vw, 20px)',
            background: 'none',
            border: 'none',
            padding: '6px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s, transform 0.2s',
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = 'var(--text)';
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {darkMode ? <Sun size={22} strokeWidth={2.2} /> : <Moon size={22} strokeWidth={2.2} />}
        </button>

        <div className="brand">
          <h1>WuXu's Library</h1>
          <p>The most Up-To-Date IPA Libraries on AltStore</p>
        </div>
        
        <div className="top-center" role="navigation" aria-label="Primary navigation">
          <div style={{ display: 'flex', background: 'rgba(142,142,147,0.15)', borderRadius: '999px', padding: '4px' }}>
            <button 
              onClick={() => setCurrentView('Discover')} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '999px', border: 'none', background: currentView === 'Discover' ? 'var(--card-bg)' : 'transparent', color: currentView === 'Discover' ? 'var(--text)' : 'var(--text-muted)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: currentView === 'Discover' ? '0 2px 10px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
              <Compass size={16} /> Discover
            </button>
            <button 
              onClick={() => setCurrentView('Library')} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '999px', border: 'none', background: currentView === 'Library' ? 'var(--card-bg)' : 'transparent', color: currentView === 'Library' ? 'var(--text)' : 'var(--text-muted)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: currentView === 'Library' ? '0 2px 10px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
              <Library size={16} /> Library
            </button>
          </div>
        </div>

      </header>

      {currentView === 'Discover' && !loading && (
        <>
        <section className="hero-banner" style={{ margin: '16px 20px 10px', padding: '20px 24px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(216,26,20,0.08) 0%, rgba(216,26,20,0.03) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(216,26,20,0.15)' }}>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>Get Started</h2>
          <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)', fontSize: '14.5px', maxWidth: '520px', lineHeight: 1.45 }}>
            Tap your package manager below or copy the source URL to add WuXu's Library.
          </p>
          <div style={{ margin: '0 0 18px 0', padding: '12px 18px', background: 'rgba(216,26,20,0.08)', borderRadius: '14px', border: '1px solid rgba(216,26,20,0.2)', maxWidth: '580px' }}>
            <p style={{ margin: 0, color: 'var(--text)', fontSize: '13.5px', lineHeight: 1.5 }}>
              ⚠️ <strong>Note: WuXu's Library++ is old and has retired.</strong> Both sources have been unified into one single master repository — <strong>WuXu's Library</strong> — which now carries all tweaked apps, games, emulators, and utilities in one place. If you previously added Library++, your existing apps will still receive updates, but WuXu's Library is now the only source you need.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={`altstore://source?url=https://wuxu1.github.io/wuxu-complete.json`} style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #40C4B5 0%, #2BA093 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(51,181,166,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to AltStore
            </a>
            <a href={`sidestore://source?url=https://wuxu1.github.io/wuxu-complete.json`} style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(139,92,246,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to SideStore
            </a>
            <a href="scarlet://source?url=https://wuxu1.github.io/wuxu-complete-scarlet.json" style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #FF2400 0%, #D91000 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(255,36,0,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to Scarlet
            </a>
            <a href="feather://source/https://wuxu1.github.io/wuxu-complete.json" style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #8a95fb 0%, #6a76e0 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(121,133,250,0.4)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to Feather
            </a>
            <a href="trollapps://add?url=https://wuxu1.github.io/wuxu-complete.json" style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', transition: 'transform 0.2s, filter 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Add to TrollApps
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%', marginTop: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Platform not listed?
            </span>
            <button 
              onClick={handleCopySource}
              style={{ padding: '8px 18px', borderRadius: '12px', background: copied ? '#34c759' : 'var(--card-bg)', color: copied ? '#ffffff' : 'var(--text)', border: '1px solid var(--border-color, rgba(142,142,147,0.3))', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s, filter 0.2s, background 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied Link!' : 'Copy Source URL'}
            </button>
          </div>
        </section>
        <section 
          className="showcase" 
          ref={showcaseRef}
          style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            width: '100%',
            minWidth: 0,
            gap: '15px',
            padding: '24px 20px 32px 20px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none'  // IE/Edge
          }}
        >
          {[...carouselApps, ...carouselApps].map((app, index) => {
            const icon = app.iconURL;
            const title = app.name;
            
            return (
              <article 
                key={`${app.bundleIdentifier}-${index}`} 
                className="feature" 
                style={{ 
                  cursor: app.bundleIdentifier ? 'pointer' : 'default',
                  '--base-bg': app.tintColor ? `#${app.tintColor}25` : 'var(--card-bg)',
                  '--hover-bg': app.tintColor ? `#${app.tintColor}45` : 'var(--card-border)',
                  backgroundColor: 'var(--base-bg)',
                  border: app.tintColor ? `1px solid #${app.tintColor}50` : '1px solid var(--card-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 12px',
                  boxSizing: 'border-box'
                }}
                onClick={() => app.bundleIdentifier && navigate(`/app/${app.bundleIdentifier}`)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
                  <img src={icon} alt={title} style={{ width: '84px', height: '84px', borderRadius: '18px', boxShadow: '0 6px 16px rgba(0,0,0,0.25)', objectFit: 'cover' }} />
                  <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '700', textAlign: 'center', lineHeight: 1.2, color: 'var(--text)' }}>
                    {title}
                  </h3>
                </div>
              </article>
            );
          })}
          {carouselApps.length === 0 && (
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
                  <label className="search-wrap" aria-label="Search apps" style={{ display: 'flex', width: '100%', maxWidth: '420px' }}>
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
                    onClick={() => setIsRequestModalOpen(true)} 
                    style={{ padding: '0 16px', height: '38px', borderRadius: '10px', background: 'var(--get-bg)', color: 'var(--get-text)', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', transition: 'background 0.2s', border: 'none', cursor: 'pointer' }}
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
          </>
        )}
      </main>





      {isRequestModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-out' }} onClick={() => setIsRequestModalOpen(false)}>
          <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '24px', maxWidth: '340px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(142,142,147,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text)' }}>
              <Compass size={24} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>Coming Soon</h3>
            <p style={{ margin: '0 0 24px', fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.4 }}>The app request feature is currently under development. Check back later!</p>
            <button 
              onClick={() => setIsRequestModalOpen(false)} 
              style={{ width: '100%', padding: '14px', background: 'var(--get-bg)', color: 'var(--get-text)', border: 'none', borderRadius: '14px', fontWeight: 650, fontSize: '16px', cursor: 'pointer', transition: 'filter 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
            >
              Okay
            </button>
          </div>
        </div>
      )}

      <footer style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', gap: '24px', opacity: 0.8 }}>
        <a href="https://bit.ly/wuxuslibrary-discord" target="_blank" rel="noopener noreferrer" aria-label="Discord" style={{ color: 'var(--text)', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = 0.6} onMouseOut={(e) => e.currentTarget.style.opacity = 1}>
          <FaDiscord size={28} />
        </a>
        <a href="https://bit.ly/wuxustwitter" target="_blank" rel="noopener noreferrer" aria-label="Twitter" style={{ color: 'var(--text)', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = 0.6} onMouseOut={(e) => e.currentTarget.style.opacity = 1}>
          <FaTwitter size={28} />
        </a>
        <a href="https://bit.ly/wuxuslibrary-github" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ color: 'var(--text)', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = 0.6} onMouseOut={(e) => e.currentTarget.style.opacity = 1}>
          <FaGithub size={28} />
        </a>
      </footer>
    </div>
  );
}
