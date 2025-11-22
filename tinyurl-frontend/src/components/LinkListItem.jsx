
import React, { useState } from 'react';
import { deleteTinyUrl, getBaseUrl } from '../services/api';

const LinkListItem = ({ link, onLinkDeleted }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const API_BASE_URL = getBaseUrl();
    const fullTinyUrl = `${window.location}/${link.ShortCode}`;

    const handleDelete = async () => {
        if (isDeleting || !window.confirm("Are you sure you want to delete this Tiny URL?")) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteTinyUrl(link.ShortCode);
            alert('URL deleted successfully!');
            onLinkDeleted(); 
        } catch (err) {
            console.error('Error deleting tiny URL:', err);
            alert(`Error deleting URL: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };
  
    return (
        <li className="bg-white p-4 rounded-lg shadow flex justify-between items-center transition duration-150 hover:shadow-lg">
            <div className="flex-grow">
                <p className="text-gray-500 truncate"><span className="font-semibold text-gray-700">Original URL:</span> {String(link.TargetURL).slice(0,30)}{String(link.TargetURL).length>30? ".......":""}</p>
                <p className="mt-1">
                    <span className="font-semibold">Tiny URL:</span>
                    <a href={fullTinyUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline ml-1">
                        {window.location+link.ShortCode}
                    </a>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold">Clicks:</span> {link.TotalClicks} |
                    <span className="font-semibold ml-2">Last Click:</span> {link.updatedAt ? new Date(link.updatedAt).toLocaleString() : 'N/A'}
                </p>
            </div>

            <button
                onClick={handleDelete}
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
    );
};

export default LinkListItem;