import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KeepCategory } from '../../types';
import { KeepRoomVision } from './KeepRoomVision';
import { ItemDetailModal } from './ItemDetailModal';
import { 
  Search, 
  Filter, 
  List, 
  LayoutGrid, 
  Sparkles, 
  Layers, 
  Eye, 
  Plus, 
  Tag, 
  Calendar,
  Compass,
  Scroll,
  Box,
  Volume2,
  Image as ImageIcon
} from 'lucide-react';

export const KeepRoom: React.FC = () => {
  const { 
    cards, 
    decks, 
    maps, 
    pieces, 
    campaigns, 
    keepView, 
    setKeepView, 
    keepCategory, 
    setKeepCategory,
    setSelectedDetailItem,
    openCardEditor,
    openNewMapFlow,
    openNewPieceFlow,
    openCampaignWorkbench
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const categories: Array<{ id: KeepCategory; label: string; count: number }> = [
    { id: 'All', label: 'All Artifacts', count: cards.length + decks.length + maps.length + pieces.length + campaigns.length },
    { id: 'Cards', label: 'Cards', count: cards.length },
    { id: 'Decks', label: 'Decks', count: decks.length },
    { id: 'Maps', label: 'Maps', count: maps.length },
    { id: 'Pieces', label: '3D Pieces', count: pieces.length },
    { id: 'Campaigns', label: 'Campaigns', count: campaigns.length },
    { id: 'Avatars', label: 'Avatars', count: pieces.filter(p => p.category === 'Avatars').length },
    { id: 'Items', label: 'Items & Weapons', count: cards.filter(c => c.category === 'Item').length + pieces.filter(p => p.category === 'Items').length },
    { id: 'Effects', label: 'Effects & Spells', count: cards.filter(c => c.category === 'Spell').length + pieces.filter(p => p.category === 'Effects').length },
    { id: 'Buildings', label: 'Buildings & Scenery', count: pieces.filter(p => p.category === 'Buildings').length },
    { id: 'Audio', label: 'Audio Tracks', count: 2 },
    { id: 'Renders', label: 'Renders & Screenshots', count: 4 },
  ];

  // Consolidated items list
  const allItems = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      type: 'card' | 'deck' | 'map' | 'piece' | 'campaign';
      category: string;
      updatedAt: string;
      tags: string[];
      thumbnail: string;
      raw: any;
    }> = [];

    cards.forEach((c) => {
      list.push({
        id: c.id,
        name: c.name,
        type: 'card',
        category: c.category,
        updatedAt: c.updatedAt,
        tags: c.tags,
        thumbnail: c.artUrl,
        raw: c,
      });
    });

    decks.forEach((d) => {
      list.push({
        id: d.id,
        name: d.name,
        type: 'deck',
        category: 'Deck',
        updatedAt: d.updatedAt,
        tags: d.tags,
        thumbnail: d.coverArt || cards[0]?.artUrl || '',
        raw: d,
      });
    });

    maps.forEach((m) => {
      list.push({
        id: m.id,
        name: m.name,
        type: 'map',
        category: m.engine,
        updatedAt: m.updatedAt,
        tags: m.tags,
        thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
        raw: m,
      });
    });

    pieces.forEach((p) => {
      list.push({
        id: p.id,
        name: p.name,
        type: 'piece',
        category: p.category,
        updatedAt: p.updatedAt,
        tags: p.tags,
        thumbnail: p.sourceImage,
        raw: p,
      });
    });

    campaigns.forEach((camp) => {
      list.push({
        id: camp.id,
        name: camp.name,
        type: 'campaign',
        category: 'Campaign',
        updatedAt: camp.updatedAt,
        tags: camp.tags,
        thumbnail: camp.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
        raw: camp,
      });
    });

    return list;
  }, [cards, decks, maps, pieces, campaigns]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((i) => i.tags?.forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 12);
  }, [allItems]);

  // Filtering
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Category match
      if (keepCategory === 'Cards' && item.type !== 'card') return false;
      if (keepCategory === 'Decks' && item.type !== 'deck') return false;
      if (keepCategory === 'Maps' && item.type !== 'map') return false;
      if (keepCategory === 'Pieces' && item.type !== 'piece') return false;
      if (keepCategory === 'Campaigns' && item.type !== 'campaign') return false;
      if (keepCategory === 'Avatars' && item.category !== 'Avatars') return false;
      if (keepCategory === 'Items' && item.category !== 'Item' && item.category !== 'Items') return false;
      if (keepCategory === 'Effects' && item.category !== 'Spell' && item.category !== 'Effects') return false;
      if (keepCategory === 'Buildings' && item.category !== 'Buildings') return false;
      if (keepCategory === 'Audio' && item.type !== 'card') return false; // mock filter
      if (keepCategory === 'Renders' && item.type !== 'piece') return false;

      // Tag match
      if (selectedTag !== 'all' && !item.tags.includes(selectedTag)) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTags) return false;
      }

      return true;
    });
  }, [allItems, keepCategory, selectedTag, searchQuery]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <ItemDetailModal />

      {/* Keep Top Header & View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-bold text-zinc-100">The Keep</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono-code">
              {allItems.length} Assets
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Your master catalog of tabletop cards, 3D miniatures, tactical battlemaps, and campaigns.
          </p>
        </div>

        {/* View Switcher: LIST vs THE ROOM */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
          <button
            onClick={() => setKeepView('list')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              keepView === 'list'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>VIEW A — LIST</span>
          </button>
          <button
            onClick={() => setKeepView('room')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              keepView === 'room'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>VIEW B — THE ROOM</span>
          </button>
        </div>
      </div>

      {keepView === 'room' ? (
        /* View B: The Walkable Room */
        <KeepRoomVision />
      ) : (
        /* View A: The List View with Sidebar & Grid */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-mono-code font-semibold tracking-wider text-zinc-500 uppercase">
              CATEGORIES
            </div>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setKeepCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  keepCategory === cat.id
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono-code px-1.5 py-0.2 rounded ${
                  keepCategory === cat.id ? 'bg-amber-500/30 text-amber-200' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search and Filters Bar */}
            <div className="rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-3.5 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or keywords..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700/70 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="text-xs text-zinc-500 font-mono-code shrink-0">
                    Showing {filteredItems.length}
                  </span>
                </div>
              </div>

              {/* Tag Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-mono-code text-zinc-500 mr-1 flex items-center">
                  <Tag className="w-3 h-3 mr-1" /> Filter:
                </span>
                <button
                  onClick={() => setSelectedTag('all')}
                  className={`px-2.5 py-0.5 rounded-lg font-mono-code text-[11px] transition-colors shrink-0 ${
                    selectedTag === 'all'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  All Tags
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
                    className={`px-2.5 py-0.5 rounded-lg font-mono-code text-[11px] transition-colors shrink-0 ${
                      selectedTag === tag
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Items */}
            {filteredItems.length === 0 ? (
              <div className="rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-12 text-center text-zinc-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                <p className="text-sm font-semibold text-zinc-400">No items match your query</p>
                <p className="text-xs mt-1">Try resetting the tag filter or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDetailItem({ type: item.type, item: item.raw })}
                    className="group cursor-pointer rounded-xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800/80 hover:border-amber-500/50 p-3.5 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 shadow-md hover:shadow-xl"
                  >
                    <div>
                      {/* Card Thumbnail */}
                      <div className="w-full h-36 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 relative mb-3">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700">
                            <Layers className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-zinc-700 text-[10px] font-mono-code text-zinc-300 uppercase">
                          {item.type}
                        </div>
                      </div>

                      {/* Info */}
                      <h3 className="font-display text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors truncate">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500 font-mono-code mt-0.5">
                        {item.category} • {item.updatedAt}
                      </p>
                    </div>

                    {/* Tags footer */}
                    <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
