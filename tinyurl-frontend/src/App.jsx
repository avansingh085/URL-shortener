import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import DashboardPage from './pages/Dashboard.jsx';
import HealthPage from './pages/HealthPage.jsx';

import RedirectHandler from './components/RedirectHandler.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import LinkStatsPage from './pages/StatsPage.jsx';

const AppContent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <NavigationBar
                isMenuOpen={isMenuOpen}
                onMenuToggle={() => setIsMenuOpen(prev => !prev)}
            />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-grow w-full">
                <div className="px-4 py-6 sm:px-0">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/health" element={<HealthPage />} />
                        <Route path="/code/:code" element={<LinkStatsPage />} />
                        <Route path="/:code" element={<RedirectHandler />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </div>
            </main>

            <Footer />
        </div>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;