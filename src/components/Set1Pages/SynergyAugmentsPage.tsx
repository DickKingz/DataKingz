import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Layers } from 'lucide-react';
import { synergyImprintImageMap } from '../../data/AugmentData/Synergy/synergyImprintImageMap';

interface SynergyAugmentPageProps {
  onBack: () => void;
}

interface SynergyAugment {
  id: string;
  name: string;
  description: string;
  image: string;
  rawJson: any;
}

// Dynamically import all JSON files in the Synergy directory
const synergyAugmentModules = import.meta.glob('../../data/AugmentData/Synergy/*.json', { eager: true });

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, '');
}

function parseSynergyAugment(json: any): SynergyAugment {
  const sanitized = sanitizeName(json.DisplayName || json.Name);
  const imageUrl = synergyImprintImageMap[sanitized] || '/placeholder.png';
  return {
    id: json.Name || json.DisplayName,
    name: json.DisplayName,
    description: json.DisplayDescriptionNormalized,
    image: imageUrl,
    rawJson: json,
  };
}

const SynergyAugmentsPage: React.FC<SynergyAugmentPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [augments, setAugments] = useState<SynergyAugment[]>([]);

  useEffect(() => {
    const loadedAugments: SynergyAugment[] = [];
    for (const path in synergyAugmentModules) {
      const mod = synergyAugmentModules[path] as any;
      const json = mod.default || mod;
      loadedAugments.push(parseSynergyAugment(json));
    }
    setAugments(loadedAugments);
  }, []);

  const filteredAugments = augments.filter(augment => {
    const matchesSearch = augment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      augment.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Custom Synergy Augments Header */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-red-900/20 to-yellow-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,191,36,0.2),transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(251,146,60,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Floating Sparkles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-br from-orange-400/40 to-yellow-400/40 rounded-full animate-bounce opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        {/* Glass morphism overlay */}
        <div className="relative backdrop-blur-xl bg-gray-900/80 border-b border-gray-700/50">
          <div className="px-8 py-8">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-700/50 backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Set 1
              </button>
            </div>
            {/* Main Header */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-yellow-500 to-red-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-all duration-300 group-hover:scale-105">
                  <Layers className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-yellow-500 to-red-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <div>
                <h1 className="text-5xl font-black mb-2">
                  <span className="bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent">
                    SYNERGY AUGMENTS
                  </span>
                </h1>
                <p className="text-xl text-gray-400 mb-2">Team synergy boosters that amplify composition strength</p>
                <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-4 py-1 rounded-full font-bold text-sm inline-block">
                  META SYNERGY
                </div>
              </div>
              {/* Enhanced Search */}
              <div className="relative group ml-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search synergy augments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800/50 backdrop-blur-sm text-white pl-12 pr-6 py-3 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 w-80 hover:bg-gray-700/50 group-hover:border-gray-600/50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-8">
        {/* Synergy Augments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAugments.map((augment) => (
            <div key={augment.id} className="bg-gray-900 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 overflow-hidden group flex flex-col items-center py-8 px-4 hover:shadow-[0_0_32px_8px_rgba(251,191,36,0.15)]">
              {/* Large Image */}
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-black border-2 border-orange-500 shadow-lg overflow-hidden flex items-center justify-center mb-4">
                <img
                  src={augment.image}
                  alt={augment.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.src.includes('/placeholder.png')) return;
                    img.src = '/placeholder.png';
                  }}
                />
              </div>
              {/* Name */}
              <h3 className="text-white font-extrabold text-2xl md:text-3xl text-center mb-2 drop-shadow-lg">{augment.name}</h3>
              {/* Description */}
              <div className="w-full mb-4">
                <p className="text-orange-100 text-lg font-medium text-center leading-relaxed">{augment.description}</p>
              </div>
            </div>
          ))}
        </div>
        {filteredAugments.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400 text-lg mb-2">No synergy augments found</div>
            <div className="text-gray-500 text-sm">Try adjusting your search</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SynergyAugmentsPage; 