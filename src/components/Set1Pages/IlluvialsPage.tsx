import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, Users, Star, Zap, Shield, Sword, Heart, Eye, Target, Sparkles, Crown, Gem } from 'lucide-react';
import costsData from '../../data/CostData/Costs.json';
import iconUrls from '../../data/iconUrls.json';
import styles from './IlluvialsPage.module.css';

// Dynamically import all JSON files in CombatUnitData
const illuvialModules = import.meta.glob('../../data/CombatUnitData/*.json', { eager: true });

// Dynamically import all JSON files in SynergyData
const synergyModules = import.meta.glob('../../data/SynergyData/*.json', { eager: true });

interface IlluvialProps {
  onBack: () => void;
}

interface Illuvial {
  id: string;
  name: string;
  cost: number;
  tier: number;
  stage: number;
  affinities: string[];
  classes: string[];
  health: number;
  attack: number;
  attackSpeed: number;
  range: number;
  ability: {
    name: string;
    description: string;
    energyCost: number;
    damage?: string;
    effects?: string[];
  };
  image?: string;
}

const affinityColors: { [key: string]: string } = {
  water: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  fire: 'text-red-400 bg-red-400/10 border-red-400/30',
  nature: 'text-green-400 bg-green-400/10 border-green-400/30',
  air: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  earth: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  default: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
};

const classColors: { [key: string]: string } = {
  bulwark: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  fighter: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  rogue: 'text-pink-400 bg-pink-400/10 border-pink-400/30',
  psion: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  empath: 'text-green-400 bg-green-400/10 border-green-400/30',
  default: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
};

const tierColors = [
  'bg-gray-600 text-gray-200', // 0
  'bg-yellow-600 text-yellow-200', // 1
  'bg-blue-600 text-blue-200', // 2
  'bg-purple-600 text-purple-200', // 3
];

const getUnitCost = (tier: number): number => {
  // Tier 1 = 1 cost, Tier 2 = 2 cost, etc.
  return tier;
};

