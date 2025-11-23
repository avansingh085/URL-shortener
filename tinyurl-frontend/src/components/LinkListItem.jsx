
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteTinyUrl } from '../services/api';
import { Trash2, BarChart2 } from 'lucide-react';

const LinkListItem = ({ link, onLinkDeleted }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const fullTinyUrl = `${window.location.origin}/${link.ShortCode}`;
    const statsPath = `/stats/${link.ShortCode}`;

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
            <div className="flex-grow min-w-0">
                <p className="text-gray-500 truncate">
                    <span className="font-semibold text-gray-700">Original URL:</span> {String(link.TargetURL).slice(0, 50)}{String(link.TargetURL).length > 50 ? "......." : ""}
                </p>
                <p className="mt-1">
                    <span className="font-semibold">Tiny URL:</span>
                    <a href={fullTinyUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline ml-1 truncate block sm:inline-block max-w-full">
                        {fullTinyUrl}
                    </a>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold">Clicks:</span> {link.TotalClicks} |
                    <span className="font-semibold ml-2">Created:</span> {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : 'N/A'}
                </p>
            </div>

            <div className="flex items-center space-x-2 ml-4">
               
                <Link
                    to={"/code/"+link.ShortCode}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition duration-150"
                    title="View Statistics"
                >
                    <BarChart2 className="w-5 h-5" />
                </Link>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-150 disabled:bg-red-300"
                    title="Delete URL"
                >
                    {isDeleting ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <Trash2 className="w-5 h-5" />
                    )}
                </button>
            </div>
        </li>
    );
};

export default LinkListItem;