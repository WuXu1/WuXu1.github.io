import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppDetails from './pages/AppDetails';

function App() {
  const [apps, setApps] = useState([]);
  const [plusApps, setPlusApps] = useState([]);
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
        const [completeRes, plusRes] = await Promise.all([
          fetch('/wuxu-complete.json'),
          fetch('/wuxu-complete-plus.json')
        ]);
        
        let fetchedNews = [];

        if (completeRes.ok) {
          const completeData = await completeRes.json();
          setApps(completeData.apps || []);
          if (completeData.news) fetchedNews = [...fetchedNews, ...completeData.news];
        }
        
        if (plusRes.ok) {
          const plusData = await plusRes.json();
          setPlusApps(plusData.apps || []);
          if (plusData.news) fetchedNews = [...fetchedNews, ...plusData.news];
        }

        // Sort news by date (newest first)
        fetchedNews.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNews(fetchedNews);

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
        <Route path="/" element={<Home apps={apps} plusApps={plusApps} news={news} loading={loading} darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/app/:bundleId" element={<AppDetails apps={apps} plusApps={plusApps} loading={loading} />} />
      </Routes>
    </Router>
  );
}

export default App;
