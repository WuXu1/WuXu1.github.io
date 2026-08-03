import React, { useState, useEffect } from 'react';
import { LayoutGrid, Gamepad2, Download, Compass, Search, Settings } from 'lucide-react';
import AppCard from './components/AppCard';

function App() {
  const [apps, setApps] = useState([]);
  const [plusApps, setPlusApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Apps'); // Apps, Games, Updates

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [completeRes, plusRes] = await Promise.all([
          fetch('/wuxu-complete.json'),
          fetch('https://wuxu1.github.io/wuxu-complete-plus.json')
        ]);
        
        if (completeRes.ok) {
          const completeData = await completeRes.json();
          setApps(completeData.apps || []);
        }
        
        if (plusRes.ok) {
          const plusData = await plusRes.json();
          setPlusApps(plusData.apps || []);
        }
      } catch (error) {
        console.error("Failed to load sources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.trim().toLowerCase());
  };

  const isHidden = (app) => {
    if (!searchQuery) return false;
    const searchString = `${app.name} ${app.developerName} ${app.subtitle}`.toLowerCase();
    return !searchString.includes(searchQuery);
  };

  // The provided HTML showed a grid of specific apps.
  // We will map our fetched apps instead.
  
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <h1>WuXu's Library</h1>
          <p>Discover sideloaded apps</p>
        </div>
        
        <div className="top-actions" role="navigation" aria-label="Library categories">
          <button className="top-action" data-tab="Apps" aria-pressed={activeTab === 'Apps'} aria-label="Apps" onClick={() => setActiveTab('Apps')}>
            <LayoutGrid size={27} strokeWidth={2.35} />
            <span>Apps</span>
          </button>
          
          <button className="top-action" data-tab="Games" aria-pressed={activeTab === 'Games'} aria-label="Games" onClick={() => setActiveTab('Games')}>
            <Gamepad2 size={27} strokeWidth={2.35} />
            <span>Games</span>
          </button>
          
          <button className="top-action" data-tab="Updates" aria-pressed={activeTab === 'Updates'} aria-label="Updates" onClick={() => setActiveTab('Updates')}>
            <Download size={27} strokeWidth={2.35} />
            <span>Updates</span>
          </button>
          
          <label className="search-wrap" aria-label="Search apps">
            <Search size={20} strokeWidth={2.35} />
            <input 
              id="search" 
              type="search" 
              placeholder="Search Apps..." 
              autoComplete="off" 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </label>
        </div>
      </header>

      {!searchQuery && (
        <section className="showcase" aria-label="Featured releases">
          <article className="feature feature-primary">
            <div className="badge">
              <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M26 11 12 31l13 8 9-15 9 7-12 20 6 4 18-27-6-4-5 8-9-7 5-8-14-6Zm-7 31 8 5-5 8-8-5 5-8Z"/></svg>
            </div>
            <div className="flower" aria-hidden="true"></div>
            <h2>Featured Releases</h2>
          </article>
          <article className="feature feature-secondary" aria-label="New app release">
            <div className="scene">
              <div className="screen"></div>
              <div className="rocket"></div>
            </div>
          </article>
          <article className="feature feature-third">
            <h2>Stories</h2>
          </article>
        </section>
      )}

      <main className="catalog">
        {loading ? (
          <div className="loading-state">Loading apps...</div>
        ) : (
          <>
            <section className="cards" id="app-grid" aria-label="App catalogue">
              {apps.map((app, index) => (
                <AppCard key={`std-${app.bundleIdentifier}-${index}`} app={app} isHidden={isHidden(app)} />
              ))}
              {plusApps.map((app, index) => (
                <AppCard key={`plus-${app.bundleIdentifier}-${index}`} app={app} isHidden={isHidden(app)} />
              ))}
            </section>
            
            {!searchQuery && (
              <div className="sections">
                <section className="section">
                  <h3>New This Week</h3>
                  <div className="mini-grid">
                    {/* Just grab the first two apps as an example for the mini grid */}
                    {apps.slice(0, 2).map((app, index) => (
                      <AppCard key={`new-${app.bundleIdentifier}-${index}`} app={app} isHidden={false} />
                    ))}
                  </div>
                </section>
                <section className="section">
                  <h3>Editor's Choice</h3>
                  <div className="mini-grid">
                    {plusApps.slice(0, 2).map((app, index) => (
                      <AppCard key={`editor-${app.bundleIdentifier}-${index}`} app={app} isHidden={false} />
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Primary navigation">
        <button className="active" data-bottom="Discover" aria-label="Discover">
          <Compass size={24} strokeWidth={2} />
          <span>Discover</span>
        </button>
        <button data-bottom="Search" aria-label="Search" onClick={() => document.getElementById('search').focus()}>
          <Search size={24} strokeWidth={2} />
          <span>Search</span>
        </button>
        <button data-bottom="Settings" aria-label="Settings">
          <Settings size={24} strokeWidth={2} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
