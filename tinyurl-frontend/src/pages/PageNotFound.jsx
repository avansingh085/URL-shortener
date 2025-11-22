
import React from 'react';

const NotFoundPage = ({ onGoHome }) => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 bg-gray-50">
            <div className="text-center">
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">404 Error</p>
                <h1 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Page Not Found 😥
                </h1>
                <p className="mt-2 text-base text-gray-500">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="mt-6">
                    <button
                        onClick={onGoHome}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;