import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Compass, 
  Scroll, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar, 
  Award, 
  Activity, 
  Hammer, 
  ExternalLink,
  ArrowUpRight,
  Shield,
  Box,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { USER_PROFILE } from '../../data/mockData';
import { CardRender } from '../CardRender';

export const ProfileRoom: React.FC = () => {
  const { 
    cards, 
    maps, 
    pieces, 
    campaigns, 
    setRoom, 
    openCardEditor, 
    openMapEditor, 
    openPieceViewer, 
    openCampaignDetail,
    setSelectedDetailItem
  } = useApp();

  const [carouselIndex, setCarouselIndex] = useState(0);

  // Consolidate recent creations across cards, maps, pieces, campaigns
  const recentCreations = [
    { type: 'card', title: cards[0]?.name || 'Card', subtitle: 'Tabletop Card', date: cards[0]?.updatedAt, item: cards[0] },
    { type: 'map', title: maps[0]?.name || 'Map', subtitle: `${maps[0]?.engine} Engine Map`, date: maps[0]?.updatedAt, item: maps[0] },
    { type: 'piece', title: pieces[0]?.name || 'Piece', subtitle: '3D Miniature Print', date: pieces[0]?.updatedAt, item: pieces[0] },
    { type: 'campaign', title: campaigns[0]?.name || 'Campaign', subtitle: 'Tactical Campaign', date: campaigns[0]?.updatedAt, item: campaigns[0] },
    { type: 'card', title: cards[1]?.name || 'Card', subtitle: 'Monster Actor', date: cards[1]?.updatedAt, item: cards[1] },
    { type: 'map', title: maps[1]?.name || 'Map', subtitle: 'Dungeon Encounter', date: maps[1]?.updatedAt, item: maps[1] },
  ];

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % recentCreations.length);
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + recentCreations.length) % recentCreations.length);
  };

  const handleCreationClick = (creation: typeof recentCreations[0]) => {
    if (creation.type === 'card') {
      openCardEditor(creation.item.id);
    } else if (creation.type === 'map') {
      openMapEditor(creation.item.id);
    } else if (creation.type === 'piece') {
      openPieceViewer(creation.item.id);
    } else if (creation.type === 'campaign') {
      openCampaignDetail(creation.item.id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* User Banner Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1a1a1e] via-[#161619] to-[#121214] border border-zinc-800/80 p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Identity */}
          <div className="flex items-center space-x-5">
            <div className="relative group">
              <img
                src={USER_PROFILE.avatarUrl}
                alt={USER_PROFILE.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-zinc-900 border border-amber-500/40 text-amber-400">
                <Hammer className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight">
                  {USER_PROFILE.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-code bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  GM Tier 3
                </span>
              </div>
              <p className="text-zinc-400 text-sm mt-0.5">{USER_PROFILE.title}</p>
              
              <div className="flex items-center space-x-4 mt-2.5 text-xs text-zinc-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{USER_PROFILE.joinedDate}</span>
                </div>
                <div className="flex items-center space-x-1 font-mono-code text-zinc-400">
                  <span>{USER_PROFILE.handle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 shrink-0 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
            <div className="text-center px-2">
              <span className="block text-2xl md:text-3xl font-bold font-mono-code text-amber-400">
                {cards.length + maps.length + pieces.length + campaigns.length}
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">Things Made</span>
            </div>
            <div className="text-center px-2 border-x border-zinc-800">
              <span className="block text-2xl md:text-3xl font-bold font-mono-code text-blue-400">
                {USER_PROFILE.stats.thingsPlayed}
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">Things Played</span>
            </div>
            <div className="text-center px-2">
              <span className="block text-2xl md:text-3xl font-bold font-mono-code text-emerald-400">
                {USER_PROFILE.stats.thingsInProgress}
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">In Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Four Big Tiles linking to the four working rooms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-zinc-200 flex items-center space-x-2">
            <span>Primary Creation Studios</span>
          </h2>
          <span className="text-xs text-zinc-500 font-mono-code">Select a workspace</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tile 1: Creation Station */}
          <div
            onClick={() => setRoom('creation')}
            className="group cursor-pointer rounded-2xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800 hover:border-amber-500/50 p-5 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-amber-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-amber-400 transition-colors" />
              </div>
              <span className="text-[10px] font-mono-code text-orange-400 uppercase tracking-wider font-semibold">
                Room 03 • Workbench
              </span>
              <h3 className="font-display text-lg font-bold text-zinc-100 mt-1 group-hover:text-amber-300 transition-colors">
                Creation Station
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Forge custom tabletop cards with AI assisted rules, attributes, and assemble synergy decks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono-code">{cards.length} Cards • {cards.length > 0 ? '5 Decks' : ''}</span>
              <span className="text-amber-400 group-hover:underline">Open Foundry →</span>
            </div>
          </div>

          {/* Tile 2: The Keep */}
          <div
            onClick={() => setRoom('keep')}
            className="group cursor-pointer rounded-2xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800 hover:border-amber-500/50 p-5 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-amber-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-amber-400 transition-colors" />
              </div>
              <span className="text-[10px] font-mono-code text-amber-400 uppercase tracking-wider font-semibold">
                Room 02 • Library
              </span>
              <h3 className="font-display text-lg font-bold text-zinc-100 mt-1 group-hover:text-amber-300 transition-colors">
                The Keep
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Search, inspect, and organize all cards, 3D pieces, maps, audio, and renders in your vault.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono-code">Dual View Available</span>
              <span className="text-amber-400 group-hover:underline">Enter Vault →</span>
            </div>
          </div>

          {/* Tile 3: Realm Crafter */}
          <div
            onClick={() => setRoom('realm')}
            className="group cursor-pointer rounded-2xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800 hover:border-blue-500/50 p-5 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <span className="text-[10px] font-mono-code text-blue-400 uppercase tracking-wider font-semibold">
                Room 04 • Maps & 3D
              </span>
              <h3 className="font-display text-lg font-bold text-zinc-100 mt-1 group-hover:text-blue-300 transition-colors">
                Realm Crafter
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Design grid battlemaps with Mipui/Godot/Unreal, and synthesize 3D miniatures from 2D images.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono-code">Runner & Crafter</span>
              <span className="text-blue-400 group-hover:underline">Enter Studio →</span>
            </div>
          </div>

          {/* Tile 4: Campaign Command */}
          <div
            onClick={() => setRoom('campaign')}
            className="group cursor-pointer rounded-2xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800 hover:border-emerald-500/50 p-5 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Scroll className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <span className="text-[10px] font-mono-code text-emerald-400 uppercase tracking-wider font-semibold">
                Room 05 • Orchestrator
              </span>
              <h3 className="font-display text-lg font-bold text-zinc-100 mt-1 group-hover:text-emerald-300 transition-colors">
                Campaign Command
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Weave battlemaps, actors, item cards, and tokens into chapters, with live play table preview.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono-code">{campaigns.length} Active Campaigns</span>
              <span className="text-emerald-400 group-hover:underline">Open Command →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Carousel Showing Recent Creations */}
      <div className="rounded-2xl bg-[#161619] border border-zinc-800/90 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-lg text-zinc-100">Recent Creations Carousel</h2>
            <p className="text-xs text-zinc-400">Cards, battlemaps, 3D miniatures, and campaigns from your forge</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevCarousel}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono-code text-zinc-400 px-2">
              {carouselIndex + 1} / {recentCreations.length}
            </span>
            <button
              onClick={nextCarousel}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Card Spotlight */}
          <div className="flex justify-center md:col-span-1">
            {cards[0] && (
              <div className="transform hover:scale-105 transition-transform duration-200">
                <CardRender 
                  card={cards[carouselIndex % cards.length]} 
                  scale="md" 
                  interactive={true} 
                  onClick={() => openCardEditor(cards[carouselIndex % cards.length].id)}
                />
              </div>
            )}
          </div>

          {/* Quick Details & Action Panel */}
          <div className="md:col-span-2 space-y-4">
            <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono-code uppercase font-semibold">
                <span>Featured Forge Asset</span>
                <span>•</span>
                <span>{recentCreations[carouselIndex]?.type}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-zinc-100 mt-1">
                {recentCreations[carouselIndex]?.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {recentCreations[carouselIndex]?.subtitle}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono-code">
                <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Updated: {recentCreations[carouselIndex]?.date}
                </span>
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Ready for tabletop play
                </span>
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Sync: Cloud & VTT
                </span>
              </div>

              <div className="mt-5 flex items-center space-x-3">
                <button
                  onClick={() => handleCreationClick(recentCreations[carouselIndex])}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center space-x-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Edit in Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setRoom('keep')}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors border border-zinc-700"
                >
                  View in The Keep
                </button>
              </div>
            </div>

            {/* Quick Strip of other recent items */}
            <div className="grid grid-cols-3 gap-3">
              {recentCreations.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    carouselIndex === idx 
                      ? 'bg-zinc-800 border-amber-500/50 text-zinc-100' 
                      : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/50'
                  }`}
                >
                  <p className="text-[10px] font-mono-code uppercase text-zinc-500 truncate">{item.type}</p>
                  <p className="text-xs font-semibold truncate mt-0.5">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
