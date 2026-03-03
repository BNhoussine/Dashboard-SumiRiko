import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PlaceholderPage from './pages/PlaceholderPage';
import DatabasePage from './pages/DatabasePage';
import VueGlobalePage from './pages/VueGlobalePage';
import AnalyseParetoPage from './pages/AnalyseParetoPage';
import SuiviPreventifPage from './pages/SuiviPreventifPage';
import AmdecPage from './pages/AmdecPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<VueGlobalePage />} />
          <Route path="pareto" element={<AnalyseParetoPage />} />
          <Route path="preventif" element={<SuiviPreventifPage />} />
          <Route path="amdec" element={<AmdecPage />} />
          <Route path="bdd" element={<DatabasePage />} />
          <Route path="*" element={<PlaceholderPage title="Erreur 404 - Page non trouvée" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
