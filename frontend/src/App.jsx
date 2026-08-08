import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppDetails from './pages/AppDetails';

function App() {
  const [apps, setApps] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const completeRes = await fetch('/wuxu-complete.json');
        
        if (completeRes.ok) {
          const completeData = await completeRes.json();
          setApps(completeData.apps || []);
          
          let fetchedNews = completeData.news || [];
          fetchedNews.sort((a, b) => new Date(b.date) - new Date(a.date));
          setNews(fetchedNews);
        }

      } catch (error) {
        console.error("Failed to load sources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home apps={apps} news={news} loading={loading} darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/app/:bundleId" element={<AppDetails apps={apps} loading={loading} />} />
      </Routes>
    </Router>
  );
}

export default App;
