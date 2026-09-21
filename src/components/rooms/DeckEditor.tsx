import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DeckItem, CardItem, CardCategory } from '../../types';
import { CardRender } from '../CardRender';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  BarChart2, 
  PieChart, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react';

export const DeckEditor: React.FC = () => {
  const { 
    editingDeckId, 
    setCreationMode, 
    cards, 
    decks, 
    saveDeck, 
    showToast 
  } = useApp();

  const existingDeck = decks.find((d) => d.id === editingDeckId);

  const [deckName, setDeckName] = useState(existingDeck?.name || 'New Custom Encounter Deck');
  const [deckDescription, setDeckDescription] = useState(
    existingDeck?.description || 'Curated deck for tactical tabletop skirmishes.'
  );
  const [deckFormat, setDeckFormat] = useState<'Standard' | 'Commander' | 'Dungeon Crawl'>(
    existingDeck?.format || 'Standard'
  );
  const [deckCardIds, setDeckCardIds] = useState<string[]>(existingDeck?.cardIds || [cards[0]?.id, cards[1]?.id].filter(Boolean));
  const [libraryCategory, setLibraryCategory] = useState<string>('All');
  const [searchLibrary, setSearchLibrary] = useState('');

  // Add card to deck
  const addCardToDeck = (cardId: string) => {
    setDeckCardIds((prev) => [...prev, cardId]);
    showToast('Added card to deck');
  };

  // Remove single instance of card from deck
  const removeCardFromDeck = (cardId: string) => {
    setDeckCardIds((prev) => {
      const idx = prev.lastIndexOf(cardId);
      if (idx >= 0) {
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      }
      return prev;
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDropOnDeck = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      addCardToDeck(cardId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Filter library cards
  const filteredLibrary = useMemo(() => {
    return cards.filter((c) => {
      if (libraryCategory !== 'All' && c.category !== libraryCategory) return false;
      if (searchLibrary.trim()) {
        const q = searchLibrary.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.keywords.some((k) => k.toLowerCase().includes(q))) {
          return false;
        }
      }
      return true;
    });
  }, [cards, libraryCategory, searchLibrary]);

  // Deck breakdown calculations
  const deckCardObjects = useMemo(() => {
    return deckCardIds.map((id) => cards.find((c) => c.id === id)).filter(Boolean) as CardItem[];
  }, [deckCardIds, cards]);

  // Mana curve: 0-1, 2, 3, 4, 5, 6+
  const manaCurve = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0, 0, 0]; // 0, 1, 2, 3, 4, 5, 6+
    deckCardObjects.forEach((c) => {
      const cost = Math.min(c.cost, 6);
      buckets[cost] += 1;
    });
    return buckets;
  }, [deckCardObjects]);

  const maxManaCount = Math.max(...manaCurve, 1);

  // Category breakdown
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    deckCardObjects.forEach((c) => {
      map[c.category] = (map[c.category] || 0) + 1;
    });
    return map;
  }, [deckCardObjects]);

  // Unique cards grouped with counts for the right list
  const groupedDeckCards = useMemo(() => {
    const map = new Map<string, { card: CardItem; count: number }>();
    deckCardIds.forEach((id) => {
      const card = cards.find((c) => c.id === id);
      if (!card) return;
      if (map.has(id)) {
        map.get(id)!.count += 1;
      } else {
        map.set(id, { card, count: 1 });
      }
    });
    return Array.from(map.values());
  }, [deckCardIds, cards]);

  const handleSaveDeck = () => {
    if (!deckName.trim()) {
      showToast('Please enter a deck name.');
      return;
    }
    const saved: DeckItem = {
      id: existingDeck?.id || `deck-${Date.now()}`,
      name: deckName,
      description: deckDescription,
      format: deckFormat,
      cardIds: deckCardIds,
      updatedAt: new Date().toISOString().split('T')[0],
      tags: [deckFormat, `${deckCardIds.length} Cards`],
      coverArt: deckCardObjects[0]?.artUrl,
    };
    saveDeck(saved);
    setCreationMode('home');
  };

  const categories = ['All', 'Actor', 'Monster', 'Trap', 'Spell', 'Item', 'Location', 'Event'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCreationMode('home')}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-xl text-zinc-100">{deckName || 'New Deck'}</span>
              <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                Deck Editor
              </span>
            </div>
            <p className="text-xs text-zinc-400">Assemble card archetypes with drag-and-drop & curve analytics</p>
          </div>
        </div>

        <button
          onClick={handleSaveDeck}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-amber-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save to Keep</span>
        </button>
      </div>

      {/* Main Split: Left Card Library, Right Deck Being Built */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Card Library Grid (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-sm text-zinc-200">Card Library</h2>
              <p className="text-[11px] text-zinc-500">Drag a card or click "+ Add" to include in deck</p>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLibrary}
                onChange={(e) => setSearchLibrary(e.target.value)}
                placeholder="Search library..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setLibraryCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-code transition-colors shrink-0 ${
                  libraryCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Library Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredLibrary.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => handleDragStart(e, card.id)}
                className="group relative rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/60 p-2 flex flex-col justify-between transition-all hover:scale-[1.02] cursor-grab active:cursor-grabbing shadow-md"
              >
                <div>
                  <div className="w-full h-24 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 relative mb-2">
                    <img
                      src={card.artUrl}
                      alt={card.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono-code text-amber-400 font-bold">
                      {card.cost} Mana
                    </div>
                  </div>
                  <h4 className="font-display text-xs font-bold text-zinc-100 truncate">{card.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono-code">{card.category} • {card.rarity}</p>
                </div>

                <button
                  type="button"
                  onClick={() => addCardToDeck(card.id)}
                  className="mt-2 w-full py-1 rounded bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 font-semibold text-[11px] transition-colors flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add to Deck</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: The Deck Being Built & Stats (5 cols) */}
        <div 
          onDrop={handleDropOnDeck}
          onDragOver={handleDragOver}
          className="lg:col-span-5 space-y-4"
        >
          {/* Deck Configuration & Metadata */}
          <div className="rounded-2xl bg-[#1a1a1c] border-2 border-dashed border-zinc-700 hover:border-amber-500/50 p-5 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-mono-code text-amber-400 font-semibold uppercase">
                DECK MANIFEST • {deckCardIds.length} CARDS
              </span>
              <span className="text-[11px] text-zinc-500 font-mono-code">Drop zone active</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Deck Title</label>
                <input
                  type="text"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Format</label>
                  <select
                    value={deckFormat}
                    onChange={(e) => setDeckFormat(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                  >
                    <option value="Standard">Standard (40-60)</option>
                    <option value="Commander">Commander (100)</option>
                    <option value="Dungeon Crawl">Dungeon Crawl</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Total Cards</label>
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-code text-amber-400 font-bold">
                    {deckCardIds.length} / 40 Recommended
                  </div>
                </div>
              </div>
            </div>

            {/* Deck Stats: Mana Curve Histogram & Category Breakdown */}
            <div className="pt-3 border-t border-zinc-800 space-y-3">
              <div>
                <span className="text-[11px] font-mono-code text-zinc-400 block mb-1.5 flex items-center">
                  <BarChart2 className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  Mana Cost Curve
                </span>
                <div className="flex items-end space-x-2 h-16 pt-2 px-2 bg-zinc-900/90 rounded-lg border border-zinc-800">
                  {manaCurve.map((count, cost) => {
                    const heightPercent = maxManaCount > 0 ? (count / maxManaCount) * 100 : 0;
                    return (
                      <div key={cost} className="flex-1 flex flex-col items-center h-full justify-end">
                        <span className="text-[9px] font-mono-code text-amber-300 font-bold">{count > 0 ? count : ''}</span>
                        <div
                          style={{ height: `${Math.max(heightPercent, 6)}%` }}
                          className={`w-full rounded-t transition-all ${
                            count > 0 ? 'bg-amber-500/80 border-t border-amber-300' : 'bg-zinc-800'
                          }`}
                        />
                        <span className="text-[9px] font-mono-code text-zinc-500 mt-1">
                          {cost === 6 ? '6+' : cost}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <span className="text-[11px] font-mono-code text-zinc-400 block mb-1.5 flex items-center">
                  <PieChart className="w-3.5 h-3.5 mr-1 text-blue-400" />
                  Archetype Distribution
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(categoryCounts).map(([cat, cnt]) => (
                    <span
                      key={cat}
                      className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center space-x-1"
                    >
                      <span className="text-zinc-400">{cat}:</span>
                      <strong className="text-amber-400">{cnt}</strong>
                      <span className="text-zinc-500">({Math.round((cnt / (deckCardIds.length || 1)) * 100)}%)</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Deck Card List */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <span className="text-xs text-zinc-400 font-semibold block">Included Cards</span>

              {groupedDeckCards.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs rounded-xl bg-zinc-900/60 border border-zinc-800">
                  Drag cards here from the left library to build your deck.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {groupedDeckCards.map(({ card, count }) => (
                    <div
                      key={card.id}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 font-mono-code font-bold flex items-center justify-center text-[10px] shrink-0">
                          {card.cost}
                        </span>
                        <div className="truncate">
                          <span className="font-semibold text-zinc-200 block truncate">{card.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono-code">{card.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => removeCardFromDeck(card.id)}
                          className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono-code font-bold text-amber-400 text-xs">
                          {count}
                        </span>
                        <button
                          type="button"
                          onClick={() => addCardToDeck(card.id)}
                          className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
