import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CardEditor } from './CardEditor';
import { DeckEditor } from './DeckEditor';
import { CardRender } from '../CardRender';
import { 
  Sparkles, 
  Layers, 
  Plus, 
  Layers2, 
  ArrowUpRight, 
  Tag, 
  Calendar, 
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { CardCategory } from '../../types';

export const CreationStationRoom: React.FC = () => {
  const { 
    creationMode, 
    setCreationMode, 
    cards, 
    decks, 
    openCardEditor, 
    openDeckEditor 
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const cardCategories: CardCategory[] = ['Actor', 'Monster', 'Trap', 'Spell', 'Item', 'Location', 'Event'];

  if (creationMode === 'card-editor') {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <CardEditor />
      </div>
    );
  }

  if (creationMode === 'deck-editor') {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <DeckEditor />
      </div>
    );
  }

  // Filter cards by category
  const filteredCards = cards.filter((c) => {
    if (activeCategoryFilter !== 'All' && c.category !== activeCategoryFilter) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1c1a16] via-[#1a1a1c] to-[#141418] border border-orange-500/20 p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-orange-400 text-xs font-mono-code uppercase font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Room 03 • The Workbench</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-zinc-100 mt-1">
            Creation Station
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Where cards and decks are made. Generate rules text with AI, forge custom attribute stats, synthesize illustrations, and test card curves.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono-code text-xs text-zinc-400 bg-zinc-900/90 px-3 py-2 rounded-xl border border-zinc-800">
          <span>Neural Engine:</span>
          <span className="text-emerald-400 font-semibold">Active & Online</span>
        </div>
      </div>

      {/* TWO BIG BUTTONS: New Card and New Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Big Button 1: New Card */}
        <button
          onClick={() => openCardEditor()}
          className="group text-left p-6 md:p-7 rounded-2xl bg-gradient-to-br from-[#201c18] via-[#1a1a1c] to-[#141416] border-2 border-orange-500/30 hover:border-orange-400 p-6 transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-orange-500/10 flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-orange-400 uppercase font-semibold">
                Single Card Crafting
              </span>
              <h3 className="font-display text-xl font-bold text-zinc-100 group-hover:text-orange-300 transition-colors">
                New Card
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Design a card face with rarity borders, AI rules text, and custom attributes.
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-orange-500 group-hover:text-zinc-950 text-zinc-300 flex items-center justify-center transition-colors shrink-0 ml-4">
            <Plus className="w-5 h-5" />
          </div>
        </button>

        {/* Big Button 2: New Deck */}
        <button
          onClick={() => openDeckEditor()}
          className="group text-left p-6 md:p-7 rounded-2xl bg-gradient-to-br from-[#181c22] via-[#1a1a1c] to-[#141416] border-2 border-blue-500/30 hover:border-blue-400 p-6 transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10 flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-blue-400 uppercase font-semibold">
                Archetype Synergy
              </span>
              <h3 className="font-display text-xl font-bold text-zinc-100 group-hover:text-blue-300 transition-colors">
                New Deck
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Assemble cards into 40-60 card decks with real-time mana curves & breakdowns.
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-blue-500 group-hover:text-zinc-950 text-zinc-300 flex items-center justify-center transition-colors shrink-0 ml-4">
            <Plus className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Main Area: Left Sidebar with Card Categories & Right Recent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar: Card Categories */}
        <div className="lg:col-span-1 rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-mono-code font-semibold tracking-wider text-zinc-500 uppercase">
            CARD CATEGORIES
          </div>

          <button
            onClick={() => setActiveCategoryFilter('All')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
              activeCategoryFilter === 'All'
                ? 'bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] font-mono-code text-zinc-500">{cards.length}</span>
          </button>

          {cardCategories.map((cat) => {
            const count = cards.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  activeCategoryFilter === cat
                    ? 'bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] font-mono-code text-zinc-500">{count}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-3 border-t border-zinc-800/80">
            <div className="px-3 py-1 text-[11px] font-mono-code text-zinc-500 uppercase">
              DECK FORMATS
            </div>
            <div className="space-y-1 mt-1 text-xs text-zinc-400 px-3">
              <div className="flex justify-between py-1">
                <span>Standard</span>
                <span className="font-mono-code text-amber-400">{decks.length}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Dungeon Crawl</span>
                <span className="font-mono-code text-zinc-500">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Recent Cards & Decks in a Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Recent Decks Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-base text-zinc-100 flex items-center space-x-2">
                <span>Recent Decks</span>
                <span className="text-xs text-zinc-500 font-normal">({decks.length})</span>
              </h2>
              <button
                onClick={() => openDeckEditor()}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                + New Deck
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {decks.map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => openDeckEditor(deck.id)}
                  className="group cursor-pointer rounded-xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800 hover:border-blue-500/50 p-4 transition-all duration-200 flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-blue-400 mb-1">
                      <span>{deck.format}</span>
                      <span>{deck.cardIds.length} Cards</span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-zinc-100 group-hover:text-blue-300 transition-colors truncate">
                      {deck.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {deck.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{deck.updatedAt}</span>
                    <span className="text-amber-400 group-hover:underline">Open Deck →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Cards Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-base text-zinc-100 flex items-center space-x-2">
                <span>Recent Cards</span>
                <span className="text-xs text-zinc-500 font-normal">
                  ({filteredCards.length} {activeCategoryFilter !== 'All' ? activeCategoryFilter : ''})
                </span>
              </h2>
              <button
                onClick={() => openCardEditor()}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
              >
                + New Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => openCardEditor(card.id)}
                  className="group cursor-pointer rounded-xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800 hover:border-orange-500/50 p-3 transition-all duration-200 flex flex-col justify-between shadow-md"
                >
                  <div className="flex justify-center mb-2">
                    <CardRender card={card} scale="sm" interactive={false} />
                  </div>
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-mono-code text-amber-400">{card.cost} Mana</span>
                    <span className="group-hover:text-orange-300 transition-colors">Edit Card →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
