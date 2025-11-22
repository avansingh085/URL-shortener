import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TinyUrlLists = () => {
    // State for data and status
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 

    const [newOriginalUrl, setNewOriginalUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const fetchTinyUrls = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/links`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setLinks(data.links ?? []);
        } catch (err) {
            console.error('Error fetching tiny URLs:', err);
            setError(`Failed to fetch URLs. Details: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTinyUrls();
    }, []);

    const handleDelete = async (linkId) => {
        if (isDeleting || !window.confirm("Are you sure you want to delete this Tiny URL?")) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/tinylinks/${linkId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Deletion failed with status: ${response.status}`);
            }

            // Success: Reload the list
            alert('URL deleted successfully!');
            fetchTinyUrls(); 

        } catch (err) {
            console.error('Error deleting tiny URL:', err);
            alert(`Error deleting URL: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // --- Handle Add Link Submission ---
    const handleAddLink = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage({ type: 'loading', text: 'Creating Tiny URL...' });

        try {
            const response = await fetch(`${API_BASE_URL}/api/tinylinks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ originalUrl: newOriginalUrl }),
            });

            const data = await response.json();

            if (!response.ok) {
                const message = data.error || 'Failed to create link.';
                throw new Error(message);
            }

            // Success: Show success message and reset form
            setSubmitMessage({ type: 'success', text: 'Tiny URL created successfully!' });
            setNewOriginalUrl(''); // Clear the input field

            // Wait a few seconds, then close popup and refresh list
            setTimeout(() => {
                setIsPopupOpen(false); // Close popup
                fetchTinyUrls(); // Refresh list
                setSubmitMessage({ type: '', text: '' }); // Clear message
            }, 2000); 

        } catch (err) {
            console.error('Error adding tiny URL:', err);
            setSubmitMessage({ type: 'error', text: `Failed: ${err.message}` });
        } finally {
            // Keep submitting true until the success timeout clears it, or set to false on error
            if (submitMessage.type !== 'success') {
                 setIsSubmitting(false);
            }
        }
    };

    // --- Add Link Popup Component (Inline for simplicity) ---
    const AddLinkPopup = () => (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Shorten a New URL</h3>
                    <button 
                        onClick={() => setIsPopupOpen(false)} 
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                        disabled={isSubmitting} // Prevent closing during submission
                    >
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleAddLink}>
                    <div className="mb-4">
                        <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-1">Original URL</label>
                        <input
                            id="originalUrl"
                            type="url"
                            value={newOriginalUrl}
                            onChange={(e) => setNewOriginalUrl(e.target.value)}
                            required
                            placeholder="e.g., https://www.google.com/very/long/path"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-150 ${
                            isSubmitting 
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {isSubmitting && submitMessage.type === 'loading' ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {submitMessage.text}
                            </>
                        ) : 'Shorten URL'}
                    </button>
                </form>

                {/* Response Message Area */}
                {submitMessage.text && submitMessage.type !== 'loading' && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${
                        submitMessage.type === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {submitMessage.text}
                    </div>
                )}
            </div>
        </div>
    );
    // --- END Popup Component ---


    // --- Conditional Rendering ---
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

    // --- Main Component Render ---
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Your Tiny URLs</h2>
                <button
                    onClick={() => {
                        setIsPopupOpen(true);
                        setSubmitMessage({ type: '', text: '' }); // Reset messages on open
                        setNewOriginalUrl(''); // Clear form on open
                    }}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add New Link
                </button>
            </div>

            {isPopupOpen && <AddLinkPopup />}
            
            {links.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-xl font-medium text-gray-500">No Tiny URLs found. Click 'Add New Link' to get started!</p>
                </div>
            ) : (
                <ul className="space-y-4">
                {
                    links.map((link) => {
                        const fullTinyUrl = `${API_BASE_URL}/${link.tinyUrl}`;

                        return (
                            <li key={link._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center transition duration-150 hover:shadow-lg">
                                <div className="flex-grow">
                                    <p className="text-gray-500 truncate"><span className="font-semibold text-gray-700">Original URL:</span> {link.originalUrl}</p>
                                    <p className="mt-1">
                                        <span className="font-semibold">Tiny URL:</span> 
                                        <a href={fullTinyUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline ml-1">
                                            {link.tinyUrl}
                                        </a>
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        <span className="font-semibold">Clicks:</span> {link.TotalCount} | 
                                        <span className="font-semibold ml-2">Last Click:</span> {link.lastHite ? new Date(link.lastHite).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                                
                                <button
                                    onClick={() => handleDelete(link._id)}
                                    disabled={isDeleting}
                                    className="ml-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-150 disabled:bg-red-300"
                                    title="Delete URL"
                                >
                                    {isDeleting ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    )}
                                </button>
                            </li>
                        )
                    })
                }    
                </ul>
            )}
        </div>
    );
};

export default TinyUrlLists;