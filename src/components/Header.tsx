import React, { useState, useEffect, useRef } from 'react';
import { Search, Shield, ChevronDown, Plus, Users, BookOpen, HelpCircle, TrendingUp, Map, Coins, Crown, Swords, Zap, Trophy, User, LogIn, Sparkles, Star, Play, Calendar, Eye, Sword, Gem, Wand2, Target, Bot, Layers } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import UserProfile from './UserProfile';

interface HeaderProps {
  activeTab: 'augments' | 'comps' | 'items' | 'gauntlet' | 'tournaments';
  onTabChange: (tab: 'augments' | 'comps' | 'items' | 'gauntlet' | 'tournaments') => void;
  onShowBuilder?: () => void;
  onShowCommunity?: () => void;
  onShowGuides?: (topic: string) => void;
  onShowTournaments?: () => void;
  onShowSet1Page?: (page: string) => void;
  onShowSet1Main?: () => void;
  onShowAnalytics?: () => void;
  showTabNavigation?: boolean; // New prop to control tab navigation visibility
  // New props for dynamic header content
  currentPage?: string;
  currentSubPage?: string;
  isAnalytics?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  onShowBuilder, 
  onShowCommunity, 
  onShowGuides,
  onShowTournaments,
  onShowSet1Page,
  onShowSet1Main,
  onShowAnalytics,
  showTabNavigation = true, // Default to true for backward compatibility
  currentPage,
  currentSubPage,
  isAnalytics = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showGuidesDropdown, setShowGuidesDropdown] = useState(false);
  const [showGauntletDropdown, setShowGauntletDropdown] = useState(false);
  const [showStudyHallDropdown, setShowStudyHallDropdown] = useState(false);
  const [showSet1Dropdown, setShowSet1Dropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Refs for dropdown containers
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const guidesDropdownRef = useRef<HTMLDivElement>(null);
  const gauntletDropdownRef = useRef<HTMLDivElement>(null);
  const studyHallDropdownRef = useRef<HTMLDivElement>(null);
  const set1DropdownRef = useRef<HTMLDivElement>(null);

  // Timeout refs for delayed closing
  const toolsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const guidesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gauntletTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const studyHallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const set1TimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close login modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && showLoginModal) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated, showLoginModal]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setShowToolsDropdown(false);
      }
      if (guidesDropdownRef.current && !guidesDropdownRef.current.contains(event.target as Node)) {
        setShowGuidesDropdown(false);
      }
      if (gauntletDropdownRef.current && !gauntletDropdownRef.current.contains(event.target as Node)) {
        setShowGauntletDropdown(false);
      }
      if (studyHallDropdownRef.current && !studyHallDropdownRef.current.contains(event.target as Node)) {
        setShowStudyHallDropdown(false);
      }
      if (set1DropdownRef.current && !set1DropdownRef.current.contains(event.target as Node)) {
        setShowSet1Dropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
      if (guidesTimeoutRef.current) clearTimeout(guidesTimeoutRef.current);
      if (gauntletTimeoutRef.current) clearTimeout(gauntletTimeoutRef.current);
      if (studyHallTimeoutRef.current) clearTimeout(studyHallTimeoutRef.current);
      if (set1TimeoutRef.current) clearTimeout(set1TimeoutRef.current);
    };
  }, []);

  // Enhanced mouse leave handlers with longer delay
  const handleMouseLeave = (dropdown: 'tools' | 'guides' | 'gauntlet' | 'studyhall' | 'set1') => {
    const timeoutRef = dropdown === 'tools' ? toolsTimeoutRef : 
                      dropdown === 'guides' ? guidesTimeoutRef : 
                      dropdown === 'gauntlet' ? gauntletTimeoutRef : 
                      dropdown === 'studyhall' ? studyHallTimeoutRef : set1TimeoutRef;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout with longer delay
    timeoutRef.current = setTimeout(() => {
      switch (dropdown) {
        case 'tools':
          setShowToolsDropdown(false);
          break;
        case 'guides':
          setShowGuidesDropdown(false);
          break;
        case 'gauntlet':
          setShowGauntletDropdown(false);
          break;
        case 'studyhall':
          setShowStudyHallDropdown(false);
          break;
        case 'set1':
          setShowSet1Dropdown(false);
          break;
      }
    }, 500); // Increased delay to 500ms
  };

  // Mouse enter handlers to cancel closing
  const handleMouseEnter = (dropdown: 'tools' | 'guides' | 'gauntlet' | 'studyhall' | 'set1') => {
    const timeoutRef = dropdown === 'tools' ? toolsTimeoutRef : 
                      dropdown === 'guides' ? guidesTimeoutRef : 
                      dropdown === 'gauntlet' ? gauntletTimeoutRef : 
                      dropdown === 'studyhall' ? studyHallTimeoutRef : set1TimeoutRef;
    
    // Clear any pending close timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Open the dropdown
    switch (dropdown) {
      case 'tools':
        setShowToolsDropdown(true);
        break;
      case 'guides':
        setShowGuidesDropdown(true);
        break;
      case 'gauntlet':
        setShowGauntletDropdown(true);
        break;
      case 'studyhall':
        setShowStudyHallDropdown(true);
        break;
      case 'set1':
        setShowSet1Dropdown(true);
        break;
    }
  };

  // Function to get dynamic header content based on current page
  const getHeaderContent = () => {
    if (isAnalytics) {
      return {
        title: 'ANALYTICS',
        subtitle: 'DASHBOARD',
        info: 'Meta, player, and match data',
        searchPlaceholder: 'Search analytics...'
      };
    }
    // Set 1 pages
    if (currentPage === 'set1') {
      if (currentSubPage === 'illuvials') {
        return {
          title: 'SET 1',
          subtitle: 'ILLUVIALS',
          info: 'Collectible Creatures',
          searchPlaceholder: 'Search Illuvials...'
        };
      } else if (currentSubPage === 'augments') {
        return {
          title: 'SET 1',
          subtitle: 'AUGMENTS',
          info: 'Power-up Enhancements',
          searchPlaceholder: 'Search augments...'
        };
      } else if (currentSubPage === 'weapons') {
        return {
          title: 'SET 1',
          subtitle: 'WEAPONS',
          info: 'Combat Equipment',
          searchPlaceholder: 'Search weapons...'
        };
      } else {
        return {
          title: 'SET 1',
          subtitle: 'GENESIS',
          info: 'Complete Collection',
          searchPlaceholder: 'Search Set 1...'
        };
      }
    }

    // Guides pages
    if (currentPage === 'guides') {
      return {
        title: 'GUIDES',
        subtitle: 'LEARN',
        info: 'Master the Game',
        searchPlaceholder: 'Search guides...'
      };
    }

    // Tools pages (Builder, Community)
    if (currentPage === 'tools') {
      if (currentSubPage === 'builder') {
        return {
          title: 'TOOLS',
          subtitle: 'BUILD',
          info: 'Create Compositions',
          searchPlaceholder: 'Search tools...'
        };
      } else if (currentSubPage === 'community') {
        return {
          title: 'TOOLS',
          subtitle: 'COMMUNITY',
          info: 'Share & Discover',
          searchPlaceholder: 'Search submissions...'
        };
      } else {
        return {
          title: 'TOOLS',
          subtitle: 'CREATE',
          info: 'Build Your Strategy',
          searchPlaceholder: 'Search tools...'
        };
      }
    }

    // Tournaments
    if (currentPage === 'tournaments' || activeTab === 'tournaments') {
      return {
        title: 'TOURNAMENTS',
        subtitle: 'COMPETE',
        info: 'Live & Upcoming Events',
        searchPlaceholder: 'Search tournaments...'
      };
    }

    // Tierlist pages (default behavior)
    if (activeTab === 'comps') {
      return {
        title: 'TIERLIST',
        subtitle: 'COMPS',
        info: '● Gauntlet Patch 1.10.0',
        searchPlaceholder: 'Search comps...'
      };
    } else if (activeTab === 'items') {
      return {
        title: 'TIERLIST',
        subtitle: 'ITEMS',
        info: '● Gauntlet Patch 1.10.0',
        searchPlaceholder: 'Search items...'
      };
    } else if (activeTab === 'augments') {
      return {
        title: 'TIERLIST',
        subtitle: 'AUGMENTS',
        info: '● Gauntlet Patch 1.10.0',
        searchPlaceholder: 'Search augments...'
      };
    } else if (activeTab === 'gauntlet') {
      return {
        title: 'TIERLIST',
        subtitle: 'GAUNTLET',
        info: '● Tournament Information',
        searchPlaceholder: 'Search gauntlet...'
      };
    }

    // Default fallback
    return {
      title: 'TIERLIST',
      subtitle: 'COMPS',
      info: '● Gauntlet Patch 1.10.0',
      searchPlaceholder: 'Search...'
    };
  };

  const headerContent = getHeaderContent();

  const guideTopics = [
    { key: 'dictionary', name: 'Dictionary', icon: <BookOpen className="w-5 h-5 text-blue-400" />, description: 'Terms & terminology' },
    { key: 'faq', name: 'FAQ', icon: <HelpCircle className="w-5 h-5 text-green-400" />, description: 'Frequently asked questions' },
    { key: 'game-progression', name: 'Game Progression', icon: <TrendingUp className="w-5 h-5 text-pink-400" />, description: 'Level & economy strategy' },
    { key: 'shop-values', name: 'Shop Values', icon: <Coins className="w-5 h-5 text-yellow-400" />, description: 'Pricing & probabilities' },
    { key: 'hyper', name: 'Hyper', icon: <Zap className="w-5 h-5 text-purple-400" />, description: 'Hyper system mechanics' },
    { key: 'regions', name: 'Regions', icon: <Map className="w-5 h-5 text-cyan-400" />, description: 'Regional differences' },
    { key: 'match-flow', name: 'Match Flow', icon: <Crown className="w-5 h-5 text-pink-400" />, description: 'Round progression' },
    { key: 'pve-rounds', name: 'PvE Rounds', icon: <Swords className="w-5 h-5 text-orange-400" />, description: 'Neutral round strategies' },
  ];

  const gauntletItems = [
    { key: 'gauntlet', name: 'Gauntlet Info', description: 'Tournament information & meta' },
    { key: 'comps', name: 'Comps', description: 'Team compositions' },
    { key: 'items', name: 'Items', description: 'Equipment & artifacts' },
    { key: 'augments', name: 'Augments', description: 'Power-ups & bonuses' },
  ];

  // Set 1 game elements
  const set1Items = [
    {
      category: 'Core Elements',
      items: [
        { 
          key: 'illuvials',
          name: 'Illuvials', 
          icon: <Users className="w-5 h-5" />, 
          description: 'Collectible creatures with unique abilities',
          count: '150+',
          gradient: 'from-purple-500 to-blue-500'
        },
        { 
          key: 'augments',
          name: 'Augments', 
          icon: <Sparkles className="w-5 h-5" />, 
          description: 'Power-ups that enhance your team',
          count: '80+',
          gradient: 'from-cyan-500 to-teal-500'
        },
        { 
          key: 'legendary-augments',
          name: 'Legendary Augments', 
          icon: <Star className="w-5 h-5" />, 
          description: 'Rare game-changing augments',
          count: '12',
          gradient: 'from-yellow-500 to-orange-500'
        }
      ]
    },
    {
      category: 'Equipment & Enhancements',
      items: [
        { 
          key: 'weapons',
          name: 'Weapons', 
          icon: <Sword className="w-5 h-5" />, 
          description: 'Combat equipment for your Illuvials',
          count: '45+',
          gradient: 'from-red-500 to-pink-500'
        },
        { 
          key: 'drone-augments',
          name: 'Drone Augments', 
          icon: <Bot className="w-5 h-5" />, 
          description: 'Automated support enhancements',
          count: '25+',
          gradient: 'from-indigo-500 to-purple-500'
        },
        { 
          key: 'synergy-augments',
          name: 'Synergy Augments', 
          icon: <Layers className="w-5 h-5" />, 
          description: 'Team synergy boosters',
          count: '35+',
          gradient: 'from-orange-500 to-red-500'
        }
      ]
    }
  ];

  // Going Hyper podcast episodes and content
  const goingHyperContent = {
    latestEpisode: {
      title: 'Patch 1.10.1  & Gauntlet Meta Deep Dive',
      date: '29 May 2025',
      views: '445 views',
      description: 'Rich and Jackson break down the latest patch changes and discuss the evolving Gauntlet meta.',
      duration: '1:23:45'
    },
    upcomingEpisode: {
      title: 'Community Spotlight & D1SK Openings',
      date: 'Next Episode: 12 June 2025',
      time: '20:00 UTC'
    }
  };

  const truncateId = (id: string) => {
    if (id.length <= 12) return id;
    return `${id.slice(0, 6)}...${id.slice(-4)}`;
  };

  return (
    <div className="relative z-50">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(119,198,255,0.2),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Glass morphism overlay */}
      <div className="relative backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
        {/* Top Navigation */}
        <div className="px-6 py-4 border-b border-slate-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Logo with enhanced styling and navigation */}
              <button
                onClick={() => onShowGuides?.('guides')}
                className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105 overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-400/10 backdrop-blur-sm border border-purple-500/20">
                    <img 
                      src="/DataKingzLogo.png" 
                      alt="DataKingz" 
                      className="w-12 h-12 object-contain filter drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300 rounded-xl"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-400/30 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-400/20 to-cyan-300/20 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 scale-150" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-xl bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                    <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Data</span>Kingz
                  </span>
                  <div className="relative">
                    <span className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                      COMPANION
                    </span>
                    <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                </div>
              </button>

              {/* Enhanced Navigation */}
              <nav className="flex items-center gap-6">
                <button 
                  onClick={() => onTabChange('comps')}
                  className="relative group bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2.5 rounded-xl font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-105"
                >
                  <span className="relative z-10">Tierlist</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                </button>
                {/* Analytics Button */}
                <button
                  onClick={() => {
                    onShowAnalytics?.();
                    onTabChange('comps'); // Reset to a default tab when showing analytics
                  }}
                  className="relative group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-bold hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
                >
                  <span className="relative z-10">Analytics</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                </button>

                {/* Set 1 Dropdown */}
                <div 
                  className="relative" 
                  ref={set1DropdownRef}
                  onMouseEnter={() => handleMouseEnter('set1')}
                  onMouseLeave={() => handleMouseLeave('set1')}
                >
                  <button
                    onClick={() => {
                      onShowSet1Main?.();
                      setShowSet1Dropdown(false);
                    }}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm group"
                  >
                    <Gem className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                    Set 1
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSet1Dropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`absolute top-full left-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl min-w-[600px] transition-all duration-300 origin-top ${
                    showSet1Dropdown 
                      ? 'opacity-100 scale-100 translate-y-0 z-[100]' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none z-[-1]'
                  }`}>
                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-6 pb-4 border-b border-slate-700/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Gem className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">Set 1: Genesis</h3>
                            <p className="text-slate-400 text-xs">Explore all game elements</p>
                          </div>
                        </div>
                      </div>

                      {/* Categories */}
                      {set1Items.map((category, categoryIdx) => (
                        <div key={categoryIdx} className="mb-6 last:mb-0">
                          <h4 className="text-slate-300 font-semibold text-sm mb-4 uppercase tracking-wide">
                            {category.category}
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {category.items.map((item, itemIdx) => (
                              <button
                                key={itemIdx}
                                onClick={() => {
                                  onShowSet1Page?.(item.key);
                                  setShowSet1Dropdown(false);
                                }}
                                className="group bg-slate-700/30 hover:bg-slate-700/50 rounded-xl p-4 text-left transition-all duration-300 hover:scale-105 border border-slate-600/30 hover:border-slate-500/50"
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                                    <div className="text-white">
                                      {item.icon}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <h5 className="text-white font-semibold text-sm group-hover:text-cyan-400 transition-colors">
                                        {item.name}
                                      </h5>
                                      <span className="text-slate-400 text-xs font-medium bg-slate-600/50 px-2 py-1 rounded">
                                        {item.count}
                                      </span>
                                    </div>
                                    <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300 transition-colors">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Footer */}
                      <div className="pt-4 border-t border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <div className="text-slate-400 text-xs">
                            Complete collection of Set 1 game elements
                          </div>
                          <button 
                            onClick={() => {
                              onShowSet1Main?.();
                              setShowSet1Dropdown(false);
                            }}
                            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                          >
                            View All
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Guides Dropdown */}
                <div 
                  className="relative" 
                  ref={guidesDropdownRef}
                  onMouseEnter={() => handleMouseEnter('guides')}
                  onMouseLeave={() => handleMouseLeave('guides')}
                >
                  <button
                    onClick={() => setShowGuidesDropdown(!showGuidesDropdown)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm group"
                  >
                    <BookOpen className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                    Guides
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showGuidesDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`absolute top-full left-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl min-w-[320px] transition-all duration-300 origin-top ${
                    showGuidesDropdown 
                      ? 'opacity-100 scale-100 translate-y-0 z-[100]' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none z-[-1]'
                  }`}>
                    <div className="p-3">
                      {guideTopics.map(topic => (
                        <button
                          key={topic.key}
                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-slate-700/40 rounded-lg transition-all duration-200"
                          onClick={() => onShowGuides?.(topic.key)}
                        >
                          {topic.icon}
                          <div>
                            <div className="font-semibold text-white">{topic.name}</div>
                            <div className="text-xs text-slate-400">{topic.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Going Hyper (Study Hall) Dropdown */}
                <div 
                  className="relative" 
                  ref={studyHallDropdownRef}
                  onMouseEnter={() => handleMouseEnter('studyhall')}
                  onMouseLeave={() => handleMouseLeave('studyhall')}
                >
                  <button
                    onClick={() => setShowStudyHallDropdown(!showStudyHallDropdown)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm group"
                  >
                    <Play className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                    Going Hyper
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showStudyHallDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`absolute top-full left-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl min-w-[400px] transition-all duration-300 origin-top ${
                    showStudyHallDropdown 
                      ? 'opacity-100 scale-100 translate-y-0 z-[100]' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none z-[-1]'
                  }`}>
                    <div className="p-4">
                      {/* Podcast Header */}
                      <div className="mb-4 pb-4 border-b border-slate-700/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">Going Hyper</h3>
                            <p className="text-slate-400 text-xs">Official Illuvium Podcast</p>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">
                          Join Rich and Jackson every two weeks at 20:00 UTC for the latest Illuvium news, exclusive insights, and high-energy gameplay.
                        </p>
                      </div>

                      {/* Latest Episode */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-red-400 font-medium text-sm">Latest Episode</span>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3 hover:bg-slate-700/70 transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-white font-semibold text-sm group-hover:text-cyan-400 transition-colors">
                              {goingHyperContent.latestEpisode.title}
                            </h4>
                            <span className="text-slate-400 text-xs">{goingHyperContent.latestEpisode.duration}</span>
                          </div>
                          <p className="text-slate-400 text-xs mb-2">{goingHyperContent.latestEpisode.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span className="text-slate-500 text-xs">{goingHyperContent.latestEpisode.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="w-3 h-3 text-slate-500" />
                              <span className="text-slate-500 text-xs">{goingHyperContent.latestEpisode.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Upcoming Episode */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 font-medium text-sm">Next Episode</span>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <h4 className="text-white font-semibold text-sm mb-1">
                            {goingHyperContent.upcomingEpisode.title}
                          </h4>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-blue-400">{goingHyperContent.upcomingEpisode.date}</span>
                            <span className="text-slate-400">{goingHyperContent.upcomingEpisode.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* What to Expect */}
                      <div>
                        <h4 className="text-white font-semibold text-sm mb-3">What to Expect:</h4>
                        <div className="space-y-2">
                          {[
                            'Illuvium News & Updates',
                            'Special Developer Guests',
                            'Live D1SK Openings',
                            'Gameplay Leaks & Previews',
                            'Community Challenges',
                            'Gauntlet Battles vs Rich & Team'
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                              <span className="text-slate-300 text-xs">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                        <button className="flex-1 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <Play className="w-3 h-3" />
                          Watch Latest
                        </button>
                        <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                          All Episodes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Tools Dropdown */}
                <div 
                  className="relative" 
                  ref={toolsDropdownRef}
                  onMouseEnter={() => handleMouseEnter('tools')}
                  onMouseLeave={() => handleMouseLeave('tools')}
                >
                  <button
                    onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm group"
                  >
                    <Zap className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                    Tools
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showToolsDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`absolute top-full left-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl min-w-[280px] transition-all duration-300 origin-top ${
                    showToolsDropdown 
                      ? 'opacity-100 scale-100 translate-y-0 z-[100]' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none z-[-1]'
                  }`}>
                    <div className="p-3">
                      <button
                        onClick={() => {
                          onShowBuilder?.();
                          setShowToolsDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 text-left rounded-lg group"
                      >
                        <Plus className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-all duration-200" />
                        <div>
                          <div className="font-medium text-sm">Comp Builder</div>
                          <div className="text-xs text-slate-400 group-hover:text-slate-300">Create custom compositions</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          onShowCommunity?.();
                          setShowToolsDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 text-left rounded-lg group"
                      >
                        <Users className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-all duration-200" />
                        <div>
                          <div className="font-medium text-sm">Community Submissions</div>
                          <div className="text-xs text-slate-400 group-hover:text-slate-300">View & vote on user comps</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Tournaments Button */}
                <button
                  onClick={() => onShowTournaments?.()}
                  className="relative group text-slate-300 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 group-hover:text-yellow-400 transition-colors" />
                    Tournaments
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                {/* Enhanced Gauntlet Dropdown */}
                <div 
                  className="relative" 
                  ref={gauntletDropdownRef}
                  onMouseEnter={() => handleMouseEnter('gauntlet')}
                  onMouseLeave={() => handleMouseLeave('gauntlet')}
                >
                  <button
                    onClick={() => setShowGauntletDropdown(!showGauntletDropdown)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm group"
                  >
                    <Shield className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                    Gauntlet
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showGauntletDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`absolute top-full left-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl min-w-[240px] transition-all duration-300 origin-top ${
                    showGauntletDropdown 
                      ? 'opacity-100 scale-100 translate-y-0 z-[100]' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none z-[-1]'
                  }`}>
                    <div className="p-3">
                      {gauntletItems.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => {
                            onTabChange(item.key as any);
                            setShowGauntletDropdown(false);
                          }}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left rounded-lg group transition-all duration-200 ${
                            activeTab === item.key
                              ? 'bg-gradient-to-r from-purple-600/50 to-blue-600/50 text-white border border-purple-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className={`text-xs mt-0.5 ${
                              activeTab === item.key ? 'text-purple-200' : 'text-slate-400 group-hover:text-slate-300'
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            {/* Enhanced User Authentication */}
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  {user.isAdmin && (
                    <div className="relative group bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl px-4 py-2 flex items-center gap-2 backdrop-blur-sm">
                      <Crown className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-yellow-400 text-sm font-bold">ADMIN</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <button
                    onClick={() => setShowUserProfile(true)}
                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-all duration-300 bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2.5 rounded-xl border border-slate-700/50 hover:border-slate-600/50 backdrop-blur-sm group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{user.nickname}</div>
                      <div className="text-xs text-slate-400">ID: {truncateId(user.playerId)}</div>
                    </div>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="relative group flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-300 bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-slate-700/50 hover:to-slate-600/50 px-6 py-2.5 rounded-xl border border-slate-700/50 hover:border-slate-600/50 backdrop-blur-sm"
                >
                  <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Connect Wallet</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Main Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-slate-600/50 px-4 py-2 rounded-xl text-slate-300 font-medium backdrop-blur-sm">
                  <span className="text-green-400">●</span> Patch 1.10.1
                </span>
                <span className="text-slate-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  Last Updated 6 Hours Ago
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105 overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-400/10 backdrop-blur-sm border border-purple-500/20">
                  <img 
                    src="/DataKingzLogo.png" 
                    alt="DataKingz" 
                    className="w-16 h-16 object-contain filter drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300 rounded-xl"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-400/30 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-400/20 to-cyan-300/20 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 scale-150" />
                <Star className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-white text-4xl font-black mb-2">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                    {headerContent.title}
                  </span>
                  <span className="text-yellow-400 ml-3">▶ {headerContent.subtitle}</span>
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{headerContent.info}</span>
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Enhanced Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder={headerContent.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800/50 backdrop-blur-sm text-white pl-12 pr-6 py-3 rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 w-80 hover:bg-slate-700/50 group-hover:border-slate-600/50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              
              {/* Enhanced Filter buttons - Only show when tab navigation is visible */}
              {showTabNavigation && !isAnalytics && (
                <>
                  {activeTab === 'augments' && (
                    <div className="flex gap-3">
                      <button className="relative group bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-5 py-2.5 rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-105">
                        Silver
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                      </button>
                      <button className="bg-slate-700/50 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-600/50 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50">
                        Gold
                      </button>
                      <button className="bg-slate-700/50 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-600/50 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50">
                        Prismatic
                      </button>
                    </div>
                  )}
                  
                  {activeTab === 'items' && (
                    <div className="flex gap-3">
                      <button className="relative group bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-5 py-2.5 rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-105">
                        Craftables
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                      </button>
                      <button className="bg-slate-700/50 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-600/50 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50">
                        Radiants
                      </button>
                      <button className="bg-slate-700/50 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-600/50 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50">
                        Artifacts
                      </button>
                      <button className="bg-slate-700/50 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-600/50 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50">
                        Supports
                      </button>
                      <button className="bg-slate-700/50 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-600/50 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50">
                        Emblems
                      </button>
                    </div>
                  )}

                  {activeTab === 'comps' && (
                    <div className="flex gap-3">
                      <button className="relative group bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-5 py-2.5 rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-105">
                        Comp Style
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Enhanced Tab Navigation - Only show when showTabNavigation is true */}
          {showTabNavigation && !isAnalytics && activeTab !== 'tournaments' && (
            <div className="flex items-center gap-8">
              {[
                { key: 'comps', label: 'Comps', icon: <Users className="w-4 h-4" /> },
                { key: 'items', label: 'Items', icon: <Zap className="w-4 h-4" /> },
                { key: 'augments', label: 'Augments', icon: <Star className="w-4 h-4" /> },
                { key: 'gauntlet', label: 'Gauntlet', icon: <Trophy className="w-4 h-4" /> }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => onTabChange(key as any)}
                  className={`relative group flex items-center gap-2 pb-4 font-bold text-lg transition-all duration-300 ${
                    activeTab === key
                      ? 'text-yellow-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`transition-all duration-300 ${activeTab === key ? 'text-yellow-400' : 'text-slate-500 group-hover:text-purple-400'}`}>
                    {icon}
                  </span>
                  {label}
                  {activeTab === key && (
                    <>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-yellow-500/50" />
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-sm opacity-50" />
                    </>
                  )}
                  {activeTab !== key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <UserProfile isOpen={showUserProfile} onClose={() => setShowUserProfile(false)} />
    </div>
  );
};

export default Header;