function parseIlluvial(json: any) {
  // Collect unique affinities
  const baseAffinity = json.CombatAffinity || json.DominantCombatAffinity;
  const dominantAffinity = json.DominantCombatAffinity;
  const affinities = [baseAffinity];
  if (dominantAffinity && dominantAffinity !== baseAffinity) {
    affinities.push(dominantAffinity);
  }

  // Collect unique classes
  const baseClass = json.CombatClass || json.DominantCombatClass;
  const dominantClass = json.DominantCombatClass;
  const classes = [baseClass];
  if (dominantClass && dominantClass !== baseClass) {
    classes.push(dominantClass);
  }

  // Parse tier and cost
  const tier = parseInt(json.Tier) || 1;
  const cost = tier; // Cost is the same as tier

  // Create a unique ID using name, tier, and a random suffix
  const uniqueId = `${json.Line || json.DisplayName}-${tier}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: uniqueId,
    name: json.DisplayName,
    affinities,
    classes,
    tier,
    stage: json.Stage || 1,
    cost,
    health: json.Stats.MaxHealth,
    attack: json.Stats.AttackPhysicalDamage,
    attackSpeed: json.Stats.AttackSpeed,
    range: json.Stats.AttackRangeUnits,
    physicalResist: json.Stats.PhysicalResist,
    energyResist: json.Stats.EnergyResist,
    critChance: json.Stats.CritChancePercentage,
    critAmp: json.Stats.CritAmplificationPercentage,
    description: json.DisplayDescriptionNormalized || json.Summary,
    image: json.ImageURL,
  };
}

function getSynergyOptions(type: 'Affinity' | 'Class') {
  const options: { name: string, components: string[] }[] = [];
  for (const path in synergyModules) {
    const mod = synergyModules[path] as any;
    const json = mod.default || mod;
    if (type === 'Affinity' && json.CombatAffinity) {
      options.push({ name: json.CombatAffinity, components: json.CombatAffinityComponents || [] });
    }
    if (type === 'Class' && json.CombatClass) {
      options.push({ name: json.CombatClass, components: json.CombatClassComponents || [] });
    }
  }
  // Remove duplicates by name
  const unique = Array.from(new Map(options.map(o => [o.name, o])).values());
  // Sort base first, then combos
  return unique.sort((a, b) => a.components.length - b.components.length || a.name.localeCompare(b.name));
}

const affinityOptions = getSynergyOptions('Affinity');

// Helper to normalize names for image filenames
function toImageName(name: string) {
  if (!name) return '';
  // Remove all spaces, capitalize first letter, lowercase the rest
  const noSpaces = name.replace(/\s+/g, '');
  return noSpaces.charAt(0).toUpperCase() + noSpaces.slice(1).toLowerCase();
}

// Helper to get Firebase icon URL
const getIconUrl = (name: string) =>
  `https://firebasestorage.googleapis.com/v0/b/illuvilytics.appspot.com/o/class_affinity%2FProperty%201%3D${encodeURIComponent(toImageName(name))}.png?alt=media`;

const IlluvialsPage: React.FC<IlluvialProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [costFilter, setCostFilter] = useState('all');
  const [affinityFilter, setAffinityFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [illuvials, setIlluvials] = useState<any[]>([]);
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [affinityOptions, setAffinityOptions] = useState<string[]>([]);

  // Debug logging for filter changes
  useEffect(() => {
    console.log('Filter state changed:', {
      searchQuery,
      costFilter,
      affinityFilter,
      classFilter
    });
  }, [searchQuery, costFilter, affinityFilter, classFilter]);

  useEffect(() => {
    const loadedIlluvials: any[] = [];
    const classSet = new Set<string>();
    const affinitySet = new Set<string>();
    for (const path in illuvialModules) {
      const mod = illuvialModules[path] as any;
      const json = mod.default || mod;
      const illuvial = parseIlluvial(json);
      loadedIlluvials.push(illuvial);
      // Collect all unique classes from each illuvial
      illuvial.classes.forEach((c: string) => {
        if (c) classSet.add(c);
      });
      // Collect all unique affinities from each illuvial
      illuvial.affinities.forEach((a: string) => {
        if (a) affinitySet.add(a);
      });
    }
    setIlluvials(loadedIlluvials);
    setClassOptions(Array.from(classSet).sort());
    setAffinityOptions(Array.from(affinitySet).sort());
  }, []);

  const filteredIlluvials = illuvials.filter((illuvial: any) => {
    // Debug logging for filter values
    console.log('Current filter values:', {
      searchQuery,
      costFilter,
      affinityFilter,
      classFilter
    });

    // Debug logging for illuvial being filtered
    console.log('Filtering illuvial:', {
      name: illuvial.name,
      cost: illuvial.cost,
      tier: illuvial.tier,
      affinities: illuvial.affinities,
      classes: illuvial.classes
    });

    // Search filter
    const matchesSearch = !searchQuery || 
      illuvial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      illuvial.affinities.some((a: string) => a && a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      illuvial.classes.some((c: string) => c && c.toLowerCase().includes(searchQuery.toLowerCase()));

    // Cost filter
    const matchesCost = costFilter === 'all' || illuvial.cost === parseInt(costFilter);

    // Affinity filter - match any affinity if multiple
    const matchesAffinity = affinityFilter === 'all' || 
      illuvial.affinities.some((a: string) => {
        if (!a) return false;
        // Handle special case for "Air" affinity
        if (affinityFilter.toLowerCase() === 'air' && a.toLowerCase() === 'air') return true;
        // Handle other affinities
        return a.toLowerCase() === affinityFilter.toLowerCase();
      });

    // Class filter - match any class if multiple
    const matchesClass = classFilter === 'all' || 
      illuvial.classes.some((c: string) => {
        if (!c) return false;
        // Handle special case for "Air" class
        if (classFilter.toLowerCase() === 'air' && c.toLowerCase() === 'air') return true;
        // Handle other classes
        return c.toLowerCase() === classFilter.toLowerCase();
      });

    // Debug logging for filter results
    console.log('Filter results:', {
      name: illuvial.name,
      matchesSearch,
      matchesCost,
      matchesAffinity,
      matchesClass,
      finalResult: matchesSearch && matchesCost && matchesAffinity && matchesClass
    });

    return matchesSearch && matchesCost && matchesAffinity && matchesClass;
  });

  // Debug log for final filtered count
  console.log('Filtered count:', filteredIlluvials.length, 'Total illuvials:', illuvials.length);

  const getAffinityColor = (affinity: string) => {
    switch (affinity) {
      case 'water': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'fire': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'nature': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'air': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
      case 'earth': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getClassColor = (className: string) => {
    switch (className) {
      case 'fighter': return 'text-red-300 bg-red-500/10 border-red-500/30';
      case 'guardian': return 'text-blue-300 bg-blue-500/10 border-blue-500/30';
      case 'rogue': return 'text-purple-300 bg-purple-500/10 border-purple-500/30';
      case 'psion': return 'text-pink-300 bg-pink-500/10 border-pink-500/30';
      case 'empath': return 'text-green-300 bg-green-500/10 border-green-500/30';
      default: return 'text-gray-300 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getCostColor = (cost: number) => {
    switch (cost) {
      case 1: return 'text-gray-300 bg-gray-600';
      case 2: return 'text-green-300 bg-green-600';
      case 3: return 'text-blue-300 bg-blue-600';
      case 4: return 'text-purple-300 bg-purple-600';
      case 5: return 'text-yellow-300 bg-yellow-600';
      default: return 'text-gray-300 bg-gray-600';
    }
  };

  // Cost options
  const costOptions = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Custom Illuvials Header */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-cyan-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(147,51,234,0.2),transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(34,197,94,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }} />
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <h1 className="text-5xl font-black mb-2">
                    <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                      ILLUVIALS
                    </span>
                  </h1>
                  <p className="text-xl text-gray-400 mb-2">Collectible creatures with unique abilities</p>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-1 rounded-full font-bold text-sm">
                      SET 1: GENESIS
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search Illuvials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800/50 backdrop-blur-sm text-white pl-12 pr-6 py-3 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 w-80 hover:bg-gray-700/50 group-hover:border-gray-600/50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Enhanced Filters */}
            <div className="w-full flex justify-center mb-8">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 w-full max-w-6xl flex flex-col gap-8 shadow-lg relative">
                <button
                  className={`${styles.clearFiltersBtn} ${styles.pillBtn} ${styles.pillBtnClass}`}
                  onClick={() => {
                    setCostFilter('all');
                    setAffinityFilter('all');
                    setClassFilter('all');
                    setSearchQuery('');
                  }}
                  style={{ zIndex: 2 }}
                >
                  Clear Filters
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Cost Filter */}
                  <div className="flex flex-col items-center w-full">
                    <div className="filter-label text-gray-300 font-semibold mb-3">Cost</div>
                    <div className="flex gap-3 flex-wrap justify-center w-full">
                      <button
                        className={`${styles.iconFilterBtn} ${styles.pillBtn} ${styles.pillBtnCost} ${styles.testPill} ${costFilter === 'all' ? styles.selected : ''}`}
                        onClick={() => setCostFilter('all')}
                        title="All Costs"
                      >
                        All
                      </button>
                      {costOptions.map(cost => (
                        <button
                          key={cost}
                          className={`${styles.iconFilterBtn} ${styles.pillBtn} ${styles.pillBtnCost} ${costFilter === String(cost) ? styles.selected : ''}`}
                          onClick={() => setCostFilter(String(cost))}
                          title={`${cost} Cost`}
                        >
                          {cost}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Affinity Filter */}
                  <div className="flex flex-col items-center w-full">
                    <div className="filter-label text-gray-300 font-semibold mb-3">Affinity</div>
                    <div className="flex gap-3 flex-wrap justify-center w-full">
                      <button
                        className={`${styles.iconFilterBtn} ${styles.pillBtn} ${styles.pillBtnAffinity} ${affinityFilter === 'all' ? styles.selected : ''}`}
                        onClick={() => setAffinityFilter('all')}
                        title="All Affinities"
                      >
                        All
                      </button>
                      {affinityOptions.map(opt => (
                        <button
                          key={opt}
                          className={`${styles.iconFilterBtn} ${styles.pillBtn} ${styles.pillBtnAffinity} ${affinityFilter === opt ? styles.selected : ''}`}
                          onClick={() => setAffinityFilter(opt)}
                          title={opt}
                        >
                          <img
                            src={iconUrls[opt as keyof typeof iconUrls]}
                            alt={opt}
                            className={styles.iconImg}
                            style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Class Filter */}
                  <div className="flex flex-col items-center w-full">
                    <div className="filter-label text-gray-300 font-semibold mb-3">Class</div>
                    <div className="flex gap-3 flex-wrap justify-center w-full">
                      <button
                        className={`${styles.iconFilterBtn} ${styles.pillBtn} ${styles.pillBtnClass} ${classFilter === 'all' ? styles.selected : ''}`}
                        onClick={() => setClassFilter('all')}
                        title="All Classes"
                      >
                        All
                      </button>
                      {classOptions.map(opt => (
                        <button
                          key={opt}
                          className={`${styles.iconFilterBtn} ${styles.pillBtn} ${styles.pillBtnClass} ${classFilter === opt ? styles.selected : ''}`}
                          onClick={() => setClassFilter(opt)}
                          title={opt}
                        >
                          <img
                            src={iconUrls[opt as keyof typeof iconUrls]}
                            alt={opt}
                            className={styles.iconImg}
                            style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 min-h-[140px] min-w-[180px] flex flex-col items-center justify-center border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-gray-300 text-lg font-bold">Total Illuvials</span>
                </div>
                <span className="text-white text-3xl font-bold">{illuvials.length}</span>
                <div className="text-purple-400 text-sm mt-1">Complete Collection</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 min-h-[140px] min-w-[180px] flex flex-col items-center justify-center border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-gray-300 text-lg font-bold">Tier 0</span>
                </div>
                <span className="text-white text-3xl font-bold">{illuvials.filter(i => i.tier === 0).length}</span>
                <div className="text-yellow-400 text-sm mt-1">Common Tier</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 min-h-[140px] min-w-[180px] flex flex-col items-center justify-center border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-gray-300 text-lg font-bold">Tier 1</span>
                </div>
                <span className="text-white text-3xl font-bold">{illuvials.filter(i => i.tier === 1).length}</span>
                <div className="text-blue-400 text-sm mt-1">Rare Tier</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 min-h-[140px] min-w-[180px] flex flex-col items-center justify-center border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-gray-300 text-lg font-bold">Tier 2</span>
                </div>
                <span className="text-white text-3xl font-bold">{illuvials.filter(i => i.tier === 2).length}</span>
                <div className="text-cyan-400 text-sm mt-1">Legendary Tier</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 min-h-[140px] min-w-[180px] flex flex-col items-center justify-center border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-purple-400 text-3xl">🦄</span>
                  <span className="text-gray-300 text-lg font-bold">Tier 3</span>
                </div>
                <span className="text-white text-3xl font-bold">{illuvials.filter(i => i.tier === 3).length}</span>
                <div className="text-purple-400 text-sm mt-1">Mythic Tier</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 min-h-[140px] min-w-[180px] flex flex-col items-center justify-center border border-gray-700/50 hover:border-rose-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-rose-400 text-3xl">🐉</span>
                  <span className="text-gray-300 text-lg font-bold">Tier 4</span>
                </div>
                <span className="text-white text-3xl font-bold">{illuvials.filter(i => i.tier === 4).length}</span>
                <div className="text-rose-400 text-sm mt-1">Divine Tier</div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 min-h-[140px] min-w-[180px] flex flex-col items-center justify-center border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-indigo-400 text-3xl">🌌</span>
                  <span className="text-gray-300 text-lg font-bold">Tier 5</span>
                </div>
                <span className="text-white text-3xl font-bold">{illuvials.filter(i => i.tier === 5).length}</span>
                <div className="text-indigo-400 text-sm mt-1">Cosmic Tier</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Illuvials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIlluvials.map((illuvial) => (
            <div key={illuvial.id} className="relative bg-gray-900 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 overflow-hidden group p-1">
              <span className="absolute top-4 right-6 text-2xl font-bold text-yellow-400 z-10">🪙 {illuvial.tier}</span>
              {/* Header */}
              <div className="p-4 border-b border-gray-700 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-black border border-gray-700 overflow-hidden flex items-center justify-center">
                  <img src={illuvial.image} alt={illuvial.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-xl truncate">{illuvial.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {illuvial.affinities.map((affinity: string, idx: number) => (
                      <span key={`${illuvial.id}-affinity-${affinity}-${idx}`} className={`px-2 py-1 rounded text-xs font-medium border ${affinityColors[affinity.toLowerCase()] || affinityColors.default}`}>{affinity}</span>
                    ))}
                    {illuvial.classes.map((className: string, idx: number) => (
                      <span key={`${illuvial.id}-class-${className}-${idx}`} className={`px-2 py-1 rounded text-xs font-medium border ${classColors[className.toLowerCase()] || classColors.default}`}>{className}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Description */}
              {illuvial.description && (
                <div className="p-4 border-b border-gray-700">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{illuvial.description}</p>
                </div>
              )}
              {/* Base Stats */}
              <div className="p-4">
                <h4 className="text-white font-semibold text-sm mb-3">Base Stats:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <div className="flex items-center gap-1"><span className="text-red-400">❤️</span> Max Health: <span className="text-white font-medium">{illuvial.health}</span></div>
                  <div className="flex items-center gap-1"><span className="text-orange-400">🗡️</span> Attack: <span className="text-white font-medium">{illuvial.attack}</span></div>
                  <div className="flex items-center gap-1"><span className="text-yellow-400">⚡</span> Speed: <span className="text-white font-medium">{illuvial.attackSpeed}</span></div>
                  <div className="flex items-center gap-1"><span className="text-blue-400">🎯</span> Range: <span className="text-white font-medium">{illuvial.range}</span></div>
                  <div className="flex items-center gap-1"><span className="text-blue-300">🛡️</span> Phys Res: <span className="text-white font-medium">{illuvial.physicalResist}</span></div>
                  <div className="flex items-center gap-1"><span className="text-cyan-300">🔵</span> Energy Res: <span className="text-white font-medium">{illuvial.energyResist}</span></div>
                  <div className="flex items-center gap-1"><span className="text-yellow-300">⭐</span> Crit: <span className="text-white font-medium">{illuvial.critChance}%</span></div>
                  <div className="flex items-center gap-1"><span className="text-purple-300">💥</span> Crit Amp: <span className="text-white font-medium">{illuvial.critAmp}%</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredIlluvials.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400 text-lg mb-2">No Illuvials found</div>
            <div className="text-gray-500 text-sm">Try adjusting your filters</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IlluvialsPage;