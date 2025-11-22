// src/App.jsx
import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import DashboardPage from './pages/Dashboard.jsx';
import HealthPage from './pages/HealthPage';
import NotFoundPage from './pages/PageNotFound';
import RedirectHandler from './components/RedirectHandler.jsx'; // Import the new handler

const isShortcodePath = () => {
    
    const path = window.location.pathname;
    return path.length > 1 && path !== '/index.html'; 
};

const getTabFromHash = (hash) => {
    switch (hash) {
        case '#dashboard':
            return 'Dashboard';
        case '#health':
            return 'Health';
        default:
            return 'Dashboard';
    }
};

const App = () => {
    const [activeTab, setActiveTab] = useState(getTabFromHash(window.location.hash));
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleHashChange = () => {
           
            if (!isShortcodePath()) {
                setActiveTab(getTabFromHash(window.location.hash));
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        window.location.hash = tabName.toLowerCase();
        setIsMenuOpen(false); 
    };
    
    
    const handleMenuToggle = () => { 
        setIsMenuOpen(prev => !prev);
    };

    const renderPage = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <DashboardPage />;
            case 'Health':
                return <HealthPage />;
            default:
                
                return <NotFoundPage onGoHome={() => handleTabClick('Dashboard')} />;
        }
    };

  
    if (isShortcodePath()) {
       
        return <RedirectHandler />;
    }
   
    return (
        <div className="min-h-screen bg-gray-100">
            <NavigationBar
                activeTab={activeTab}
                onTabClick={handleTabClick}
                isMenuOpen={isMenuOpen}
                onMenuToggle={handleMenuToggle}
            />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
};

export default App;