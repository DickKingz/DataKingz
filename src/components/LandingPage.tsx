import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Users, Trophy, Zap, Star, ArrowRight, Play, BookOpen, Target, Gem, Bot, Layers, BarChart } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (destination: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Cycle through features
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Analytics",
      description: "Meta stats, player activity, and match data",
      gradient: "from-blue-400 to-cyan-500",
      destination: 'analytics',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Tier Lists",
      description: "Comprehensive rankings for all game elements",
      gradient: "from-purple-400 to-pink-500",
      destination: 'tierlist',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Strategy Guides",
      description: "In-depth guides and meta analysis",
      gradient: "from-blue-400 to-cyan-500",
      destination: 'guides',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Tools",
      description: "Build and share compositions with the community",
      gradient: "from-green-400 to-emerald-500",
      destination: 'community',
    },
  ];

  const gameElements = [
    { icon: <Users className="w-6 h-6" />, name: "Illuvials", count: "150+", color: "text-purple-400", destination: 'illuvials' },
    { icon: <Sparkles className="w-6 h-6" />, name: "Augments", count: "80+", color: "text-cyan-400", destination: 'augments' },
    { icon: <Star className="w-6 h-6" />, name: "Legendary", count: "12", color: "text-yellow-400", destination: 'legendary-augments' },
    { icon: <Zap className="w-6 h-6" />, name: "Weapons", count: "45+", color: "text-red-400", destination: 'weapons' },
    { icon: <Gem className="w-6 h-6" />, name: "Amplifiers", count: "30+", color: "text-emerald-400", destination: 'amplifiers' },
    { icon: <Bot className="w-6 h-6" />, name: "Drones", count: "25+", color: "text-indigo-400", destination: 'drone-augments' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Much Darker Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-950">
        {/* Subtle Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-cyan-900/10 to-teal-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-gradient-to-br from-pink-900/10 to-purple-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-yellow-900/10 to-orange-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Very Subtle Animated Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="border border-white/5 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Minimal Floating Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full animate-bounce opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Minimal Glass Morphism Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-8 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Enhanced Logo Animation with bigger size and rounded edges */}
            <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative inline-block">
                {/* Enhanced logo container with bigger size and rounded edges */}
                <div className="w-40 h-40 rounded-3xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-500/10 backdrop-blur-sm border border-purple-500/20">
                  <img 
                    src="/DataKingzLogo.png" 
                    alt="DataKingz" 
                    className="w-36 h-36 object-contain filter drop-shadow-2xl animate-pulse rounded-2xl"
                  />
                  {/* Enhanced glow effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-cyan-500/30 rounded-3xl blur-2xl opacity-50 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-400/20 rounded-3xl blur-3xl opacity-30 animate-pulse scale-150" />
                </div>
                <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '3s' }} />
                <Star className="w-6 h-6 text-cyan-400 absolute -bottom-2 -left-2 animate-bounce" />
              </div>
            </div>

            {/* Main Title */}
            <div className={`mb-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-7xl md:text-8xl font-black mb-4">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                  Data
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Kingz
                </span>
              </h1>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                  COMPANION
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <div className={`mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-2xl md:text-3xl text-gray-400 leading-relaxed max-w-4xl mx-auto">
                Your ultimate <span className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-bold">community-driven companion</span> for all your Illuvium needs. 
                Master the meta, dominate tournaments, and connect with fellow Rangers.
              </p>
            </div>

            {/* Feature Showcase */}
            <div className={`mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {features.map((feature, index) => (
                  <button
                    key={index}
                    className={`relative group transition-all duration-500 w-full text-left focus:outline-none ${currentFeature === index ? 'scale-105' : 'scale-100'}`}
                    onClick={() => onNavigate(feature.destination)}
                    tabIndex={0}
                  >
                    <div className={`bg-gray-950/70 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-500 ${currentFeature === index ? 'border-purple-500/30 shadow-2xl shadow-purple-900/20' : 'border-gray-800/50 hover:border-gray-700/50'}`}>
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto transition-all duration-300 ${currentFeature === index ? 'scale-110' : 'group-hover:scale-105'}`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-gray-500 text-sm">{feature.description}</p>
                    </div>
                    {currentFeature === index && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-cyan-900/10 rounded-2xl animate-pulse pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Elements Counter */}
            <div className={`mb-12 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-gray-950/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 max-w-4xl mx-auto">
                <h3 className="text-white font-bold text-2xl mb-6">Complete Set 1: Genesis Coverage</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {gameElements.map((element, index) => (
                    <button
                      key={index}
                      className="text-center group hover:scale-105 transition-all duration-300 focus:outline-none"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => onNavigate(element.destination)}
                    >
                      <div className={`w-12 h-12 bg-gray-900/50 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:bg-gray-800/50 transition-colors ${element.color}`}>
                        {element.icon}
                      </div>
                      <div className="text-white font-semibold text-lg">{element.count}</div>
                      <div className="text-gray-500 text-sm">{element.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className={`transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => onNavigate('set1')}
                  className="group relative bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-900/25 hover:shadow-purple-900/40"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Gem className="w-6 h-6" />
                    Explore Set 1
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                </button>
                <button
                  onClick={() => onNavigate('tournaments')}
                  className="group relative bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-yellow-900/25 hover:shadow-yellow-900/40"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    Join Tournaments
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                </button>
                <button
                  onClick={() => onNavigate('guides')}
                  className="group relative bg-gray-900/50 backdrop-blur-xl hover:bg-gray-800/50 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 border border-gray-800/50 hover:border-gray-700/50"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <BookOpen className="w-6 h-6" />
                    Read Guides
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-cyan-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`pb-12 transition-all duration-1000 delay-1300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto px-8">
            <div className="bg-gray-950/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-semibold">Community Driven</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                <span className="text-gray-500">Open Source</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                <span className="text-gray-500">Always Updated</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Built by Rangers, for Rangers. Join thousands of players using DataKingz to master the meta, 
                climb the ranks, and dominate the Gauntlet. Your journey to becoming a legendary Ranger starts here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;