import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Layers, 
  Compass, 
  Eye, 
  HelpCircle, 
  Package, 
  Info,
  ExternalLink,
  Table,
  BookOpen
} from 'lucide-react';

export const KeepRoomVision: React.FC = () => {
  const { 
    cards, 
    maps, 
    pieces, 
    setSelectedDetailItem,
    openCardEditor,
    openMapEditor,
    openPieceViewer,
    openCampaignPlay
  } = useApp();

  const [activeSpot, setActiveSpot] = useState<{
    title: string;
    description: string;
    type: 'shelf' | 'table' | 'case';
    actionText: string;
    onAction: () => void;
  } | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Aspirational Coming Soon Header */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#18181c] to-blue-950/30 border border-amber-500/30 p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-zinc-100 text-base">
                The Keep Sanctuary — Interactive Top-Down Sanctum
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Aspirational Preview
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              "Your library, walkable." Click any shelf, display case, or center table to interact with physical artifacts.
            </p>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono-code px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
          Spatial VTT Mode: <span className="text-amber-400 font-semibold">Alpha Blueprint</span>
        </div>
      </div>

      {/* Interactive Blueprint Floor Plan */}
      <div className="relative w-full aspect-[16/10] max-h-[640px] rounded-2xl bg-[#0d0d0f] border-2 border-zinc-800 shadow-2xl overflow-hidden p-6 select-none flex flex-col justify-between">
        {/* Subtle blueprint grid background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px), radial-gradient(#3b82f6 1px, #0d0d0f 1px)',
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0, 16px 16px'
          }} 
        />

        {/* Ambient Room Lighting Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,rgba(0,0,0,0.7)_80%)] pointer-events-none" />

        {/* TOP WALL: Archival Tome Shelves */}
        <div className="relative z-10 w-full flex justify-between gap-4">
          <div 
            onClick={() => {
              setActiveSpot({
                title: 'North Shelf: Card Spellbook Stacks',
                description: `Contains ${cards.length} forged cards including "${cards[0]?.name}" and "${cards[4]?.name}".`,
                type: 'shelf',
                actionText: 'Browse Card Grimoire',
                onAction: () => setSelectedDetailItem({ type: 'card', item: cards[0] })
              });
            }}
            className="flex-1 h-14 rounded-xl bg-[#18181c] border border-amber-500/40 hover:border-amber-400 p-2 flex items-center justify-between cursor-pointer group transition-all hover:bg-zinc-800/80 shadow-md"
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Grimoire Shelves</span>
                <span className="text-[10px] text-zinc-500 font-mono-code">{cards.length} Cards Stored</span>
              </div>
            </div>
            <div className="flex space-x-1">
              {cards.slice(0, 4).map((c, i) => (
                <div key={i} className="w-3 h-8 rounded-xs bg-amber-500/30 border border-amber-400/40 group-hover:scale-105 transition-transform" />
              ))}
            </div>
          </div>

          {/* Golden Pedestal Display Case */}
          <div 
            onClick={() => {
              setActiveSpot({
                title: 'Sanctum Pedestal: The Rune Axe',
                description: 'An ancient dwarven relic illuminated beneath crystal glass. Forged in Mount Kaldor.',
                type: 'case',
                actionText: 'Inspect Relic in 3D',
                onAction: () => openPieceViewer('piece-1')
              });
            }}
            className="w-48 h-14 rounded-xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-amber-500/10 border-2 border-amber-400 hover:border-amber-300 p-2 flex items-center space-x-3 cursor-pointer group transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ★
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 block truncate">The Rune Axe</span>
              <span className="text-[10px] text-zinc-400 font-mono-code">Artifact Display</span>
            </div>
          </div>

          <div 
            onClick={() => {
              setActiveSpot({
                title: 'Northeast Shelf: Map Cartography Scrolls',
                description: `Houses tactical parchment scrolls: ${maps.map(m => m.name).slice(0, 3).join(', ')}...`,
                type: 'shelf',
                actionText: 'Unroll Tactical Maps',
                onAction: () => openMapEditor(maps[0]?.id)
              });
            }}
            className="flex-1 h-14 rounded-xl bg-[#18181c] border border-blue-500/40 hover:border-blue-400 p-2 flex items-center justify-between cursor-pointer group transition-all hover:bg-zinc-800/80 shadow-md"
          >
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Scroll Vault</span>
                <span className="text-[10px] text-zinc-500 font-mono-code">{maps.length} Battlemaps</span>
              </div>
            </div>
            <div className="flex space-x-1">
              {maps.slice(0, 3).map((m, i) => (
                <div key={i} className="w-3 h-8 rounded-xs bg-blue-500/30 border border-blue-400/40 group-hover:scale-105 transition-transform" />
              ))}
            </div>
          </div>
        </div>

        {/* CENTER ROOM: The Tables (Card Table and Map Game Table) */}
        <div className="relative z-10 flex-1 my-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Table A: Card Game Table */}
          <div 
            onClick={() => {
              setActiveSpot({
                title: 'Table 1: Card Gaming Table',
                description: 'Currently laid out with the Dragonfire Duel deck versus Shadowstalker Aggro. Playmat active with mana gems.',
                type: 'table',
                actionText: 'Open Creation Station Deck',
                onAction: () => openCardEditor('card-1')
              });
            }}
            className="w-64 h-48 rounded-3xl bg-[#1c1c20] border-2 border-amber-500/50 hover:border-amber-400 p-4 flex flex-col justify-between cursor-pointer group transition-all hover:scale-[1.02] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-code text-amber-400 uppercase font-semibold">
                Playing Surface 01
              </span>
              <Table className="w-4 h-4 text-amber-400" />
            </div>

            {/* Visual Mini Playmat */}
            <div className="my-2 p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center space-x-2">
              <div className="w-8 h-12 rounded bg-amber-500/20 border border-amber-400/60 shadow-sm transform -rotate-6" />
              <div className="w-8 h-12 rounded bg-blue-500/20 border border-blue-400/60 shadow-sm" />
              <div className="w-8 h-12 rounded bg-rose-500/20 border border-rose-400/60 shadow-sm transform rotate-6" />
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-100 block">Card Game Table</span>
              <span className="text-[10px] text-zinc-400">Match: Dragonfire Duel</span>
            </div>
          </div>

          {/* Table B: Map Game Table */}
          <div 
            onClick={() => {
              setActiveSpot({
                title: 'Table 2: Tactical Battlemap Table',
                description: 'Encounter active: Tavern of the Broken Wheel with placed tokens, miniature sentries, and tactical grid lines.',
                type: 'table',
                actionText: 'Enter Tabletop Play Session',
                onAction: () => openCampaignPlay('camp-1')
              });
            }}
            className="w-72 h-48 rounded-3xl bg-[#1c1c20] border-2 border-blue-500/50 hover:border-blue-400 p-4 flex flex-col justify-between cursor-pointer group transition-all hover:scale-[1.02] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-code text-blue-400 uppercase font-semibold">
                Playing Surface 02
              </span>
              <Compass className="w-4 h-4 text-blue-400" />
            </div>

            {/* Visual Mini Grid Surface */}
            <div className="my-2 p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 grid grid-cols-6 grid-rows-3 gap-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-3 rounded-xs border border-zinc-800 ${
                    i === 7 ? 'bg-amber-400/60' : i === 10 ? 'bg-blue-400/60' : 'bg-zinc-900'
                  }`} 
                />
              ))}
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-100 block">Tactical Map Table</span>
              <span className="text-[10px] text-zinc-400">Active: Tavern Encounter</span>
            </div>
          </div>
        </div>

        {/* BOTTOM WALL: 3D Miniatures Display Cabinet */}
        <div className="relative z-10 w-full flex items-center justify-between gap-4">
          <div 
            onClick={() => {
              setActiveSpot({
                title: 'South Wall: 3D Miniature Resin Shelves',
                description: `Houses painted miniatures including Gargoyle Sentry, Mimic Chest, and Ironclad Paladin.`,
                type: 'shelf',
                actionText: 'Open 3D Master Crafter',
                onAction: () => openPieceViewer('piece-2')
              });
            }}
            className="w-full h-14 rounded-xl bg-[#18181c] border border-emerald-500/40 hover:border-emerald-400 p-2 flex items-center justify-between cursor-pointer group transition-all hover:bg-zinc-800/80 shadow-md"
          >
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Miniature Gallery Shelves</span>
                <span className="text-[10px] text-zinc-500 font-mono-code">{pieces.length} 3D Pieces Ready for 3D Print / VTT</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {pieces.slice(0, 4).map((p, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-[10px] font-mono-code text-emerald-300">
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-[10px] text-zinc-400 hidden sm:inline">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Hotspot Drawer Banner */}
        {activeSpot && (
          <div className="absolute inset-x-6 bottom-6 z-20 rounded-xl bg-[#1f1f24] border-2 border-amber-400 shadow-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-150">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-300">{activeSpot.title}</span>
                <span className="text-[10px] font-mono-code uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {activeSpot.type}
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1 max-w-xl">{activeSpot.description}</p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setActiveSpot(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  activeSpot.onAction();
                  setActiveSpot(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors flex items-center space-x-1 shadow-md shadow-amber-500/20"
              >
                <span>{activeSpot.actionText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
