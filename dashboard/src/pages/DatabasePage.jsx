import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { CloudUpload, Zap, FileSpreadsheet } from 'lucide-react';
import useStore from '../store/useStore';

const DatabasePage = () => {
    const [isDragging, setIsDragging] = useState(false);
    const { Data_KPI, setKPIData, loadDemoData } = useStore();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const processFile = (file) => {
        if (!file || (file.type !== 'text/csv' && !file.name.endsWith('.csv'))) {
            alert('Veuillez importer un fichier CSV valide.');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setKPIData(results.data);
            },
            error: (error) => {
                alert('Erreur lors du traitement du fichier CSV : ' + error.message);
            }
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER SECTION */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Importation des données</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Importez vos fichiers CSV ou générez un jeu d'essai pour le tableau de bord.</p>
                </div>

                <button
                    onClick={() => loadDemoData()}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-md"
                >
                    <Zap size={18} className="text-yellow-400" />
                    Charger données de démonstration
                </button>
            </div>

            {/* DRAG & DROP ZONE */}
            <div
                className={`bg-white dark:bg-gray-800 border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-4">
                    <CloudUpload size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Glissez & Déposez vos fichiers CSV ici</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 mt-2 max-w-sm text-center">
                    Les fichiers CSV doivent contenir les colonnes standard pour l'analyse des KPIs (Date, UAP, Machine, MTBF, MTTR, etc.)
                </p>

                <div className="flex items-center gap-4 w-full max-w-xs">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    <span className="text-sm text-gray-400 font-medium">OU</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                <label className="mt-6 cursor-pointer">
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm inline-block">
                        Parcourir les fichiers
                    </span>
                    <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileInput}
                    />
                </label>
            </div>

            {/* PREVIEW GRID */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                    <FileSpreadsheet size={20} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Aperçu des données (Data_KPI)</h3>
                    <span className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-full">
                        {Data_KPI.length} lignes
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">UAP</th>
                                <th className="px-6 py-4">Machine</th>
                                <th className="px-6 py-4">MTBF (h)</th>
                                <th className="px-6 py-4">MTTR (min)</th>
                                <th className="px-6 py-4">Interventions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {Data_KPI.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-400 dark:text-gray-500">
                                        Aucune donnée n'est actuellement chargée dans l'application.
                                    </td>
                                </tr>
                            ) : (
                                Data_KPI.slice(0, 50).map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-3">{row.Date || '-'}</td>
                                        <td className="px-6 py-3">{row.UAP || '-'}</td>
                                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">{row.Machine || '-'}</td>
                                        <td className="px-6 py-3">{row.MTBF || '-'}</td>
                                        <td className="px-6 py-3">{row.MTTR || '-'}</td>
                                        <td className="px-6 py-3">{row.Interventions || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {Data_KPI.length > 50 && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
                        Affichage des 50 premières lignes...
                    </div>
                )}
            </div>

        </div>
    );
};

export default DatabasePage;
