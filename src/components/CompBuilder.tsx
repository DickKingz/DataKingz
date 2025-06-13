import React, { useState } from 'react';
import { ArrowLeft, Plus, X, Save, Star, Target, Users, Zap, Hammer, Sparkles, Wand2, Crown } from 'lucide-react';
import { Champion, Augment, Item } from '../types';
import { mockChampions, mockAugments, mockItems } from '../data/mockData';
import PositioningBoard from './PositioningBoard';
import { useNavigate } from 'react-router-dom';

interface CompBuilderProps {
  onBack: () => void;
}

interface BuilderComp {
  name: string;
  playstyle: string;
  difficulty: number;
  champions: Champion[];
  augments: Augment[];
  earlyComp: Champion[];
  itemPriority: Item[];
  positioning: { champion: Champion; position: { row: number; col: number } }[];
  stages: { stage: number; strategy: string }[];
  tip: string;
}

const CompBuilder: React.FC<CompBuilderProps> = ({ onBack }) => {
  const [comp, setComp] = useState<BuilderComp>({
    name: '',
    playstyle: '',
    difficulty: 1,
    champions: [],
    augments: [],
    earlyComp: [],
    itemPriority: [],
    positioning: [],
    stages: [
      { stage: 2, strategy: '' },
      { stage: 3, strategy: '' },
      { stage: 4,strategy: '' }
    ],
    tip: ''
  });

  const [activeSection, setActiveSection] = useState<'basic' | 'champions' | 'augments' | 'items' | 'positioning' | 'strategy'>('basic');
  const [selectedPosition, setSelectedPosition] = useState<{ row: number; col: number } | null>(null);
  const [selectedChampionForPosition, setSelectedChampionForPosition] = useState<Champion | null>(null);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [selectedAugment, setSelectedAugment] = useState<Augment | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/app');
  };

  const addChampion = (champion: Champion) => {
    setSelectedChampion(champion);
  };

  const removeChampion = (championId: string) => {
    setComp(prev => ({
      ...prev,
      champions: prev.champions.filter(c => c.id !== championId),
      earlyComp: prev.earlyComp.filter(c => c.id !== championId),
      positioning: prev.positioning.filter(p => p.champion.id !== championId)
    }));
  };

  const addToEarlyComp = (champion: Champion) => {
    if (comp.earlyComp.length < 6 && !comp.earlyComp.find(c => c.id === champion.id)) {
      setComp(prev => ({
        ...prev,
        earlyComp: [...prev.earlyComp, champion]
      }));
    }
  };

  const addAugment = (augment: Augment) => {
    setSelectedAugment(augment);
  };

  const addItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handlePositionSelect = (row: number, col: number) => {
    setSelectedPosition({ row, col });
    if (selectedChampion) {
      setComp(prev => ({
        ...prev,
        positioning: [...prev.positioning, { champion: selectedChampion, position: { row, col } }]
      }));
      setSelectedChampion(null);
    }
  };

  const updateStageStrategy = (stage: number, strategy: string) => {
    setComp(prev => ({
      ...prev,
      stages: prev.stages.map(s => s.stage === stage ? { ...s, strategy } : s)
    }));
  };

  const submitComp = () => {
    // Here you would submit to your backend
    console.log('Submitting comp:', comp);
    alert('Composition submitted for community review!');
    onBack();
  };

  const sectionItems = [
    { key: 'basic', label: 'Basic Info', icon: <Target className="w-4 h-4" />, gradient: 'from-blue-500 to-cyan-500' },
    { key: 'champions', label: 'Champions', icon: <Users className="w-4 h-4" />, gradient: 'from-purple-500 to-pink-500' },
    { key: 'augments', label: 'Augments', icon: <Sparkles className="w-4 h-4" />, gradient: 'from-cyan-500 to-teal-500' },
    { key: 'items', label: 'Items', icon: <Star className="w-4 h-4" />, gradient: 'from-yellow-500 to-orange-500' },
    { key: 'positioning', label: 'Positioning', icon: <Target className="w-4 h-4" />, gradient: 'from-green-500 to-emerald-500' },
    { key: 'strategy', label: 'Strategy', icon: <Wand2 className="w-4 h-4" />, gradient: 'from-red-500 to-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Custom Comp Builder Header */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-amber-900/20 to-yellow-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,146,60,0.2),transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(234,179,8,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating Builder Icons */}
          {Array.from({ length: 20 }).map((_, i) => (
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
                <Hammer className="w-4 h-4 text-orange-400/30" />
              ) : i % 3 === 1 ? (
                <Wand2 className="w-4 h-4 text-amber-400/30" />
              ) : (
                <Crown className="w-4 h-4 text-yellow-400/30" />
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
                Back to Main
              </button>
            </div>

            {/* Main Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-all duration-300 group-hover:scale-105">
                    <Hammer className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  <Sparkles className="w-6 h-6 text-cyan-400 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <h1 className="text-5xl font-black mb-2">
                    <span className="bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent">
                      COMP BUILDER
                    </span>
                  </h1>
                  <p className="text-xl text-gray-400 mb-2">Create and share your custom compositions</p>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-4 py-1 rounded-full font-bold text-sm">
                      CREATION STUDIO
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
                <div className="text-gray-300 text-sm mb-2">Build Progress</div>
                <div className="flex gap-2">
                  {sectionItems.map((item, idx) => (
                    <div
                      key={item.key}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeSection === item.key
                          ? 'bg-orange-400 scale-125'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {sectionItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium ${
                    activeSection === item.key
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-700/50'
                  }`}
                >
                  <div className={activeSection === item.key ? 'text-white' : ''}>
                    {item.icon}
                  </div>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Submit */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 sticky top-8">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Hammer className="w-5 h-5 text-orange-400" />
                Build Summary
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Champions:</span>
                  <span className="text-white">{comp.champions.length}/8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Augments:</span>
                  <span className="text-white">{comp.augments.length}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Items:</span>
                  <span className="text-white">{comp.itemPriority.length}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Positioned:</span>
                  <span className="text-white">{comp.positioning.length}</span>
                </div>
              </div>
              
              <button
                onClick={submitComp}
                className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-5 h-5" />
                Submit Comp
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              {activeSection === 'basic' && (
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-semibold">Basic Information</h3>
                  
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Composition Name</label>
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) => setComp(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter composition name..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Playstyle</label>
                    <input
                      type="text"
                      value={comp.playstyle}
                      onChange={(e) => setComp(prev => ({ ...prev, playstyle: e.target.value }))}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., FAST 9, SLOW ROLL, REROLL..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Difficulty (1-5 stars)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setComp(prev => ({ ...prev, difficulty: star }))}
                          className={`w-8 h-8 rounded ${
                            star <= comp.difficulty ? 'bg-yellow-500' : 'bg-gray-700'
                          } transition-colors`}
                        >
                          <Star className="w-4 h-4 mx-auto text-white" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Pro Tip</label>
                    <textarea
                      value={comp.tip}
                      onChange={(e) => setComp(prev => ({ ...prev, tip: e.target.value }))}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                      placeholder="Share a key tip for playing this composition..."
                    />
                  </div>
                </div>
              )}

              {activeSection === 'champions' && (
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-semibold">Champions ({comp.champions.length}/8)</h3>
                  
                  {/* Selected Champions */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-gray-300 font-medium mb-3">Selected Champions</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {comp.champions.map(champion => (
                        <div key={champion.id} className="relative bg-gray-700 p-3 rounded-lg text-center">
                          <button
                            onClick={() => removeChampion(champion.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="text-white font-medium text-sm">{champion.name}</div>
                          <div className="text-gray-400 text-xs">{champion.cost} cost</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Champions */}
                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Available Champions</h4>
                    <div className="grid grid-cols-5 gap-3 max-h-96 overflow-y-auto">
                      {mockChampions.map(champion => (
                        <button
                          key={champion.id}
                          onClick={() => addChampion(champion)}
                          disabled={comp.champions.find(c => c.id === champion.id) || comp.champions.length >= 8}
                          className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-lg text-center transition-colors"
                        >
                          <div className="text-white font-medium text-sm">{champion.name}</div>
                          <div className="text-gray-400 text-xs">{champion.cost} cost</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Early Comp */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-gray-300 font-medium mb-3">Early Comp ({comp.earlyComp.length}/6)</h4>
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {comp.earlyComp.map(champion => (
                        <div key={champion.id} className="bg-gray-700 p-2 rounded text-center">
                          <div className="text-white text-xs">{champion.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {comp.champions.map(champion => (
                        <button
                          key={champion.id}
                          onClick={() => addToEarlyComp(champion)}
                          disabled={comp.earlyComp.find(c => c.id === champion.id) || comp.earlyComp.length >= 6}
                          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          {champion.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'augments' && (
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-semibold">Augment Priority ({comp.augments.length}/6)</h3>
                  
                  {/* Selected Augments */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-gray-300 font-medium mb-3">Priority Order</h4>
                    <div className="space-y-2">
                      {comp.augments.map((augment, idx) => (
                        <div key={augment.id} className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg">
                          <span className="text-purple-400 font-bold">#{idx + 1}</span>
                          <span className="text-white">{augment.name}</span>
                          <button
                            onClick={() => setComp(prev => ({ ...prev, augments: prev.augments.filter(a => a.id !== augment.id) }))}
                            className="ml-auto text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Augments */}
                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Available Augments</h4>
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {mockAugments.map(augment => (
                        <button
                          key={augment.id}
                          onClick={() => addAugment(augment)}
                          disabled={comp.augments.find(a => a.id === augment.id) || comp.augments.length >= 6}
                          className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 p-3 rounded-lg text-left transition-colors"
                        >
                          <div className="text-white font-medium text-sm">{augment.name}</div>
                          <div className="text-gray-400 text-xs">{augment.type}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'items' && (
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-semibold">Item Priority ({comp.itemPriority.length}/6)</h3>
                  
                  {/* Selected Items */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-gray-300 font-medium mb-3">Priority Order</h4>
                    <div className="flex gap-3 flex-wrap">
                      {comp.itemPriority.map((item, idx) => (
                        <div key={item.id} className="relative bg-gray-700 p-3 rounded-lg text-center">
                          <span className="absolute -top-2 -left-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                            {idx + 1}
                          </span>
                          <button
                            onClick={() => setComp(prev => ({ ...prev, itemPriority: prev.itemPriority.filter(i => i.id !== item.id) }))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="text-white font-medium text-sm">{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Items */}
                  <div>
                    <h4 className="text-gray-300 font-medium mb-3">Available Items</h4>
                    <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                      {mockItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => addItem(item)}
                          disabled={comp.itemPriority.find(i => i.id === item.id) || comp.itemPriority.length >= 6}
                          className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 p-3 rounded-lg text-left transition-colors"
                        >
                          <div className="text-white font-medium text-sm">{item.name}</div>
                          <div className="text-gray-400 text-xs">{item.components?.length || 0} components</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'positioning' && (
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-semibold">Positioning</h3>
                  
                  <PositioningBoard 
                    champions={comp.positioning}
                    isInteractive={true}
                    onPositionClick={handlePositionSelect}
                    selectedPosition={selectedPosition}
                    size="large"
                  />
                  
                  {selectedPosition && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-gray-300 font-medium mb-3">
                        Select champion for position ({selectedPosition.row + 1}, {selectedPosition.col + 1})
                      </h4>
                      <div className="grid grid-cols-4 gap-3">
                        {comp.champions.map(champion => (
                          <button
                            key={champion.id}
                            onClick={() => setSelectedChampionForPosition(champion)}
                            className={`p-3 rounded-lg text-center transition-colors ${
                              selectedChampionForPosition?.id === champion.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                            }`}
                          >
                            <div className="font-medium text-sm">{champion.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'strategy' && (
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-semibold">Strategy Guide</h3>
                  
                  {comp.stages.map(stage => (
                    <div key={stage.stage} className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-purple-400 font-semibold mb-3">Stage {stage.stage}</h4>
                      <textarea
                        value={stage.strategy}
                        onChange={(e) => updateStageStrategy(stage.stage, e.target.value)}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                        placeholder={`Describe the strategy for stage ${stage.stage}...`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .positioning-board {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          padding: 16px;
          background: rgba(17, 24, 39, 0.5);
          border-radius: 16px;
          border: 1px solid rgba(75, 85, 99, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CompBuilder;