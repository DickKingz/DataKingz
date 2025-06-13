import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import TierList from './components/TierList';
import CompsTierList from './components/CompsTierList';
import TeamComposition from './components/TeamComposition';
import GauntletInfo from './components/GauntletInfo';
import CompBuilder from './components/CompBuilder';
import CommunitySubmissions from './components/CommunitySubmissions';
import GuidePage from './components/GuidePage';
import TournamentList from './components/TournamentList';
import TournamentCreator from './components/TournamentCreator';
import TournamentView from './components/TournamentView';
import { IlluvialsPage, AugmentsPage, WeaponsPage, Set1LandingPage, LegendaryAugmentsPage, DroneAugmentsPage } from './components/Set1Pages';
import { mockAugments, mockCompositions, mockItems, mockGauntletData } from './data/mockData';

function App() {
  return (
    <AuthProvider>
      <Router>
        <DndProvider backend={HTML5Backend}>
          <div className="min-h-screen bg-gray-950">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Main App Routes */}
              <Route path="/app" element={<Header />}>
                {/* Tier Lists */}
                <Route path="tierlists" element={<Navigate to="/app/tierlists/augments" replace />} />
                <Route path="tierlists/augments" element={<TierList items={mockAugments} type="augments" />} />
                <Route path="tierlists/items" element={<TierList items={mockItems} type="items" />} />
                <Route path="tierlists/comps" element={<CompsTierList compositions={mockCompositions} />} />
                <Route path="tierlists/gauntlet" element={<GauntletInfo data={mockGauntletData} />} />

                {/* Tools */}
                <Route path="tools/builder" element={<CompBuilder />} />
                <Route path="tools/community" element={<CommunitySubmissions />} />

                {/* Guides */}
                <Route path="guides" element={<GuidePage />} />

                {/* Tournaments */}
                <Route path="tournaments" element={<TournamentList />} />
                <Route path="tournaments/create" element={<TournamentCreator />} />
                <Route path="tournaments/:id" element={<TournamentView />} />

                {/* Set 1 Pages */}
                <Route path="set1" element={<Set1LandingPage />} />
                <Route path="set1/illuvials" element={<IlluvialsPage />} />
                <Route path="set1/augments" element={<AugmentsPage />} />
                <Route path="set1/legendary-augments" element={<LegendaryAugmentsPage />} />
                <Route path="set1/weapons" element={<WeaponsPage />} />
                <Route path="set1/drone-augments" element={<DroneAugmentsPage />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </DndProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;