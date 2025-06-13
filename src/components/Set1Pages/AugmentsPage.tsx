import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Filter, Sparkles, Star, Zap, Target, Shield, Coins, Crown, Gem, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AugmentPageProps {
  onBack: () => void;
}

interface Augment {
  id: string;
  name: string;
  category: 'brawler' | 'energy' | 'fusion' | 'shield' | 'striker' | 'support' | 'unknown';
  description: string;
  effects: string[];
  synergies?: string[];
  image?: string;
}

interface AugmentCardProps {
  augment: any; // You can replace 'any' with a more specific type if desired
  category: string;
  imageUrl: string;
}

// Dynamically import all JSON files in the Forge directory and subdirectories
const augmentModules = import.meta.glob('../../data/AugmentData/Forge/**/*.json', { eager: true });

function parseAugment(json: any, category: string, imageUrl: string): Augment {
  return {
    id: json.Name || json.DisplayName,
    name: json.DisplayName,
    category: category as Augment['category'],
    description: json.DisplayDescriptionNormalized.split('\n')[0],
    effects: json.DisplayDescriptionNormalized
      .split('\n')
      .filter((line: string) => line.trim().startsWith('+')),
    image: imageUrl,
  };
}

function AugmentCard({ augment, category, imageUrl }: AugmentCardProps) {
  // Split the description into lines
  const lines = augment.DisplayDescriptionNormalized.split(/\r?\n/);
  const mainDesc = [];
  const stats = [];
  let inStats = false;
  for (const line of lines) {
    if (/^\s*Stats:/i.test(line)) {
      inStats = true;
      stats.push(line.replace(/Stats:/i, '**Stats:**'));
    } else if (inStats) {
      stats.push(line);
    } else {
      mainDesc.push(line);
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 overflow-hidden group hover:shadow-[0_0_16px_4px_rgba(34,211,238,0.3)]">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={imageUrl}
          alt={augment.DisplayName}
          className="w-16 h-16 rounded bg-gray-800 border border-gray-700 object-contain"
        />
        <span className="text-2xl font-bold text-white">{augment.DisplayName}</span>
        <span className="px-2 py-1 rounded text-xs font-medium border text-red-400 bg-red-400/10 border-red-400/30 ml-2">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      </div>
      <div className="mb-2 text-gray-300 whitespace-pre-line">
        {mainDesc.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
      {stats.length > 0 && (
        <>
          <hr className="my-3 border-gray-700" />
          <div className="mb-2 text-gray-300">
            {stats.map((line, idx) => {
              if (idx === 0) {
                // Bold 'Stats:'
                return <div key={idx}><span className="font-bold">Stats:</span></div>;
              }
              if (line.trim()) {
                return <div key={idx} className="flex items-start gap-2"><span className="mt-1">•</span><span>{line.trim()}</span></div>;
              }
              return null;
            })}
          </div>
        </>
      )}
    </div>
  );
}

const AugmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'brawler' | 'energy' | 'fusion' | 'shield' | 'striker' | 'support'>('all');
  const [augments, setAugments] = useState<Augment[]>([]);

  const categories = [
    { key: 'all', label: 'All', color: 'bg-gray-700 text-white' },
    { key: 'strike', label: 'Strike', color: 'bg-yellow-600 text-yellow-100' },
    { key: 'brawler', label: 'Brawler', color: 'bg-red-600 text-red-100' },
    { key: 'fusion', label: 'Fusion', color: 'bg-purple-600 text-purple-100' },
    { key: 'shield', label: 'Shield', color: 'bg-green-600 text-green-100' },
    { key: 'support', label: 'Support', color: 'bg-cyan-600 text-cyan-100' },
    { key: 'energy', label: 'Energy', color: 'bg-blue-600 text-blue-100' },
  ];

  useEffect(() => {
    const loadedAugments: Augment[] = [];
    for (const path in augmentModules) {
      const mod = augmentModules[path] as any;
      const json = mod.default || mod;
      // Extract category from the path, e.g., .../Forge/Brawler/GoliathForce_Original.json
      const match = path.match(/Forge\/([^/]+)\//i);
      const category = match ? match[1].toLowerCase() : 'unknown';
      // Build image URL (adjust if needed)
      const imageName = (json.DisplayName || '').replace(/ /g, '%20') + '.PNG';
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/Augments%2F${imageName}?alt=media`;
      loadedAugments.push(parseAugment(json, category, imageUrl));
    }
    setAugments(loadedAugments);
  }, []);

  const filteredAugments = augments.filter(augment => {
    const matchesSearch = augment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         augment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         augment.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || augment.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'brawler': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'energy': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'fusion': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'shield': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'striker': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'support': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'brawler': return <Star className="w-4 h-4" />;
      case 'energy': return <Zap className="w-4 h-4" />;
      case 'fusion': return <Sparkles className="w-4 h-4" />;
      case 'shield': return <Shield className="w-4 h-4" />;
      case 'striker': return <Target className="w-4 h-4" />;
      case 'support': return <Gem className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleBack = () => {
    navigate('/app/set1');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Custom Augments Header */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-teal-900/20 to-emerald-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.2),transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(16,185,129,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating Sparkles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-br from-cyan-400/40 to-teal-400/40 rounded-full animate-bounce opacity-60"
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
                onClick={handleBack}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-700/50 backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Set 1
              </button>
            </div>

            {/* Main Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300 group-hover:scale-105">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  <Wand2 className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                </div>
                <div>
                  <h1 className="text-5xl font-black mb-2">
                    <span className="bg-gradient-to-r from-white via-cyan-200 to-teal-200 bg-clip-text text-transparent">
                      AUGMENTS
                    </span>
                  </h1>
                  <p className="text-xl text-gray-400 mb-2">Forge powerful upgrades by combining components</p>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-4 py-1 rounded-full font-bold text-sm">
                      FORGING SYSTEM
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search augments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800/50 backdrop-blur-sm text-white pl-12 pr-6 py-3 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 w-80 hover:bg-gray-700/50 group-hover:border-gray-600/50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Info Section: How Augments Work */}
            <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 border-l-4 border-blue-400 rounded-xl p-8 mb-8 shadow-2xl">
              <h2 className="text-3xl font-extrabold text-blue-100 mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-green-300" />
                How Augments Work
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                Augments are powerful upgrades forged by combining two components. The combination you choose determines the type of augment you receive.
              </p>
              {/* Components Row */}
              <div className="flex flex-col md:flex-row justify-center gap-8 mb-10">
                {/* Component Card */}
                {[
                  {
                    name: "Fury Fragment",
                    img: "https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/Augments%2FFury.PNG?alt=media",
                    desc: "Gain 10% Attack Damage.",
                    color: "from-red-700 to-red-400"
                  },
                  {
                    name: "Defiance Fragment",
                    img: "https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/Augments%2FDefiance.PNG?alt=media",
                    desc: "Gain 100 Health.",
                    color: "from-yellow-700 to-yellow-400"
                  },
                  {
                    name: "Apex Fragment",
                    img: "https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/Augments%2FApex.PNG?alt=media",
                    desc: "Gain 10 Omega Power.",
                    color: "from-purple-700 to-purple-400"
                  }
                ].map((comp, idx) => (
                  <div key={idx} className={`flex flex-col items-center bg-gradient-to-br ${comp.color} rounded-xl p-6 shadow-lg w-60`}>
                    <img src={comp.img} alt={comp.name} className="w-20 h-20 mb-3 rounded-full border-4 border-white shadow" />
                    <div className="font-bold text-lg text-white mb-1">{comp.name}</div>
                    <div className="text-blue-100 text-sm text-center">{comp.desc}</div>
                  </div>
                ))}
              </div>
              {/* Forging Combinations Table */}
              <div className="mb-2 font-semibold text-blue-200 text-xl">Forging Combinations:</div>
              <div className="flex flex-col gap-3 items-center w-full max-w-md mx-auto">
                {[
                  {c1: "Fury", c2: "Fury", t: "STRIKE", color: "bg-yellow-600 text-yellow-100", desc: "Attack-Based Carry"},
                  {c1: "Fury", c2: "Defiance", t: "BRAWLER", color: "bg-red-600 text-red-100", desc: "Bruiser"},
                  {c1: "Fury", c2: "Apex", t: "FUSION", color: "bg-purple-600 text-purple-100", desc: "Hybrid"},
                  {c1: "Defiance", c2: "Defiance", t: "SHIELD", color: "bg-green-600 text-green-100", desc: "Tank"},
                  {c1: "Defiance", c2: "Apex", t: "SUPPORT", color: "bg-cyan-600 text-cyan-100", desc: "Utility"},
                  {c1: "Apex", c2: "Apex", t: "ENERGY", color: "bg-blue-600 text-blue-100", desc: "Ability Carry"},
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center bg-gray-800/70 rounded-lg shadow p-3 w-full">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <img src={`https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/Augments%2F${row.c1}.PNG?alt=media`} className="w-8 h-8 rounded-full border-2 border-white" alt={row.c1} />
                      <span className="font-bold text-blue-100">{row.c1}</span>
                      <span className="text-blue-300 font-bold text-lg mx-1">+</span>
                      <img src={`https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/Augments%2F${row.c2}.PNG?alt=media`} className="w-8 h-8 rounded-full border-2 border-white" alt={row.c2} />
                      <span className="font-bold text-blue-100">{row.c2}</span>
                    </div>
                    <span className="mx-4 text-blue-400 font-bold text-xl">→</span>
                    <div className="flex flex-col items-start">
                      <span className={`px-3 py-1 rounded-full font-bold text-base mb-1 ${row.color}`}>{row.t}</span>
                      <span className="text-xs text-blue-200">{row.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Section: How to Obtain Components */}
            <div className="bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border-l-4 border-cyan-400 rounded-xl p-6 mb-8 shadow-lg">
              <h2 className="text-xl font-bold text-cyan-200 mb-2 flex items-center gap-2">
                <span role="img" aria-label="component">📦</span>
                How to Obtain Components
              </h2>
              <ul className="list-disc pl-6 text-cyan-100 space-y-2">
                <li>
                  <b>Crates:</b> Components can be obtained from special crates that appear during the game.
                </li>
                <li>
                  <b>Dropped by Enemies:</b> Defeated enemies may drop components onto the board. These components will sit on your board and, if you don't pick them up, will automatically fly over to you after a few seconds.
                </li>
                <li>
                  <b>Shop Storage:</b> All collected components will end up at the top of your shop for you to use.
                </li>
              </ul>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-gray-300 font-medium">Total Augments</span>
                </div>
                <span className="text-white text-3xl font-bold">{augments.length}</span>
                <div className="text-cyan-400 text-sm mt-1">Power-ups Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Category Pills Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key as any)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 border-2
                ${categoryFilter === cat.key
                  ? `${cat.color} border-white shadow`
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Augments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAugments.map((augment) => (
            <div key={augment.id} className="bg-gray-900 rounded-2xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 overflow-hidden group flex flex-col items-center py-8 px-4 hover:shadow-[0_0_32px_8px_rgba(34,211,238,0.15)]">
              {/* Large Image */}
              {augment.image && (
                <img src={augment.image} alt={augment.name} className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gray-800 border-2 border-cyan-500 shadow-lg object-contain mb-4" />
              )}
              {/* Name */}
              <h3 className="text-white font-extrabold text-2xl md:text-3xl text-center mb-2 drop-shadow-lg">{augment.name}</h3>
              {/* Category Badge */}
              <span className={`px-4 py-2 rounded-full text-base font-bold border mt-1 mb-4 ${getCategoryColor(augment.category)} text-center`}>{augment.category.charAt(0).toUpperCase() + augment.category.slice(1)}</span>
              {/* Description */}
              <div className="w-full mb-4">
                <p className="text-gray-200 text-lg font-medium text-center leading-relaxed">{augment.description}</p>
              </div>
              {/* Effects/Stats */}
              <div className="w-full">
                <h4 className="text-white font-bold text-lg mb-3 text-center">Stats:</h4>
                <div className="space-y-3">
                  {augment.effects.map((effect, idx) => (
                    <div key={idx} className="flex items-start gap-3 justify-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-cyan-100 text-base font-semibold leading-relaxed">{effect}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAugments.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400 text-lg mb-2">No augments found</div>
            <div className="text-gray-500 text-sm">Try adjusting your filters</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AugmentsPage;