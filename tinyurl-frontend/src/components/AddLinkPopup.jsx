
import React, { useState } from 'react';
import { createTinyUrl } from '../services/api'; 
const AddLinkPopup = ({ onClose, onLinkCreated }) => {
    const [newOriginalUrl, setNewOriginalUrl] = useState('');
    
    const [customCode, setCustomCode] = useState(''); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const handleAddLink = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage({ type: 'loading', text: 'Creating Tiny URL...' });

        try {
           
            await createTinyUrl({TargetURL:newOriginalUrl,customCode: customCode.trim()}); 

            setSubmitMessage({ type: 'success', text: 'Tiny URL created successfully!' });
            setNewOriginalUrl('');
            setCustomCode('');

            setTimeout(() => {
                onLinkCreated(); 
                onClose(); 
                setSubmitMessage({ type: '', text: '' }); 
            }, 1500);

        } catch (err) {
            console.error('Error adding tiny URL:', err);
            let errorMessage = `Failed: ${err.message}`;
            
            if (err.message.includes('409') || err.message.includes('Conflict')) {
                errorMessage = "Custom code already in use (409 Conflict). Please choose another code.";
            } else if (err.message.includes('302') || err.message.includes('Found')) {
                errorMessage = "This long URL is already shortened with a Tiny URL (302 Found).";
            } else if (err.message.includes('Invalid URL') || err.message.includes('Validation') || err.message.includes('400')) {
                errorMessage = "Invalid Original URL or custom code provided. Check format.";
            }
           
            setSubmitMessage({ type: 'error', text: errorMessage });
        } finally {
          
            if (submitMessage.type !== 'success') {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Shorten a New URL</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                        disabled={isSubmitting && submitMessage.type === 'success'}
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleAddLink}>
                    <div className="mb-4">
                        <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-1">Original URL <span className="text-red-500">*</span></label>
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
                    
                   
                    <div className="mb-6">
                        <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-1">Custom Short Code (Optional)</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                {window.location.host}/
                            </span>
                            <input
                                id="customCode"
                                type="text"
                                value={customCode}
                               
                                onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                                placeholder="e.g., my-project-link"
                                className="flex-1 w-full p-2 border border-gray-300 rounded-r-lg focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={isSubmitting}
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Only letters, numbers, hyphens, and underscores are allowed.</p>
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
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                {submitMessage.text}
                            </>
                        ) : 'Shorten URL'}
                    </button>
                </form>

               
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
};

export default AddLinkPopup;