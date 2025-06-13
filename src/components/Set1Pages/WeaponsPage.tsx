import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Sword, Zap, Target, Shield, Star, Gem, Crown, Crosshair, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WeaponPageProps {
  onBack: () => void;
}

interface Weapon {
  id: string;
  name: string;
  type: 'melee' | 'ranged' | 'magic';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  attack: number;
  attackSpeed: number;
  range: number;
  special: {
    name: string;
    description: string;
    cooldown?: number;
    damage?: string;
  };
  amplifierSlots: number;
  requirements?: string[];
}

// Dynamically import all JSON files in the WeaponData directory
const weaponModules = import.meta.glob('../../data/WeaponData/*.json', { eager: true });

// Weapon image mapping for known keys
const WEAPON_IMAGE_KEYS: Record<string, string> = {
  EmberlingRod: 'RodStage1',
  GalewindBow: 'BowStage1',
  GroveSword: 'StockSwordStage1Nature',
  LavaGauntlet: 'StockGloveStage1Fire',
  SproutGuard: 'GuardStage1',
  QuakeMaulers: 'MaulersStage1',
  RippleFlail: 'FlailStage1',
  ShadowMaul: 'MaulStage1',
  StrikeBoomerang: 'BoomerangStage1',
  SylphidBlade: 'BladeStage1',
  TempestLance: 'LanceStage1',
  VineboundCleaver: 'CleaverStage1',
  FlamewardenStaff: 'StaffStage1',
  AquaBlaster: 'BlasterStage1',
  EmberBastion: 'BastionStage1',
};

function getWeaponImage(name: string) {
  const key = WEAPON_IMAGE_KEYS[name] || name;
  return `https://media.illuvium.io/web/NFT/Weapon/${key}/${key}_default_default_webp.2500x2500/${key}_default_default.webp`;
}

function getAmpElement(ampName: string) {
  // Try to extract element from amp name (e.g., Stoneheart -> earth, LavaCore -> fire, etc)
  const lower = ampName.toLowerCase();
  if (lower.includes('earth') || lower.includes('stone') || lower.includes('quake') || lower.includes('void')) return 'earth';
  if (lower.includes('fire') || lower.includes('lava') || lower.includes('ember') || lower.includes('scorch')) return 'fire';
  if (lower.includes('water') || lower.includes('aqua') || lower.includes('tidal') || lower.includes('wave') || lower.includes('glacial')) return 'water';
  if (lower.includes('air') || lower.includes('wind') || lower.includes('tempest') || lower.includes('storm')) return 'air';
  if (lower.includes('nature') || lower.includes('sprout') || lower.includes('chlorophyll') || lower.includes('verdant')) return 'nature';
  if (lower.includes('energy') || lower.includes('arcane') || lower.includes('efficiency') || lower.includes('resonance')) return 'energy';
  return 'default';
}

function getAmpImage(ampName: string) {
  const element = getAmpElement(ampName);
  if (element === 'default') return 'https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/WeaponAmplifiers%2Fweapon_amplifier_default.PNG?alt=media';
  return `https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/WeaponAmplifiers%2Fweapon_amplifier_${element}.PNG?alt=media`;
}

function getAmpImageByAffinity(affinity: string) {
  const element = affinity?.toLowerCase();
  switch (element) {
    case 'earth': return 'https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/WeaponAmplifiers%2Fweapon_amplifier_earth.PNG?alt=media';
    case 'fire': return 'https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/WeaponAmplifiers%2Fweapon_amplifier_fire.PNG?alt=media';
    case 'water': return 'https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/WeaponAmplifiers%2Fweapon_amplifier_water.PNG?alt=media';
    case 'air': return 'https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/WeaponAmplifiers%2Fweapon_amplifier_air.PNG?alt=media';
    case 'nature': return 'https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/WeaponAmplifiers%2Fweapon_amplifier_nature.PNG?alt=media';
    default: return 'https://firebasestorage.googleapis.com/v0/b/illuvilytics.firebasestorage.app/o/WeaponAmplifiers%2Fweapon_amplifier_default.PNG?alt=media';
  }
}

function parseWeapon(json: any) {
  return {
    id: json.Name,
    name: json.Name,
    type: json.Type || 'unknown',
    rarity: json.Tier === 4 ? 'legendary' : json.Tier === 3 ? 'epic' : json.Tier === 2 ? 'rare' : json.Tier === 1 ? 'uncommon' : 'common',
    affinity: json.CombatAffinity,
    class: json.CombatClass,
    stats: json.Stats,
    description: json.DisplayDescriptionNormalized || json.DisplayDescription || '',
    abilities: json.Abilities || [],
    amplifier: false,
    raw: json,
  };
}

