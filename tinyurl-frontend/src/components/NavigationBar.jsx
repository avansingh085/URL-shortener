
import React from 'react';
import { Home, HeartPulse, Menu, X } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', icon: Home, href: '#dashboard' },
    { name: 'Health', icon: HeartPulse, href: '#health' },
];

const NavigationBar = ({ activeTab, onTabClick, isMenuOpen, onMenuToggle }) => {

    const getLinkClasses = (name) => {
        const baseClasses = 'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200';
        if (name === activeTab) {
            return `${baseClasses} bg-indigo-600 text-white shadow-md hover:bg-indigo-700`;
        }
        return `${baseClasses} text-indigo-200 hover:bg-gray-700 hover:text-white`;
    };

    return (
        <nav className="bg-gray-800 shadow-xl w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-xl font-bold text-white tracking-wider">
                            <HeartPulse className="inline-block w-6 h-6 mr-2 text-indigo-400" />
                            TinyLink
                        </span>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={getLinkClasses(item.name)}
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    onTabClick(item.name);
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </a>
                        ))}
                    </div>

                  
                    <div className="sm:hidden">
                        <button
                            onClick={onMenuToggle}
                            className="inline-flex items-center justify-center p-2 rounded-md text-indigo-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="sm:hidden pb-4">
                    <div className="px-2 pt-2 space-y-1">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={getLinkClasses(item.name) + ' block text-base'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onTabClick(item.name);
                                }}
                            >
                                <item.icon className="w-6 h-6" />
                                <span>{item.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavigationBar;