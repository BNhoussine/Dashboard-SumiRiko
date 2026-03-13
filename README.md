# Dashboard de Maintenance Prédictive & Dashboarding - SumiRiko HTN

![Aperçu du Dashboard](./public/preview.png) *(Optionnel: Ajoutez un screenshot de votre app ici)*

## 📖 Contexte
Ce projet a été développé dans le cadre de la méthode **DMAIC** (Définir, Mesurer, Analyser, Innover, Contrôler) pour digitaliser et piloter le suivi de maintenance industrielle chez **SumiRiko HTN**. L'objectif est d'abandonner les suivis manuels fastidieux au profit d'un outil décisionnel dynamique, capable d'analyser les pannes en temps réel et d'orienter les actions préventives et correctives de manière stratégique.

## ✨ Fonctionnalités Principales
- **Analyse des KPI Globaux** : Calcul instantané et visualisation de la performance (MTBF : Moyenne des Temps de Bon Fonctionnement, MTTR : Temps Moyen de Réparation).
- **Analyse de Pareto (80/20)** : Identification dynamique des machines les plus critiques causant 80% des heures d'arrêt, orientant ainsi les actions urgentes.
- **Suivi Préventif** : Comparaison visuelle entre les heures de maintenance planifiées vs réalisées, avec filtrage par UAP (Unité Autonome de Production).
- **Plan d'Action Maintenance** : Suivi des actions correctives, gestion des statuts (Clôturé, En cours, En retard) pour l'amélioration continue.
- **Matrice AMDEC (FMEA)** : Table de cotation intégrée calculant automatiquement l'IPR (Indicateur de Priorité du Risque) basé sur la Sévérité, l'Occurrence et la Détection.
- **Exportation de Données** : Bouton d'export en document PDF pour les réunions de direction, et extraction des plans d'action au format CSV.
- **Dark Mode (Mode Sombre)** : Interface "Salle de contrôle" professionnelle disponible afin de réduire la fatigue visuelle des techniciens.
- **Design Entièrement Réactif** : Interface conçue pour s'afficher parfaitement sur écran géant d'usine comme sur le smartphone d'un superviseur (Menu Hamburger).

## 🛠️ Technologies Utilisées
Ce projet est construit avec des technologies modernes et performantes du monde Web :
- **Framework** : [React.js](https://react.dev/) (Vite)
- **Stylisation** : [Tailwind CSS v4](https://tailwindcss.com/) pour une UI moderne et modulaire.
- **Graphiques** : [Recharts](https://recharts.org/en-US/) pour les diagrammes interactifs (Pareto, Histogrammes, Courbes).
- **État Global** : [Zustand](https://github.com/pmndrs/zustand) pour le management d'état simple, rapide et sans boilerplate.
- **Parseur de Fichiers** : [PapaParse](https://www.papaparse.com/) pour le chargement massif et performant côté client des bases de données CSV.
- **Icônes** : [Lucide-React](https://lucide.dev/)

## 🚀 Installation et Lancement

Pour exécuter ce projet localement, assurez-vous de posséder [Node.js](https://nodejs.org/) installé sur votre machine.

1. **Cloner le répertoire**
   ```bash
   git clone https://github.com/votre-nom-utilisateur/sumiriko-dashboard.git
   cd sumiriko-dashboard
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Accéder à l'application**
   - Ouvrez votre navigateur et rendez-vous sur `http://localhost:5173` (ou le port défini par Vite).

## 📂 Structure du projet (Aperçu)
```text
src/
├── components/   # Composants d'interface (Header, Sidebar, Layout)
├── pages/        # Les différentes vues du dashboard (Pareto, AMDEC, etc.)
├── store/        # Gestion d'état Zustand (useStore.js)
├── index.css     # Fichier CSS global avec directives de @print et dark mode
└── main.jsx      # Point d'entrée React et Routeur
```

## 📄 Licence
Copyright (c) 2026 

All Rights Reserved.

This software and its source code are the exclusive property of me.

No part of this software may be used, copied, modified, distributed, published,
reproduced, reverse-engineered, sublicensed, or sold in any form or by any means
without prior written permission from me.

Unauthorized use of this software is strictly prohibited.

THE SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF ANY KIND.
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY
ARISING FROM THE USE OF THIS SOFTWARE.
