import React from 'react';

const AnalyticsOverviewTab = ({ totals, avgMatchTime, funFacts, dauData, mauData, regionData, regionColors, matchesPlayed, playerActivity }) => {
  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-1">Total Matches</span>
          <span className="text-4xl font-extrabold">{totals.matches}</span>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-1">Total Players</span>
          <span className="text-4xl font-extrabold">{totals.players}</span>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-1">Average Match Time</span>
          <span className="text-4xl font-extrabold">{avgMatchTime} <span className="text-lg font-normal">sec</span></span>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-1">Total Match Results</span>
          <span className="text-4xl font-extrabold">{totals.matchResults}</span>
        </div>
      </div>
      {/* Fun Facts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {funFacts.map((fact, idx) => (
          <div key={idx} className="bg-gradient-to-br from-blue-900/80 to-cyan-900/80 rounded-2xl p-6 shadow-lg flex flex-col items-center border border-blue-700/30">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1">{fact.label}</span>
            <span className="text-2xl font-extrabold text-white mb-1">{fact.value}</span>
            {fact.sub && <span className="text-xs text-slate-400 text-center">{fact.sub}</span>}
          </div>
        ))}
      </div>
      {/* DAU/MAU, Region Pie, etc. can be added here as needed */}
      {/* ... */}
    </div>
  );
};

export default AnalyticsOverviewTab; 