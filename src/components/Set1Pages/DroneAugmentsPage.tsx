import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bot, Layers, Sparkles, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const combatModules = import.meta.glob('../../data/DroneAugmentData/Combat/*.json', { eager: true });
const synergyModules = import.meta.glob('../../data/DroneAugmentData/Synergy/*.json', { eager: true });
const utilityModules = import.meta.glob('../../data/DroneAugmentData/Utility/*.json', { eager: true });

const categories = [
  { key: 'all', label: 'All', icon: <Bot className="w-5 h-5" /> },
  { key: 'combat', label: 'Combat', icon: <Bot className="w-5 h-5" /> },
  { key: 'synergy', label: 'Synergy', icon: <Layers className="w-5 h-5" /> },
  { key: 'utility', label: 'Utility', icon: <Sparkles className="w-5 h-5" /> },
];

type Augment = {
  id: string;
  name: string;
  description: string;
  category: 'combat' | 'synergy' | 'utility';
  icon: string;
};

// Map for special-case icons (no prefix or with dash)
const SPECIAL_ICON_MAP: Record<string, string> = {
  ChampionsFocus: 'ChampionsFocus_Icon.PNG',
  HyperSuppression: 'HyperSuppression_Icon.PNG',
  ThreefoldPower: 'ThreefoldPower_Icon.PNG',
  VeteransMight: 'VeteransMight_Icon.PNG',
  'Zero-TierOverdrive': 'Zero-TierOverdrive_Icon.PNG',
};

function getIconUrl(name: string): string {
  // Remove _StageX, but keep dashes for special-case lookup
  let base = name.replace(/_Stage\d+/i, '');
  // Try special-case map first (with dash)
  if (SPECIAL_ICON_MAP[base]) {
    return `https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/DroneUpgrades%2F${SPECIAL_ICON_MAP[base]}?alt=media`;
  }
  // Remove all non-alphanumeric for default pattern
  const safe = base.replace(/[^a-zA-Z0-9]/g, '');
  return `https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/DroneUpgrades%2FT_DroneAugment_${safe}_Icon.PNG?alt=media`;
}

function parseAugment(json: any, category: 'combat' | 'synergy' | 'utility'): Augment {
  return {
    id: json.Name,
    name: json.DisplayName,
    description: json.DisplayDescription || json.DisplayDescriptionNormalized || '',
    category,
    icon: getIconUrl(json.Name),
  };
}

const DroneAugmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [augments, setAugments] = useState<Augment[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'combat' | 'synergy' | 'utility'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const all: Augment[] = [];
      for (const path in combatModules) {
        const json = (combatModules[path] as any).default || (combatModules[path] as any);
        all.push(parseAugment(json, 'combat'));
      }
      for (const path in synergyModules) {
        const json = (synergyModules[path] as any).default || (synergyModules[path] as any);
        all.push(parseAugment(json, 'synergy'));
      }
      for (const path in utilityModules) {
        const json = (utilityModules[path] as any).default || (utilityModules[path] as any);
        all.push(parseAugment(json, 'utility'));
      }
      setAugments(all);
      console.log('Loaded augments:', all);
    } catch (e) {
      console.error('DroneAugmentsPage error:', e);
    }
  }, []);

  const handleBack = () => {
    navigate('/app/set1');
  };

  const filtered = augments.filter(a =>
    (categoryFilter === 'all' || a.category === categoryFilter) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()))
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'combat': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'synergy': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'utility': return 'text-green-400 bg-green-400/10 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
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
            <h1 className="text-4xl font-bold text-white mb-4">Drone Augments</h1>
            <p className="text-gray-400">Explore the drone-specific augments in Set 1</p>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-3 mb-8">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key as 'all' | 'combat' | 'synergy' | 'utility')}
                className={`px-4 py-2 rounded-full font-semibold border-2 ${categoryFilter === cat.key ? 'border-white bg-gray-700 text-white' : 'border-gray-700 text-gray-300 bg-gray-800'}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search augments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-800 text-white pl-12 pr-6 py-3 rounded-xl border border-gray-700 w-80"
            />
          </div>
          {/* Augment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((augment, idx) => (
              <div key={augment.id + '-' + idx} className="bg-gray-900 rounded-2xl border border-gray-700 hover:border-indigo-500 transition-all duration-300 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <img src={augment.icon} alt={augment.name} className="w-14 h-14 rounded bg-gray-800 border border-gray-700 object-contain" />
                  <span className="text-xl font-bold text-white">{augment.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ml-2 ${getCategoryColor(augment.category)}`}>
                    {augment.category.charAt(0).toUpperCase() + augment.category.slice(1)}
                  </span>
                </div>
                <div className="text-gray-200 text-base mt-2">{augment.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneAugmentsPage; 