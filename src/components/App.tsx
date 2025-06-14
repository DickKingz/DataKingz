import SynergyAugmentsPage from './components/Set1Pages/SynergyAugmentsPage';

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