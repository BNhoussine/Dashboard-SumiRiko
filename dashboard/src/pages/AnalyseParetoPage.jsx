import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Database, AlertTriangle } from 'lucide-react';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import useStore from '../store/useStore';

const AnalyseParetoPage = () => {
    const { Data_KPI } = useStore();

    // 1. Process Pareto Data
    const paretoData = useMemo(() => {
        if (!Data_KPI || Data_KPI.length === 0) return [];

        // Group by machine and sum downtime
        const machineGroups = {};
        let totalGlobalDowntime = 0;

        Data_KPI.forEach(row => {
            const machine = row.Machine;
            const uap = row.UAP;
            const downtime = Number(row.Heures_Arret) || 0;

            if (!machine) return;

            if (!machineGroups[machine]) {
                machineGroups[machine] = { name: machine, uap: uap, downtime: 0 };
            }
            machineGroups[machine].downtime += downtime;
            totalGlobalDowntime += downtime;
        });

        // Convert to array and sort descending
        let sortedData = Object.values(machineGroups).sort((a, b) => b.downtime - a.downtime);

        // Calculate cumulative percentage
        let cumulativeSum = 0;
        sortedData = sortedData.map(item => {
            cumulativeSum += item.downtime;
            const percentage = totalGlobalDowntime > 0 ? (cumulativeSum / totalGlobalDowntime) * 100 : 0;
            return {
                ...item,
                cumulativePercentage: Number(percentage.toFixed(2))
            };
        });

        return sortedData;
    }, [Data_KPI]);

    // 2. Filter Critical Machines (80/20 rule)
    // We keep machines <= 80%, plus the very first one that crosses the 80% line.
    const criticalMachines = useMemo(() => {
        let thresholdMet = false;
        return paretoData.filter(item => {
            if (thresholdMet) return false;
            if (item.cumulativePercentage >= 80) thresholdMet = true;
            return true;
        });
    }, [paretoData]);

    // 3. Render Empty State
    if (!Data_KPI || Data_KPI.length === 0 || paretoData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
                <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[400px]">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-600">
                        <Database size={40} className="opacity-70" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Aucune donnée disponible</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">
                        Il semblerait que le tableau de bord soit vide. Veuillez importer des fichiers CSV pour commencer l'analyse de Pareto.
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

    // 4. Render Main Dashboard
    return (
        <div className="space-y-6">

            {/* Header Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-between transition-colors">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Analyse de Pareto</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Loi des 80/20 : Identification des machines générant le plus d'heures d'arrêt.</p>
                </div>
                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg border border-red-100 dark:border-red-800/50">
                    <AlertTriangle size={20} />
                    <span className="font-semibold">{criticalMachines.length} Machine(s) Critique(s)</span>
                </div>
            </div>

            {/* CHART SECTION */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <ComposedChart
                            data={paretoData}
                            margin={{ top: 20, right: 30, bottom: 20, left: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-20" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                dy={10}
                                angle={paretoData.length > 8 ? -45 : 0}
                                textAnchor={paretoData.length > 8 ? 'end' : 'middle'}
                                height={60}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                label={{ value: "Heures d'arrêt", angle: -90, position: 'insideLeft', offset: -5, fill: '#9ca3af', fontSize: 13 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                formatter={(value, name) => {
                                    if (name === 'downtime') return [`${value} Heures`, "Heures d'arrêt"];
                                    if (name === 'cumulativePercentage') return [`${value}%`, '% Cumulé'];
                                    return [value, name];
                                }}
                            />
                            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
                            <Bar
                                yAxisId="left"
                                dataKey="downtime"
                                name="Heures d'arrêt"
                                fill="#4b5563"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="cumulativePercentage"
                                name="% Cumulé"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                            />
                            <ReferenceLine
                                yAxisId="right"
                                y={80}
                                stroke="#ef4444"
                                strokeDasharray="4 4"
                                label={{ position: 'top', value: 'Seuil 80%', fill: '#ef4444', fontSize: 13, fontWeight: 500 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* CRITICAL MACHINES TABLE */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Machines Critiques (Zone 80%)</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ces machines sont responsables de 80% du volume total des temps d'arrêt.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4">Machine</th>
                                <th className="px-6 py-4">UAP</th>
                                <th className="px-6 py-4 text-right">Total Heures d'arrêt</th>
                                <th className="px-6 py-4 text-right">% Cumulé</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {criticalMachines.map((machine, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{machine.name}</span>
                                        <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                            Critique
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{machine.uap || '-'}</td>
                                    <td className="px-6 py-4 text-right font-medium">{machine.downtime} h</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="w-12 text-gray-900 dark:text-gray-100 font-medium">{machine.cumulativePercentage}%</span>
                                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-400 dark:bg-red-500 rounded-full"
                                                    style={{ width: `${machine.cumulativePercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default AnalyseParetoPage;
