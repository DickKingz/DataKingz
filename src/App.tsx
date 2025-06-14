import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
import AnalyticsPage from './components/AnalyticsPage';
import SynergyAugmentsPage from './components/Set1Pages/SynergyAugmentsPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<'augments' | 'comps' | 'items' | 'gauntlet' | 'tournaments'>('augments');
  const [selectedComp, setSelectedComp] = useState<string | null>(null);
  const [showCompBuilder, setShowCompBuilder] = useState(false);
  const [showCommunitySubmissions, setShowCommunitySubmissions] = useState(false);
  const [showGuidePage, setShowGuidePage] = useState(false);
  const [showTournaments, setShowTournaments] = useState(false);
  const [showTournamentCreator, setShowTournamentCreator] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  
  // Set 1 page states
  const [showSet1Page, setShowSet1Page] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [guideTopic, setGuideTopic] = useState<string>('dictionary');

  const handleNavigateFromLanding = (destination: string) => {
    setCurrentPage('app');
    // Reset all sub-page states
    setShowGuidePage(false);
    setShowCompBuilder(false);
    setShowCommunitySubmissions(false);
    setShowTournaments(false);
    setShowTournamentCreator(false);
    setSelectedComp(null);
    setSelectedTournament(null);
    setShowSet1Page(null);
    setShowAnalytics(false);

    switch (destination) {
      case 'analytics':
        setShowAnalytics(true);
        break;
      case 'tierlist':
        setActiveTab('comps');
        break;
      case 'guides':
        setShowGuidePage(true);
        break;
      case 'community':
        setShowCommunitySubmissions(true);
        break;
      case 'tournaments':
        setShowTournaments(true);
        break;
      case 'set1':
        setShowSet1Page('main');
        break;
      case 'illuvials':
      case 'augments':
      case 'legendary-augments':
      case 'weapons':
      case 'drone-augments':
      case 'amplifiers':
        setShowSet1Page(destination);
        break;
      default:
        break;
    }
  };

  // Enhanced navigation handler that resets all states and navigates properly
  const handleTabChange = (tab: 'augments' | 'comps' | 'items' | 'gauntlet' | 'tournaments') => {
    // Reset all sub-page states
    setShowGuidePage(false);
    setShowCompBuilder(false);
    setShowCommunitySubmissions(false);
    setShowTournaments(false);
    setShowTournamentCreator(false);
    setSelectedComp(null);
    setSelectedTournament(null);
    setShowSet1Page(null);
    
    // Set the new active tab
    setActiveTab(tab);
    
    // Ensure we're in the app page
    setCurrentPage('app');
  };

  // Enhanced navigation handlers for specific actions
  const handleShowGuides = (topic: string = 'dictionary') => {
    setShowCompBuilder(false);
    setShowCommunitySubmissions(false);
    setShowTournaments(false);
    setShowTournamentCreator(false);
    setSelectedComp(null);
    setSelectedTournament(null);
    setShowSet1Page(null);
    setGuideTopic(topic);
    setShowGuidePage(true);
    setCurrentPage('app');
  };

  const handleShowTournaments = () => {
    // Reset all other states
    setShowGuidePage(false);
    setShowCompBuilder(false);
    setShowCommunitySubmissions(false);
    setShowTournamentCreator(false);
    setSelectedComp(null);
    setSelectedTournament(null);
    setShowSet1Page(null);
    
    // Show tournaments
    setShowTournaments(true);
    setCurrentPage('app');
  };

  const handleShowBuilder = () => {
    // Reset all other states
    setShowGuidePage(false);
    setShowCommunitySubmissions(false);
    setShowTournaments(false);
    setShowTournamentCreator(false);
    setSelectedComp(null);
    setSelectedTournament(null);
    setShowSet1Page(null);
    
    // Show comp builder
    setShowCompBuilder(true);
    setCurrentPage('app');
  };

  const handleShowCommunity = () => {
    // Reset all other states
    setShowGuidePage(false);
    setShowCompBuilder(false);
    setShowTournaments(false);
    setShowTournamentCreator(false);
    setSelectedComp(null);
    setSelectedTournament(null);
    setShowSet1Page(null);
    
    // Show community submissions
    setShowCommunitySubmissions(true);
    setCurrentPage('app');
  };

  // Set 1 navigation handler
  const handleShowSet1Page = (page: string) => {
    // Reset all other states
    setShowGuidePage(false);
    setShowCompBuilder(false);
    setShowCommunitySubmissions(false);
    setShowTournaments(false);
    setShowTournamentCreator(false);
    setSelectedComp(null);
    setSelectedTournament(null);
    
    // Show Set 1 page
    setShowSet1Page(page);
    setCurrentPage('app');
  };

  // Set 1 main page navigation
  const handleShowSet1Main = () => {
    // Reset all other states
    setShowGuidePage(false);
    setShowCompBuilder(false);
    setShowCommunitySubmissions(false);
    setShowTournaments(false);
    setShowTournamentCreator(false);
    setSelectedComp(null);
    setSelectedTournament(null);
    
    // Show Set 1 main page
    setShowSet1Page('main');
    setCurrentPage('app');
  };

  // Determine if we should show tab navigation
  const shouldShowTabNavigation = () => {
    // Don't show tab navigation if we're on any sub-page
    if (showGuidePage || showCompBuilder || showCommunitySubmissions || showTournaments || showSet1Page) {
      return false;
    }
    
    // Only show tab navigation on main tierlist pages
    return true;
  };

  // Function to determine current page context for header
  const getCurrentPageContext = () => {
    if (showSet1Page) {
      if (showSet1Page === 'main') {
        return { currentPage: 'set1', currentSubPage: undefined };
      } else {
        return { currentPage: 'set1', currentSubPage: showSet1Page };
      }
    }
    
    if (showGuidePage) {
      return { currentPage: 'guides', currentSubPage: undefined };
    }
    
    if (showCompBuilder) {
      return { currentPage: 'tools', currentSubPage: 'builder' };
    }
    
    if (showCommunitySubmissions) {
      return { currentPage: 'tools', currentSubPage: 'community' };
    }
    
    if (showTournaments) {
      return { currentPage: 'tournaments', currentSubPage: undefined };
    }
    
    // Default to tierlist context
    return { currentPage: 'tierlist', currentSubPage: undefined };
  };

  const renderContent = () => {
    if (showAnalytics) {
      return <AnalyticsPage onBack={() => setShowAnalytics(false)} />;
    }
    // Set 1 pages take priority
    if (showSet1Page) {
      switch (showSet1Page) {
        case 'main':
          return (
            <Set1LandingPage 
              onBack={() => setShowSet1Page(null)} 
              onNavigateToPage={(page) => setShowSet1Page(page)}
            />
          );
        case 'illuvials':
          return <IlluvialsPage onBack={() => setShowSet1Page('main')} />;
        case 'augments':
          return <AugmentsPage onBack={() => setShowSet1Page('main')} />;
        case 'legendary-augments':
          return <LegendaryAugmentsPage onBack={() => setShowSet1Page('main')} />;
        case 'weapons':
          return <WeaponsPage onBack={() => setShowSet1Page('main')} />;
        case 'drone-augments':
          return <DroneAugmentsPage onBack={() => setShowSet1Page('main')} />;
        case 'synergy-augments':
          return <SynergyAugmentsPage onBack={() => setShowSet1Page('main')} />;
        default:
          return (
            <div className="p-8 text-center">
              <div className="text-white text-xl mb-4">Set 1 Page: {showSet1Page}</div>
              <div className="text-gray-400">Coming soon...</div>
              <button 
                onClick={() => setShowSet1Page('main')}
                className="mt-4 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Back to Set 1
              </button>
            </div>
          );
      }
    }

    if (showGuidePage) {
      return <GuidePage onBack={() => setShowGuidePage(false)} initialGuide={guideTopic} />;
    }

    if (showCompBuilder) {
      return <CompBuilder onBack={() => setShowCompBuilder(false)} />;
    }

    if (showCommunitySubmissions) {
      return <CommunitySubmissions onBack={() => setShowCommunitySubmissions(false)} />;
    }

    if (showTournaments) {
      if (showTournamentCreator) {
        return (
          <TournamentCreator 
            onBack={() => setShowTournamentCreator(false)}
            onCreateTournament={(tournament) => {
              console.log('Creating tournament:', tournament);
              setShowTournamentCreator(false);
              // Here you would typically save to backend
            }}
          />
        );
      }

      if (selectedTournament) {
        return (
          <TournamentView
            tournamentId={selectedTournament}
            onBack={() => setSelectedTournament(null)}
            onJoinTournament={(tournamentId) => {
              console.log('Joining tournament:', tournamentId);
              // Here you would handle tournament registration
            }}
          />
        );
      }

      return (
        <TournamentList
          onCreateTournament={() => setShowTournamentCreator(true)}
          onJoinTournament={(tournamentId) => {
            console.log('Joining tournament:', tournamentId);
            // Here you would handle tournament registration
          }}
          onViewTournament={(tournamentId) => setSelectedTournament(tournamentId)}
        />
      );
    }

    if (activeTab === 'comps' && selectedComp) {
      const comp = mockCompositions.find(c => c.id === selectedComp);
      return comp ? <TeamComposition composition={comp} onBack={() => setSelectedComp(null)} /> : null;
    }

    switch (activeTab) {
      case 'augments':
        return <TierList items={mockAugments} type="augments" />;
      case 'items':
        return <TierList items={mockItems} type="items" />;
      case 'gauntlet':
        return <GauntletInfo data={mockGauntletData} />;
      case 'comps':
        return (
          <CompsTierList 
            compositions={mockCompositions} 
            onSelectComp={setSelectedComp}
            onShowBuilder={handleShowBuilder}
            onShowCommunity={handleShowCommunity}
          />
        );
      default:
        return null;
    }
  };

  if (currentPage === 'landing') {
    return (
      <AuthProvider>
        <LandingPage onNavigate={handleNavigateFromLanding} />
      </AuthProvider>
    );
  }

  const pageContext = getCurrentPageContext();

  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-950">
          <Header 
            activeTab={showTournaments ? 'tournaments' : activeTab} 
            onTabChange={handleTabChange}
            onShowBuilder={handleShowBuilder}
            onShowCommunity={handleShowCommunity}
            onShowGuides={handleShowGuides}
            onShowTournaments={handleShowTournaments}
            onShowSet1Page={handleShowSet1Page}
            onShowSet1Main={handleShowSet1Main}
            onShowAnalytics={() => setShowAnalytics(true)}
            showTabNavigation={shouldShowTabNavigation()}
            currentPage={pageContext.currentPage}
            currentSubPage={pageContext.currentSubPage}
          />
          {renderContent()}
        </div>
      </DndProvider>
    </AuthProvider>
  );
}

export default App;