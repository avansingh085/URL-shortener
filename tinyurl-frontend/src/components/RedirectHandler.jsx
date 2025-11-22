import React, { useState, useEffect } from 'react';
import { getBaseUrl } from '../services/api';

const RedirectHandler = () => {
    const [status, setStatus] = useState('Loading...');
    const [shortCode, setShortCode] = useState(null);
    const API_BASE_URL = getBaseUrl();

    useEffect(() => {
       
        const code = window.location.pathname.substring(1); 
        
        if (!code) {
           
            setStatus("Redirecting to dashboard...");
            window.location.hash = '#dashboard';
            return;
        }

        setShortCode(code);
        
        const fetchAndRedirect = async () => {
            const endpoint = `${API_BASE_URL}/api/links/${code}`; 
            
            setStatus(`Looking up shortcode: /${code}`);

            try {
              
                const response = await fetch(endpoint, {
                    method: 'GET',
                      headers: {
            'Content-Type': 'application/json',
        }
                });
               
                if (response.status === 302) {
                    const data = await response.json();
                    console.log(data);
                    const targetUrl = data.url; 
                   
                    if (targetUrl) {
                        setStatus(`Found target URL. Redirecting to: ${targetUrl}`);
                     
                        window.location.replace(targetUrl);
                    } else {
                        throw new Error("Invalid response structure from API.");
                    }

                } else if (response.status === 404) {
                  
                    setStatus(`Error: Shortcode '/${code}' does not exist.`);
                    setShortCode(null);
                } else {
                
                    throw new Error(`API returned status code: ${response.status}`);
                }

            } catch (error) {
                console.error("Redirection error:", error);
                setStatus(`An error occurred: ${error.message}`);
                setShortCode(null);
            }
        };

        fetchAndRedirect();
    }, []); 

    if (shortCode === null) {
      
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
                <div className="text-center bg-white p-10 rounded-xl shadow-2xl border-t-4 border-red-500">
                    <p className="text-6xl font-extrabold text-red-600 mb-4">404</p>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tiny URL Not Found</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        The short code you requested is invalid or does not exist.
                    </p>
                    <button
                        onClick={() => window.location = '/'}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
                    >
                        Go to TinyLink Dashboard
                    </button>
                </div>
            </div>
        );
    }

  
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
                <h1 className="text-xl font-semibold text-gray-800">Processing Redirection</h1>
                <p className="text-gray-500 mt-2">{status}</p>
            </div>
        </div>
    );
};

export default RedirectHandler;