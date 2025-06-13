import React from 'react';
import { ArrowLeft, Users, Sparkles, Star, Sword, Gem, Bot, Layers, Crown, Zap, Target, Shield, Wand2, Play, BookOpen, TrendingUp } from 'lucide-react';

interface Set1LandingPageProps {
  onBack: () => void;
  onNavigateToPage: (page: string) => void;
}

const Set1LandingPage: React.FC<Set1LandingPageProps> = ({ onBack, onNavigateToPage }) => {
  const gameElements = [
    {
      category: 'Core Elements',
      items: [
        { 
          key: 'illuvials',
          name: 'Illuvials', 
          icon: <Users className="w-8 h-8" />, 
          description: 'Collectible creatures with unique abilities and traits',
          count: '150+',
          gradient: 'from-purple-500 to-blue-500',
          features: ['5 Affinities', '5 Classes', '3 Tiers', 'Unique Abilities']
        },
        { 
          key: 'augments',
          name: 'Augments', 
          icon: <Sparkles className="w-8 h-8" />, 
          description: 'Power-ups that enhance your team composition',
          count: '80+',
          gradient: 'from-cyan-500 to-teal-500',
          features: ['Silver Tier', 'Gold Tier', 'Prismatic Tier', 'Game Changing']
        },
        { 
          key: 'legendary-augments',
          name: 'Legendary Augments', 
          icon: <Star className="w-8 h-8" />, 
          description: 'Rare game-changing augments with massive impact',
          count: '12',
          gradient: 'from-yellow-500 to-orange-500',
          features: ['Ultra Rare', 'Meta Defining', 'Build Around', 'High Impact']
        }
      ]
    },
    {
      category: 'Equipment & Enhancements',
      items: [
        { 
          key: 'weapons',
          name: 'Weapons', 
          icon: <Sword className="w-8 h-8" />, 
          description: 'Combat equipment that defines your Illuvials\' fighting style',
          count: '45+',
          gradient: 'from-red-500 to-pink-500',
          features: ['Melee Weapons', 'Ranged Weapons', 'Magic Weapons', 'Special Abilities']
        },
        { 
          key: 'weapon-amplifiers',
          name: 'Weapon Amplifiers', 
          icon: <Gem className="w-8 h-8" />, 
          description: 'Enhance weapon effectiveness with powerful modifiers',
          count: '30+',
          gradient: 'from-emerald-500 to-green-500',
          features: ['Damage Boost', 'Special Effects', 'Stat Bonuses', 'Unique Mechanics']
        },
        { 
          key: 'drone-augments',
          name: 'Drone Augments', 
          icon: <Bot className="w-8 h-8" />, 
          description: 'Automated support enhancements for strategic advantage',
          count: '25+',
          gradient: 'from-indigo-500 to-purple-500',
          features: ['Auto Support', 'Passive Bonuses', 'Team Buffs', 'Strategic Value']
        },
        { 
          key: 'synergy-augments',
          name: 'Synergy Augments', 
          icon: <Layers className="w-8 h-8" />, 
          description: 'Team synergy boosters that amplify composition strength',
          count: '35+',
          gradient: 'from-orange-500 to-red-500',
          features: ['Team Synergy', 'Combo Effects', 'Scaling Bonuses', 'Meta Synergy']
        }
      ]
    }
  ];

  const stats = [
    { label: 'Total Elements', value: '347+', icon: <Crown className="w-6 h-6" />, color: 'text-yellow-400' },
    { label: 'Unique Abilities', value: '150+', icon: <Zap className="w-6 h-6" />, color: 'text-purple-400' },
    { label: 'Synergy Combinations', value: '1000+', icon: <Target className="w-6 h-6" />, color: 'text-cyan-400' },
    { label: 'Strategic Depth', value: '∞', icon: <Shield className="w-6 h-6" />, color: 'text-green-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Custom Set 1 Header */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-cyan-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(147,51,234,0.3),transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.3),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(6,182,212,0.3),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating Game Elements */}
          {Array.from({ length: 30 }).map((_, i) => (
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
              {i % 6 === 0 ? (
                <Users className="w-4 h-4 text-purple-400/30" />
              ) : i % 6 === 1 ? (
                <Sparkles className="w-4 h-4 text-cyan-400/30" />
              ) : i % 6 === 2 ? (
                <Sword className="w-4 h-4 text-red-400/30" />
              ) : i % 6 === 3 ? (
                <Gem className="w-4 h-4 text-green-400/30" />
              ) : i % 6 === 4 ? (
                <Bot className="w-4 h-4 text-indigo-400/30" />
              ) : (
                <Star className="w-4 h-4 text-yellow-400/30" />
              )}
            </div>
          ))}
        </div>

        {/* Glass morphism overlay */}
        <div className="relative backdrop-blur-xl bg-gray-900/80 border-b border-gray-700/50">
          <div className="px-8 py-12">
            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={onBack}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-700/50 backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Main
              </button>
            </div>

            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25 mx-auto animate-pulse">
                  <Gem className="w-16 h-16 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <Crown className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                <Star className="w-6 h-6 text-cyan-400 absolute -bottom-2 -left-2 animate-spin" style={{ animationDuration: '3s' }} />
              </div>

              <h1 className="text-6xl md:text-7xl font-black mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  SET 1: GENESIS
                </span>
              </h1>
              
              <p className="text-2xl text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed">
                The complete collection of <span className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-bold">game elements</span> that define the Illuvium experience. 
                Explore every Illuvial, augment, weapon, and enhancement in the Genesis set.
              </p>

              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                  COMPLETE COLLECTION
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group text-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-200 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-white text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Game Elements Categories */}
        {gameElements.map((category, categoryIdx) => (
          <div key={categoryIdx} className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4">{category.category}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => onNavigateToPage(item.key)}
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <h3 className="text-white font-bold text-xl">{item.name}</h3>
                      <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
                        {item.count}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-center mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {item.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 hover:from-purple-600/40 hover:to-cyan-600/40 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 group-hover:shadow-lg">
                    Explore {item.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Additional Resources */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 text-center">
          <h3 className="text-white text-2xl font-bold mb-4">Need More Information?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Dive deeper into the mechanics and strategies with our comprehensive guides and resources.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
              <BookOpen className="w-5 h-5" />
              Strategy Guides
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
              <TrendingUp className="w-5 h-5" />
              Meta Analysis
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
              <Play className="w-5 h-5" />
              Video Tutorials
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Set1LandingPage;