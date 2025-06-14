import React from 'react';

const AnalyticsMetaTab = ({ topIlluvials, topAugments, illuvialTierFilter, setIlluvialTierFilter, augmentTypeFilter, setAugmentTypeFilter, getIlluvialTier, getIlluvialImageUrl, getAugmentType, getAugmentImageUrl }) => {
  return (
    <div>
      {/* Top Illuvials */}
      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg mb-12">
        <h2 className="text-xl font-bold mb-4">Top Illuvials</h2>
        <div className="flex gap-2 mb-4">
          {[{ label: 'All Tiers', value: 'All' }, { label: 'Tier 1', value: 1 }, { label: 'Tier 2', value: 2 }, { label: 'Tier 3', value: 3 }, { label: 'Tier 4', value: 4 }, { label: 'Tier 5', value: 5 }].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setIlluvialTierFilter(value)}
              className={`px-3 py-1 rounded-full text-sm font-bold ${illuvialTierFilter === value ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {topIlluvials
            .filter(illuvial => illuvialTierFilter === 'All' || getIlluvialTier(illuvial.name, topIlluvials) === illuvialTierFilter)
            .map((illuvial, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-yellow-400">#{index + 1}</span>
                <img src={getIlluvialImageUrl(illuvial)} alt={illuvial.name} className="w-12 h-12 rounded-full bg-gray-800 object-contain" onError={e => (e.currentTarget.src = '/image.png')} />
                <span className="text-white font-bold">{illuvial.name}</span>
                <span className="text-gray-400">{illuvial.usage || illuvial.picks || illuvial.count || '-'}</span>
              </div>
            ))}
        </div>
      </div>
      {/* Top Augments */}
      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg mb-12">
        <h2 className="text-xl font-bold mb-4">Top Augments</h2>
        <div className="flex gap-2 mb-4">
          {['All', 'Synergy', 'Legendary', 'Imprint'].map(type => (
            <button
              key={type}
              onClick={() => setAugmentTypeFilter(type)}
              className={`px-3 py-1 rounded-full text-sm font-bold ${augmentTypeFilter === type ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {topAugments
            .filter(augment => augmentTypeFilter === 'All' || getAugmentType(augment.name, topAugments) === augmentTypeFilter)
            .map((augment, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-yellow-400">#{index + 1}</span>
                <img src={getAugmentImageUrl(augment.name)} alt={augment.name} className="w-12 h-12 rounded-full bg-gray-800 object-contain" onError={e => (e.currentTarget.src = '/image.png')} />
                <span className="text-white font-bold">{augment.name}</span>
                <span className="text-gray-400">{augment.usage || augment.picks || augment.count || '-'}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsMetaTab; 