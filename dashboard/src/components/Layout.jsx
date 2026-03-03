import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Initialize dark mode from localStorage or OS preference
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return true;
        }
        return false;
    });

    // Apply dark class to HTML root
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Define dynamic titles based on current path
    const getPageTitle = (path) => {
        switch (path) {
            case '/': return 'Vue Globale (KPIs)';
            case '/pareto': return 'Analyse Pareto';
            case '/preventif': return 'Suivi Préventif';
            case '/amdec': return "Plan d'Action & AMDEC";
            case '/bdd': return 'Base de Données';
            default: return 'Tableau de Bord';
        }
    };

    const currentTitle = getPageTitle(location.pathname);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 overflow-hidden transition-colors duration-200">
            {/* Overlay background for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col h-screen w-full md:ml-64">
                <Header
                    title={currentTitle}
                    toggleSidebar={toggleSidebar}
                    toggleDarkMode={toggleDarkMode}
                    isDarkMode={isDarkMode}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
