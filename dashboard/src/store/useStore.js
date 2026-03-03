import { create } from 'zustand';

const useStore = create((set) => ({
    // Data Tables
    Data_KPI: [],
    Data_Preventif: [],
    Data_Machines: [],
    Data_Plan_Action: [],
    Data_AMDEC: [],

    // Actions
    setKPIData: (data) => set({ Data_KPI: data }),

    loadDemoData: () => {
        const uaps = ['639', '640', '670', '671'];
        const machinesNames = {
            '639': ['Presse 1', 'Convoyeur A', 'Four de cuisson'],
            '640': ['Extrudeuse 3', 'Assembleuse B'],
            '670': ['Robot Soudure', 'Presse à injection'],
            '671': ['Ligne Assemblage X', 'Testeur Automatique']
        };

        let fakeKPI = [];
        let fakePreventif = [];
        let fakeMachines = [];
        let fakePlanAction = [];
        let fakeAmdec = [];
        let dateCounter = new Date();
        const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];

        uaps.forEach((uap) => {
            machinesNames[uap].forEach((machine) => {
                // Data_Machines
                const criticites = ['A', 'B', 'C'];
                const crit = criticites[Math.floor(Math.random() * criticites.length)];
                fakeMachines.push({ UAP: uap, Machine: machine, Criticite: crit });

                // Data_KPI (MTBF 300-1500, MTTR 15-60)
                const mtbf = Math.floor(Math.random() * (1500 - 300 + 1)) + 300;
                const mttr = Math.floor(Math.random() * (60 - 15 + 1)) + 15;
                const interventions = Math.floor(Math.random() * 8) + 1;

                fakeKPI.push({
                    Date: dateCounter.toISOString().split('T')[0],
                    UAP: uap,
                    Machine: machine,
                    Interventions: interventions,
                    Heures_Arret: Math.round((mttr * interventions) / 60), // Approximated
                    MTBF: mtbf,
                    MTTR: mttr
                });

                // Data_Preventif
                moisNoms.forEach(m => {
                    const hp = Math.floor(Math.random() * 20) + 10;
                    const hr = Math.floor(hp * (Math.random() * 0.4 + 0.6));
                    fakePreventif.push({
                        Mois: m,
                        UAP: uap,
                        Machine: machine,
                        Heures_Planifiees: hp,
                        Heures_Realisees: hr
                    });
                });

                // Data_Plan_Action
                const statuts = ['Clôturé', 'En cours', 'En retard'];
                fakePlanAction.push({
                    UAP: uap,
                    Machine: machine,
                    Problème: `Défaillance aléatoire n°${Math.floor(Math.random() * 100)}`,
                    Cause: 'Usure mécanique',
                    Action: 'Remplacement préventif',
                    Date: `2024-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                    Statut: statuts[Math.floor(Math.random() * statuts.length)]
                });

                // Data_AMDEC
                const s = Math.floor(Math.random() * 10) + 1;
                const o = Math.floor(Math.random() * 10) + 1;
                const d = Math.floor(Math.random() * 10) + 1;
                fakeAmdec.push({
                    Machine: machine,
                    Fonction: 'Fonction primaire de production',
                    'Mode de Défaillance': 'Usure ou Blocage',
                    Effet: 'Arrêt complet ou micro-arrêt',
                    S: s,
                    O: o,
                    D: d,
                    IPR: s * o * d
                });
            });
        });

        set({
            Data_KPI: fakeKPI,
            Data_Preventif: fakePreventif,
            Data_Machines: fakeMachines,
            Data_Plan_Action: fakePlanAction,
            Data_AMDEC: fakeAmdec
        });
    }
}));

export default useStore;
