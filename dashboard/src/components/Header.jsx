import React from 'react';
import { UserCircle, Moon, Sun, Bell, Menu } from 'lucide-react';

const Header = ({ title, toggleSidebar, toggleDarkMode, isDarkMode }) => {
    return (
        <header className="bg-white dark:bg-gray-800 h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10 transition-colors duration-200">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white truncate max-w-[200px] md:max-w-none">{title}</h1>
            </div>

            <div className="flex items-center gap-4 md:gap-6 text-gray-500 dark:text-gray-400">
                <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block">
                    <Bell size={20} />
                </button>
                <button
                    onClick={toggleDarkMode}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                    <UserCircle size={24} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">Admin Maintenance</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
