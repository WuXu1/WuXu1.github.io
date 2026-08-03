import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppDetails from './pages/AppDetails';

function App() {
  const [apps, setApps] = useState([]);
  const [plusApps, setPlusApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [completeRes, plusRes] = await Promise.all([
          fetch('/wuxu-complete.json'),
          fetch('/wuxu-complete-plus.json') // Using local since it's now downloaded in dev
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home apps={apps} plusApps={plusApps} loading={loading} />} />
        <Route path="/app/:bundleId" element={<AppDetails apps={apps} plusApps={plusApps} loading={loading} />} />
      </Routes>
    </Router>
  );
}

export default App;
