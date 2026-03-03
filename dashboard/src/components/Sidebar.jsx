import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, CalendarCheck, ClipboardList, Database, Factory } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const menuItems = [
        { id: 'vue-globale', title: 'Vue Globale (KPIs)', icon: LayoutDashboard, path: '/' },
        { id: 'pareto', title: 'Analyse Pareto', icon: BarChart2, path: '/pareto' },
        { id: 'preventif', title: 'Suivi Préventif', icon: CalendarCheck, path: '/preventif' },
        { id: 'amdec', title: "Plan d'Action & AMDEC", icon: ClipboardList, path: '/amdec' },
        { id: 'bdd', title: 'Base de Données', icon: Database, path: '/bdd' },
    ];

    return (
        <aside className={`w-64 bg-gray-900 dark:bg-gray-950 text-white h-screen flex flex-col fixed left-0 top-0 z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="p-6 border-b border-gray-800 dark:border-gray-800/50 text-center flex flex-col items-center gap-2">
                <Factory size={32} className="text-blue-400" />
                <div>
                    <h2 className="text-xl font-bold tracking-wider">SumiRiko HTN</h2>
                    <p className="text-gray-400 text-sm">Maintenance Dept</p>
                </div>
            </div>

            <nav className="flex-1 mt-6">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.id}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => setIsOpen && setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-6 py-3 transition-colors duration-200 border-l-4 ${isActive
                                            ? 'bg-gray-800 dark:bg-gray-800/50 border-blue-500 text-white'
                                            : 'border-transparent text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-800/50 hover:text-white'
                                        }`
                                    }
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.title}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-800 dark:border-gray-800/50 text-xs text-gray-500 text-center">
                &copy; 2026 SumiRiko HTN
            </div>
        </aside>
    );
};

export default Sidebar;