function parseAmp(json: any) {
  return {
    id: json.Name,
    name: json.Name.replace(/.*Amplifier_/, ''),
    description: json.DisplayDescriptionNormalized || json.DisplayDescription || '',
    stats: json.Stats,
    abilities: json.Abilities || [],
    amplifier: true,
    raw: json,
  };
}

// List of key stats to show
const KEY_STATS = [
  'AttackPhysicalDamage',
  'AttackSpeed',
  'AttackRangeUnits',
  'CritChancePercentage',
  'EnergyCost',
];

// Modal component for advanced amp details
const AmpModal = ({ amp, open, onClose }: { amp: any, open: boolean, onClose: () => void }) => {
  if (!open || !amp) return null;
  const descLines = (amp.description || '').split(/\r?\n/);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-red-400/40 max-w-lg w-full p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <img
            src={getAmpImage(amp.name)}
            alt={amp.name}
            className="w-20 h-20 rounded bg-gray-900 border border-gray-700 object-contain mb-4 shadow-lg"
          />
          <h2 className="text-red-200 font-extrabold text-2xl mb-2 text-center">{amp.name}</h2>
          <div className="mb-4 text-center">
            <span className="font-bold text-gray-100">{descLines[0]}</span>
            {descLines.length > 1 && (
              <span className="text-gray-200">{' ' + descLines.slice(1).join(' ')}</span>
            )}
          </div>
          <div className="w-full mb-4">
            <h4 className="text-white font-bold text-lg mb-2 text-center">Stats</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-base">
              {KEY_STATS.filter(stat => amp.stats && amp.stats[stat] !== undefined).map(stat => (
                <div key={stat} className="text-center">
                  <div className="text-orange-300 font-semibold">{amp.stats[stat]}</div>
                  <div className="text-gray-400 text-xs">{stat.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>
          </div>
          {amp.abilities && amp.abilities.length > 0 && (
            <div className="w-full mb-2">
              <h4 className="text-white font-bold text-lg mb-2 text-center">Abilities</h4>
              <ul className="list-disc list-inside text-gray-200">
                {amp.abilities.map((ab: any, idx: number) => (
                  <li key={idx}>{ab.Name || ab.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WeaponsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'melee' | 'ranged' | 'magic'>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'>('all');
  const [weapons, setWeapons] = useState<any[]>([]);
  const [ampModalOpen, setAmpModalOpen] = useState(false);
  const [selectedAmp, setSelectedAmp] = useState<any>(null);

  const handleBack = () => {
    navigate('/app/set1');
  };

  useEffect(() => {
    // Group base weapons and their amps
    const baseWeapons: any = {};
    for (const path in weaponModules) {
      const mod = weaponModules[path] as any;
      const json = mod.default || mod;
      if (/_Default_Original\.json$/.test(path) && !/_Amplifier_/.test(path)) {
        baseWeapons[json.Name] = { ...parseWeapon(json), amps: [] };
      }
    }
    // Attach amps
    for (const path in weaponModules) {
      if (/_Amplifier_/.test(path)) {
        const mod = weaponModules[path] as any;
        const json = mod.default || mod;
        const weaponName = json.AmplifierForWeapon?.Name;
        if (weaponName && baseWeapons[weaponName]) {
          baseWeapons[weaponName].amps.push(parseAmp(json));
        }
      }
    }
    const grouped = Object.values(baseWeapons);
    setWeapons(grouped);
    console.log('Weapons with amps:', grouped);
  }, []);

  const filteredWeapons = weapons.filter(weapon => {
    const matchesSearch = weapon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      weapon.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || (weapon.class && weapon.class.toLowerCase() === typeFilter);
    const matchesRarity = rarityFilter === 'all' || weapon.rarity === rarityFilter;
    return matchesSearch && matchesType && matchesRarity;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-300 bg-gray-600/20 border-gray-500/30';
      case 'uncommon': return 'text-green-300 bg-green-600/20 border-green-500/30';
      case 'rare': return 'text-blue-300 bg-blue-600/20 border-blue-500/30';
      case 'epic': return 'text-purple-300 bg-purple-600/20 border-purple-500/30';
      case 'legendary': return 'text-yellow-300 bg-yellow-600/20 border-yellow-500/30';
      default: return 'text-gray-300 bg-gray-600/20 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'melee': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'ranged': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'magic': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'melee': return <Sword className="w-4 h-4" />;
      case 'ranged': return <Target className="w-4 h-4" />;
      case 'magic': return <Wand2 className="w-4 h-4" />;
      default: return <Sword className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Custom Weapons Header */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-pink-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(239,68,68,0.2),transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(236,72,153,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating Weapon Icons */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {i % 3 === 0 ? (
                <Sword className="w-4 h-4 text-red-400/30" />
              ) : i % 3 === 1 ? (
                <Target className="w-4 h-4 text-green-400/30" />
              ) : (
                <Wand2 className="w-4 h-4 text-blue-400/30" />
              )}
            </div>
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
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/25 group-hover:shadow-red-500/40 transition-all duration-300 group-hover:scale-105">
                    <Sword className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  <Crosshair className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-5xl font-black mb-2">
                    <span className="bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text text-transparent">
                      WEAPONS
                    </span>
                  </h1>
                  <p className="text-xl text-gray-400 mb-2">Combat equipment for your Illuvials</p>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-1 rounded-full font-bold text-sm">
                      ARSENAL COLLECTION
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search weapons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800/50 backdrop-blur-sm text-white pl-12 pr-6 py-3 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 w-80 hover:bg-gray-700/50 group-hover:border-gray-600/50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Enhanced Filters */}
            {/* Removed type and rarity filter dropdowns as requested */}

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-red-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <Sword className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-gray-300 font-medium">Total Weapons</span>
                </div>
                <span className="text-white text-3xl font-bold">{weapons.length}</span>
                <div className="text-red-400 text-sm mt-1">Arsenal Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Weapons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWeapons.map((weapon) => (
            <div key={weapon.id} className="bg-gray-900 rounded-2xl border border-gray-700 hover:border-red-500 transition-all duration-300 overflow-hidden group flex flex-col items-center py-8 px-4 hover:shadow-[0_0_32px_8px_rgba(239,68,68,0.15)]">
              {/* Large Image */}
              <img src={getWeaponImage(weapon.name)} alt={weapon.name} className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gray-800 border-2 border-red-500 shadow-lg object-contain mb-4" />
              {/* Name */}
              <h3 className="text-white font-extrabold text-2xl md:text-3xl text-center mb-2 drop-shadow-lg">{weapon.name}</h3>
              {/* Rarity/Type Badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className={`px-4 py-2 rounded-full text-base font-bold border ${getTypeColor(weapon.class)}`}>{weapon.class}</span>
                <span className={`px-4 py-2 rounded-full text-base font-bold border border-gray-600 text-gray-300`}>{weapon.affinity}</span>
              </div>
              {/* Description */}
              <div className="w-full mb-4">
                <p className="text-gray-200 text-lg font-medium text-center leading-relaxed">{weapon.description}</p>
              </div>
              {/* Stats */}
              <div className="w-full mb-4">
                <h4 className="text-white font-bold text-lg mb-3 text-center">Stats:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-base">
                  {KEY_STATS.filter(stat => weapon.stats && weapon.stats[stat] !== undefined).map(stat => (
                    <div key={stat} className="text-center">
                      <div className="text-orange-400 font-semibold">{weapon.stats[stat]}</div>
                      <div className="text-gray-400 text-xs">{stat.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Amps Section - always show, at-a-glance, icon + description, no modal, no stats */}
              {weapon.amps && weapon.amps.length > 0 && (
                <div className="w-full mt-4">
                  <h4 className="text-red-300 font-bold text-lg mb-3 text-center">Weapon Amplifiers</h4>
                  <div className="flex flex-col gap-2">
                    {weapon.amps.map((amp: any) => {
                      const affinity = amp.raw?.AmplifierForWeapon?.CombatAffinity || 'default';
                      const descLines = (amp.description || '').split(/\r?\n/);
                      return (
                        <div key={amp.id} className="flex items-center gap-3 bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-2">
                          <img
                            src={getAmpImageByAffinity(affinity)}
                            alt={amp.name}
                            className="w-10 h-10 rounded bg-gray-900 border border-gray-700 object-contain shrink-0"
                          />
                          <div>
                            <div className="text-red-200 font-bold text-base leading-tight">{amp.raw?.DisplayName || amp.name}</div>
                            <div className="text-gray-200 text-sm leading-tight">
                              <span className="font-bold text-gray-100">{descLines[0]}</span>
                              {descLines.length > 1 && (
                                <span className="text-gray-200">{' ' + descLines.slice(1).join(' ')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredWeapons.length === 0 && (
          <div className="text-center py-12">
            <Sword className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400 text-lg mb-2">No weapons found</div>
            <div className="text-gray-500 text-sm">Try adjusting your filters</div>
          </div>
        )}
      </div>

      {/* Amp Modal */}
      <AmpModal amp={selectedAmp} open={ampModalOpen} onClose={() => setAmpModalOpen(false)} />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WeaponsPage;