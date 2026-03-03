import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Database, Clock, Timer, Wrench, PowerOff, Download } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import useStore from '../store/useStore';

const VueGlobalePage = () => {
    const { Data_KPI } = useStore();

    // 1. Check for Empty State
    if (!Data_KPI || Data_KPI.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
                <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[400px]">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-600">
                        <Database size={40} className="opacity-70" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Aucune donnée disponible</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">
                        Il semblerait que le tableau de bord soit vide. Veuillez importer des fichiers CSV pour commencer l'analyse.
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

    // 2. Compute Global KPIs
    const globalKPIs = useMemo(() => {
        let sumMTBF = 0;
        let sumMTTR = 0;
        let sumInterventions = 0;
        let sumDowntime = 0;

        Data_KPI.forEach(row => {
            sumMTBF += Number(row.MTBF) || 0;
            sumMTTR += Number(row.MTTR) || 0;
            sumInterventions += Number(row.Interventions) || 0;
            sumDowntime += Number(row.Heures_Arret) || 0;
        });

        const count = Data_KPI.length;

        return {
            avgMTBF: count > 0 ? Math.round(sumMTBF / count) : 0,
            avgMTTR: count > 0 ? Math.round(sumMTTR / count) : 0,
            totalInterventions: sumInterventions,
            totalDowntime: sumDowntime
        };
    }, [Data_KPI]);

    // 3. Compute Data Array for Recharts (Averages per UAP)
    const chartData = useMemo(() => {
        const uapGroups = {};

        Data_KPI.forEach(row => {
            const uap = row.UAP;
            if (!uap) return;
            if (!uapGroups[uap]) {
                uapGroups[uap] = { sumMTBF: 0, sumMTTR: 0, count: 0 };
            }
            uapGroups[uap].sumMTBF += Number(row.MTBF) || 0;
            uapGroups[uap].sumMTTR += Number(row.MTTR) || 0;
            uapGroups[uap].count += 1;
        });

        return Object.keys(uapGroups).sort().map(uap => ({
            UAP: uap,
            MTBF: Math.round(uapGroups[uap].sumMTBF / uapGroups[uap].count),
            MTTR: Math.round(uapGroups[uap].sumMTTR / uapGroups[uap].count)
        }));
    }, [Data_KPI]);

    // UI Components
    return (
        <div className="space-y-6">

            {/* HEADER WITH PDF EXPORT */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-between transition-colors">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Indicateurs Globaux</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Synthèse des performances de maintenance</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
                >
                    <Download size={18} />
                    Exporter en PDF
                </button>
            </div>

            {/* SCORECARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Scorecard 1: MTBF */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/40 p-3 rounded-lg text-blue-600 dark:text-blue-400">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MTBF Moyen Global</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{globalKPIs.avgMTBF} h</h3>
                        </div>
                    </div>
                </div>

                {/* Scorecard 2: MTTR */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-50 dark:bg-red-900/40 p-3 rounded-lg text-red-500 dark:text-red-400">
                            <Timer size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MTTR Moyen Global</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{globalKPIs.avgMTTR} min</h3>
                        </div>
                    </div>
                </div>

                {/* Scorecard 3: Interventions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/40 p-3 rounded-lg text-yellow-600 dark:text-yellow-400">
                            <Wrench size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Interventions</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{globalKPIs.totalInterventions}</h3>
                        </div>
                    </div>
                </div>

                {/* Scorecard 4: Downtime */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-50 dark:bg-purple-900/40 p-3 rounded-lg text-purple-600 dark:text-purple-400">
                            <PowerOff size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Heures d'arrêt</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{globalKPIs.totalDowntime} h</h3>
                        </div>
                    </div>
                </div>

            </div>

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* CHART 1: MTBF par UAP */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">MTBF par UAP</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-20" />
                                <XAxis dataKey="UAP" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                    formatter={(value) => [`${value} Heures`, 'MTBF']}
                                    itemStyle={{ color: '#1e3a8a' }}
                                />
                                <ReferenceLine
                                    y={360}
                                    stroke="#10b981"
                                    strokeDasharray="4 4"
                                    label={{ position: 'top', value: 'Objectif: 360h', fill: '#10b981', fontSize: 13, fontWeight: 500 }}
                                />
                                <Bar dataKey="MTBF" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHART 2: MTTR par UAP */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">MTTR par UAP</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-20" />
                                <XAxis dataKey="UAP" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                    formatter={(value) => [`${value} Minutes`, 'MTTR']}
                                    itemStyle={{ color: '#ef4444' }}
                                />
                                <ReferenceLine
                                    y={35}
                                    stroke="#ef4444"
                                    strokeDasharray="4 4"
                                    label={{ position: 'top', value: 'Objectif: 35min', fill: '#ef4444', fontSize: 13, fontWeight: 500 }}
                                />
                                <Bar dataKey="MTTR" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default VueGlobalePage;
