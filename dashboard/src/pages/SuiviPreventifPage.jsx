import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Database, AlertCircle, CheckCircle } from 'lucide-react';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import useStore from '../store/useStore';

const SuiviPreventifPage = () => {
    const { Data_Preventif } = useStore();
    const [selectedUAP, setSelectedUAP] = useState('Toutes les UAP');

    // 1. Get unique UAPs for the filter
    const uniqueUAPs = useMemo(() => {
        if (!Data_Preventif) return [];
        const uaps = new Set(Data_Preventif.map(item => item.UAP).filter(Boolean));
        return Array.from(uaps).sort();
    }, [Data_Preventif]);

    // 2. Filter data based on selected UAP
    const filteredData = useMemo(() => {
        if (!Data_Preventif) return [];
        if (selectedUAP === 'Toutes les UAP') return Data_Preventif;
        return Data_Preventif.filter(item => item.UAP === selectedUAP);
    }, [Data_Preventif, selectedUAP]);

    // 3. Process data for the chart (Group by Month)
    const chartData = useMemo(() => {
        if (!filteredData || filteredData.length === 0) return [];

        const monthGroups = {};

        filteredData.forEach(row => {
            const month = row.Mois;
            if (!month) return;

            if (!monthGroups[month]) {
                monthGroups[month] = { Mois: month, planifiees: 0, realisees: 0 };
            }
            monthGroups[month].planifiees += Number(row.Heures_Planifiees) || 0;
            monthGroups[month].realisees += Number(row.Heures_Realisees) || 0;
        });

        const moisOrder = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

        return Object.values(monthGroups)
            .sort((a, b) => moisOrder.indexOf(a.Mois) - moisOrder.indexOf(b.Mois))
            .map(item => {
                const p = item.planifiees;
                const r = item.realisees;
                const rate = p > 0 ? (r / p) * 100 : 0;
                return {
                    ...item,
                    tauxRealisation: Number(rate.toFixed(2))
                };
            });
    }, [filteredData]);

    // 4. Calculate Rate per Row for the Detailed Table
    const tableData = useMemo(() => {
        return filteredData.map(row => {
            const p = Number(row.Heures_Planifiees) || 0;
            const r = Number(row.Heures_Realisees) || 0;
            const rate = p > 0 ? (r / p) * 100 : 0;
            return {
                ...row,
                tauxRealisation: Number(rate.toFixed(2))
            };
        });
    }, [filteredData]);


    // 5. Render Empty State
    if (!Data_Preventif || Data_Preventif.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
                <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[400px]">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-600">
                        <Database size={40} className="opacity-70" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Aucune donnée disponible</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">
                        Le tableau de bord est vide. Veuillez importer des fichiers CSV pour analyser le suivi préventif.
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

    // 6. Render Main Dashboard
    return (
        <div className="space-y-6">

            {/* FILTER CONTROLS */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Suivi Préventif</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Analyse du respect du plan de maintenance préventive par mois et par UAP.</p>
                </div>
                <div className="flex items-center gap-3">
                    <label htmlFor="uap-filter" className="text-sm font-medium text-gray-600 dark:text-gray-300">Filtrer par UAP :</label>
                    <select
                        id="uap-filter"
                        value={selectedUAP}
                        onChange={(e) => setSelectedUAP(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5 transition-colors focus:outline-none"
                    >
                        <option value="Toutes les UAP">Toutes les UAP</option>
                        {uniqueUAPs.map(uap => (
                            <option key={uap} value={uap}>{uap}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* COMPOSED CHART */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">Ratio de Réalisation du Préventif ({selectedUAP})</h3>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <ComposedChart
                            data={chartData}
                            margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-20" />
                            <XAxis dataKey="Mois" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13 }} dy={10} />

                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 13 }}
                                label={{ value: 'Heures', angle: -90, position: 'insideLeft', offset: 10, fill: '#9ca3af', fontSize: 13 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 13 }}
                                tickFormatter={(value) => `${value}%`}
                            />

                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                formatter={(value, name) => {
                                    if (name === 'planifiees') return [`${value} h`, "Heures Planifiées"];
                                    if (name === 'realisees') return [`${value} h`, "Heures Réalisées"];
                                    if (name === 'tauxRealisation') return [`${value}%`, "Taux de Réalisation"];
                                    return [value, name];
                                }}
                            />
                            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />

                            <Bar yAxisId="left" dataKey="planifiees" name="Heures Planifiées" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                            <Bar yAxisId="left" dataKey="realisees" name="Heures Réalisées" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />

                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="tauxRealisation"
                                name="Taux de Réalisation (%)"
                                stroke="#f97316"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                            />
                            <ReferenceLine
                                yAxisId="right"
                                y={85}
                                stroke="#f97316"
                                strokeDasharray="4 4"
                                label={{ position: 'top', value: 'Objectif 85%', fill: '#f97316', fontSize: 13, fontWeight: 500 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* DETAILS TABLE */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Détail des Interventions</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4">Mois</th>
                                <th className="px-6 py-4">UAP</th>
                                <th className="px-6 py-4">Machine</th>
                                <th className="px-6 py-4 text-right">Heures Planifiées</th>
                                <th className="px-6 py-4 text-right">Heures Réalisées</th>
                                <th className="px-6 py-4 text-right">Taux de Réalisation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {tableData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-400 dark:text-gray-500">
                                        Aucune donnée correspondant à ce filtre.
                                    </td>
                                </tr>
                            ) : (
                                tableData.map((row, idx) => {
                                    const isCritical = row.tauxRealisation < 85;
                                    return (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 font-medium dark:text-gray-200">{row.Mois || '-'}</td>
                                            <td className="px-6 py-4">{row.UAP || '-'}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{row.Machine || '-'}</td>
                                            <td className="px-6 py-4 text-right">{row.Heures_Planifiees || 0} h</td>
                                            <td className="px-6 py-4 text-right">{row.Heures_Realisees || 0} h</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${isCritical ? 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50' : 'bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/50'
                                                    }`}>
                                                    {isCritical ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                                                    <span>{row.tauxRealisation}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default SuiviPreventifPage;
