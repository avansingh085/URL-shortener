
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center border-t border-gray-700">
                <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} TinyLink. All rights reserved. | Built with React and a lot of <span className="text-red-400">❤️</span>.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Disclaimer: This is a demo application.
                </p>
            </div>
        </footer>
    );
};

export default Footer;