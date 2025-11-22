import React, { useState, useEffect } from 'react';
import { fetchTinyUrls } from '../services/api.js';
import AddLinkPopup from '../components/AddLinkPopup.jsx';
import LinkListItem from '../components/LinkListItem.jsx';

const DashboardPage = () => {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

  
    const loadTinyUrls = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const data = await fetchTinyUrls();
            setLinks(data);
        } catch (err) {
            console.error('Error fetching tiny URLs:', err);
            setError(`Failed to fetch URLs. Details: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTinyUrls();
    }, []);

 
    if (isLoading) {
        return <div className="text-center p-4 text-xl font-medium text-indigo-700">Loading your Tiny URLs...</div>;
    }

    if (error) {
        return (
            <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded relative">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Your Tiny URLs</h2>
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add New Link
                </button>
            </div>

            {isPopupOpen && <AddLinkPopup 
                onClose={() => setIsPopupOpen(false)} 
                onLinkCreated={loadTinyUrls} 
            />}

            {links.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-xl font-medium text-gray-500">No Tiny URLs found. Click 'Add New Link' to get started!</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {links.map((link) => (
                        <LinkListItem 
                            key={link._id} 
                            link={link} 
                            onLinkDeleted={loadTinyUrls} 
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DashboardPage;