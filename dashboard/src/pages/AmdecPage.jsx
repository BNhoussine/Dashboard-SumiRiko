import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, ClipboardList, AlertTriangle, Download } from 'lucide-react';
import Papa from 'papaparse';
import useStore from '../store/useStore';

const AmdecPage = () => {
    const { Data_Plan_Action, Data_AMDEC } = useStore();
    const [activeTab, setActiveTab] = useState('plan-action'); // 'plan-action' | 'amdec'

    // Helper function for Action Plan Status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Clôturé':
                return <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">Clôturé</span>;
            case 'En cours':
                return <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">En cours</span>;
            case 'En retard':
                return <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">En retard</span>;
            default:
                return <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">{status}</span>;
        }
    };

    // Helper function for AMDEC IPR badge
    const getIPRBadge = (ipr) => {
        const value = Number(ipr) || 0;
        if (value >= 100) {
            return <span className="bg-red-500 text-white px-3 py-1 rounded w-16 text-center inline-block font-bold shadow-sm">Critique<br /><span className="text-xl">{value}</span></span>;
        } else if (value >= 50 && value < 100) {
            return <span className="bg-orange-500 text-white px-3 py-1 rounded w-16 text-center inline-block font-bold shadow-sm">Majeur<br /><span className="text-xl">{value}</span></span>;
        } else {
            return <span className="bg-green-500 text-white px-3 py-1 rounded w-16 text-center inline-block font-bold shadow-sm">Mineur<br /><span className="text-xl">{value}</span></span>;
        }
    };

    // Helper function to export Plan d'Action as CSV
    const exportCSV = () => {
        if (!Data_Plan_Action || Data_Plan_Action.length === 0) return;

        const csv = Papa.unparse(Data_Plan_Action);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'plan_action_maintenance.csv');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Check Empty State globally for the page
    const isEmptySession = (!Data_Plan_Action || Data_Plan_Action.length === 0) && (!Data_AMDEC || Data_AMDEC.length === 0);

    if (isEmptySession) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
                <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[400px]">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-600">
                        <Database size={40} className="opacity-70" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Aucune donnée disponible</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">
                        Les tables d'actions et AMDEC sont vides. Veuillez importer des fichiers ou générer des données de démonstration.
                    </p>
                    <Link
                        to="/bdd"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        Aller vers la Base de Données
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* HEADER & TABS NAVIGATION */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Améliorer & Contrôler</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gestion du Plan d'Action Maintenance et Matrice de Criticité AMDEC.</p>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('plan-action')}
                        className={`flex items-center gap-2 pb-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'plan-action'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <ClipboardList size={18} />
                        Plan d'Action Maintenance
                        {activeTab === 'plan-action' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-lg"></span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('amdec')}
                        className={`flex items-center gap-2 pb-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'amdec'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <AlertTriangle size={18} />
                        Matrice AMDEC
                        {activeTab === 'amdec' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-lg"></span>
                        )}
                    </button>
                </div>
            </div>

            {/* TAB CONTENT 1: PLAN D'ACTION */}
            {activeTab === 'plan-action' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animation-fade-in text-sm transition-colors">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Suivi des Actions Correctives et Préventives</h3>
                            <span className="inline-block mt-2 px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm">
                                {Data_Plan_Action ? Data_Plan_Action.length : 0} Actions Répertoriées
                            </span>
                        </div>
                        <button
                            onClick={exportCSV}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
                        >
                            <Download size={16} />
                            Exporter en CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-600 dark:text-gray-400">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4">UAP</th>
                                    <th className="px-6 py-4">Machine</th>
                                    <th className="px-6 py-4 w-1/4">Problème Identifié</th>
                                    <th className="px-6 py-4 w-1/4">Cause Racine</th>
                                    <th className="px-6 py-4 w-1/4">Action à Réaliser</th>
                                    <th className="px-6 py-4">Date Limite</th>
                                    <th className="px-6 py-4 text-center">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {(!Data_Plan_Action || Data_Plan_Action.length === 0) ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-gray-400 dark:text-gray-500">Aucune action recensée.</td>
                                    </tr>
                                ) : (
                                    Data_Plan_Action.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">{row.UAP}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{row.Machine}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{row.Problème}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{row.Cause}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{row.Action}</td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.Date}</td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(row.Statut)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 2: AMDEC MATRIX */}
            {activeTab === 'amdec' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animation-fade-in text-sm transition-colors">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Analyse des Modes de Défaillance, de leurs Effets et de leur Criticité</h3>
                        <span className="block px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm">
                            {Data_AMDEC ? Data_AMDEC.length : 0} Lignes Analysées
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-600 dark:text-gray-400">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4">Machine</th>
                                    <th className="px-6 py-4">Fonction</th>
                                    <th className="px-6 py-4">Mode de Défaillance</th>
                                    <th className="px-6 py-4">Effet</th>
                                    <th className="px-4 py-4 text-center" title="Sévérité (1-10)">S</th>
                                    <th className="px-4 py-4 text-center" title="Occurrence (1-10)">O</th>
                                    <th className="px-4 py-4 text-center" title="Détection (1-10)">D</th>
                                    <th className="px-6 py-4 text-center">IPR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {(!Data_AMDEC || Data_AMDEC.length === 0) ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-12 text-gray-400 dark:text-gray-500">Aucune analyse AMDEC disponible.</td>
                                    </tr>
                                ) : (
                                    Data_AMDEC.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{row.Machine}</td>
                                            <td className="px-6 py-4">{row.Fonction}</td>
                                            <td className="px-6 py-4 text-red-600 dark:text-red-400">{row['Mode de Défaillance']}</td>
                                            <td className="px-6 py-4">{row.Effet}</td>
                                            <td className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">{row.S}</td>
                                            <td className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">{row.O}</td>
                                            <td className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">{row.D}</td>
                                            <td className="px-6 py-4 flex justify-center">
                                                {getIPRBadge(row.IPR)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AmdecPage;
