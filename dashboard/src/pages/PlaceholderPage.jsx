import React from 'react';
import { Settings } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
            <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-md flex flex-col items-center border border-gray-100 dark:border-gray-700 min-w-[400px]">
                <div className="w-16 h-16 bg-blue-50 dark:bg-gray-700/50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Settings size={32} className="animate-[spin_4s_linear_infinite]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">{title}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center font-medium">Page en construction 🚧</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-4 max-w-sm">
                    Cette section du tableau de bord est en cours de développement avec React.
                </p>
            </div>
        </div>
    );
};

export default PlaceholderPage;
