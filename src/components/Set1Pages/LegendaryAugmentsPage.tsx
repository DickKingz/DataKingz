import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Filter, Sparkles, Star, Zap, Target, Shield, Coins, Crown, Gem, Wand2, Flame, Swords, Heart } from 'lucide-react';
import { legendaryAugmentImageMap } from '../../data/AugmentData/Legendary/legendaryAugmentImageMap';
import { useNavigate } from 'react-router-dom';

interface LegendaryAugmentPageProps {
  onBack: () => void;
}

interface LegendaryAugment {
  id: string;
  name: string;
  description: string;
  effects: string[];
  image: string;
  rawJson: any;
}

// Dynamically import all JSON files in the Legendary directory
const legendaryAugmentModules = import.meta.glob('../../data/AugmentData/Legendary/*.json', { eager: true });

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, '');
}

function parseLegendaryAugment(json: any): LegendaryAugment {
  const sanitized = sanitizeName(json.DisplayName);
  const imageUrl = legendaryAugmentImageMap[sanitized] || '/placeholder.png';
  console.log(`Legendary Augment: ${json.DisplayName} | Sanitized Key: ${sanitized} | Image URL: ${imageUrl}`);
  return {
    id: json.Name || json.DisplayName,
    name: json.DisplayName,
    description: json.DisplayDescriptionNormalized.split('\n')[0],
    effects: json.DisplayDescriptionNormalized
      .split('\n')
      .filter((line: string) => line.trim().startsWith('+')),
    image: imageUrl,
    rawJson: json,
  };
}

const LegendaryAugmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [augments, setAugments] = useState<LegendaryAugment[]>([]);

  useEffect(() => {
    const loadedAugments: LegendaryAugment[] = [];
    for (const path in legendaryAugmentModules) {
      const mod = legendaryAugmentModules[path] as any;
      const json = mod.default || mod;
      loadedAugments.push(parseLegendaryAugment(json));
    }
    setAugments(loadedAugments);
  }, []);

  const handleBack = () => {
    navigate('/app/set1');
  };

  const filteredAugments = augments.filter(augment => {
    const matchesSearch = augment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         augment.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Custom Legendary Augments Header */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-orange-900/20 to-red-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(234,179,8,0.2),transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(239,68,68,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating Sparkles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-br from-yellow-400/40 to-orange-400/40 rounded-full animate-bounce opacity-60"
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
          <div className="px-8 py-12">
            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-700/50 backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Set 1
              </button>
            </div>

            {/* Content */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Legendary Augments</h1>
              <p className="text-gray-400">Discover the most powerful augments in Set 1</p>
            </div>

            {/* Enhanced Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search legendary augments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800/50 backdrop-blur-sm text-white pl-12 pr-6 py-3 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-300 w-80 hover:bg-gray-700/50 group-hover:border-gray-600/50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Legendary Augments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAugments.map((augment) => (
            <div key={augment.id} className="bg-gray-900 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 overflow-hidden group flex flex-col items-center py-8 px-4 hover:shadow-[0_0_32px_8px_rgba(234,179,8,0.15)]">
              {/* Large Image */}
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-black border-2 border-yellow-500 shadow-lg overflow-hidden flex items-center justify-center mb-4">
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
              {/* Legendary Badge */}
              <span className="px-4 py-2 rounded-full text-base font-bold border mt-1 mb-4 text-yellow-400 bg-yellow-400/10 border-yellow-400/30 text-center">Legendary</span>
              {/* Description */}
              <div className="w-full mb-4">
                <p className="text-yellow-100 text-lg font-medium text-center leading-relaxed">{augment.description}</p>
              </div>
              {/* Effects/Stats */}
              {augment.effects && augment.effects.length > 0 && (
                <div className="w-full">
                  <h4 className="text-yellow-200 font-bold text-lg mb-3 text-center">Stats:</h4>
                  <div className="space-y-3">
                    {augment.effects.map((effect, idx) => (
                      <div key={idx} className="flex items-start gap-3 justify-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-yellow-100 text-base font-semibold leading-relaxed">{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAugments.length === 0 && (
          <div className="text-center py-12">
            <Crown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400 text-lg mb-2">No legendary augments found</div>
            <div className="text-gray-500 text-sm">Try adjusting your search</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegendaryAugmentsPage; 