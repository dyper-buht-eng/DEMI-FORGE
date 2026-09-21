import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CardItem, CardCategory, CardRarity, CardAttribute } from '../../types';
import { CardRender } from '../CardRender';
import { 
  Sparkles, 
  Save, 
  ArrowLeft, 
  Wand2, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const CardEditor: React.FC = () => {
  const { 
    editingCardId, 
    setCreationMode, 
    cards, 
    saveCard, 
    showToast,
    aiStatus
  } = useApp();

  const existingCard = cards.find((c) => c.id === editingCardId);

  const [formData, setFormData] = useState<CardItem>(() => {
    if (existingCard) return { ...existingCard };
    return {
      id: `card-${Date.now()}`,
      name: '',
      subtitle: '',
      cost: 3,
      category: 'Spell',
      rarity: 'Rare',
      keywords: [],
      rulesText: '',
      flavorText: '',
      attributes: [
        { id: '1', label: 'Damage', value: '3d6 Fire' },
        { id: '2', label: 'Range', value: '60 ft' }
      ],
      artUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      artStyle: 'Chiaroscuro Dark Fantasy',
      updatedAt: new Date().toISOString().split('T')[0],
      tags: ['Spell', 'Evocation'],
    };
  });

  const [rawKeywords, setRawKeywords] = useState(formData.keywords.join(', '));
  const [isAiGeneratingArt, setIsAiGeneratingArt] = useState(false);
  const [isAiFillingFields, setIsAiFillingFields] = useState(false);

  const categories: CardCategory[] = ['Actor', 'Monster', 'Trap', 'Spell', 'Item', 'Location', 'Event'];
  const rarities: CardRarity[] = ['Common', 'Uncommon', 'Rare', 'Mythic', 'Artifact'];

  const handleFieldChange = (field: keyof CardItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKeywordsChange = (val: string) => {
    setRawKeywords(val);
    const split = val.split(',').map((k) => k.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, keywords: split, tags: split }));
  };

  const handleAddAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        { id: `${Date.now()}`, label: 'Stat', value: '10' }
      ]
    }));
  };

  const handleUpdateAttribute = (id: string, key: 'label' | 'value', val: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr) =>
        attr.id === id ? { ...attr, [key]: val } : attr
      )
    }));
  };

  const handleRemoveAttribute = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attr) => attr.id !== id)
    }));
  };

  // AI fills empty fields: generates suggestions for anything blank, never overwrites what's typed
  const handleAiFillEmptyFields = () => {
    setIsAiFillingFields(true);
    setTimeout(() => {
      setFormData((prev) => {
        const next = { ...prev };
        const baseName = next.name || 'Gilded Solar Phoenix';

        if (!next.name) next.name = 'Solarflare Archon';
        if (!next.subtitle) {
          if (next.category === 'Monster') next.subtitle = 'Beast of the Scorched Caldera';
          else if (next.category === 'Item') next.subtitle = 'Ancient Blade of the Sun Sovereign';
          else if (next.category === 'Actor') next.subtitle = 'High Commander of the Iron Legion';
          else next.subtitle = 'Radiant Weaver of Aether';
        }
        if (!next.rulesText) {
          next.rulesText = `Whenever this ${next.category.toLowerCase()} activates, deal 4 radiant damage to all opposing threats and heal 2 hit points to your vanguard.`;
        }
        if (!next.flavorText) {
          next.flavorText = 'No shadow can endure where the sovereign dawn has laid its fiery gaze.';
        }
        if (!next.keywords || next.keywords.length === 0) {
          const autoKws = ['Radiant', 'Flying', 'Vigilance'];
          next.keywords = autoKws;
          next.tags = autoKws;
          setRawKeywords(autoKws.join(', '));
        }
        if (!next.attributes || next.attributes.length === 0) {
          next.attributes = [
            { id: 'ai-1', label: 'ATK', value: '6' },
            { id: 'ai-2', label: 'HP', value: '14' }
          ];
        }
        return next;
      });
      setIsAiFillingFields(false);
      showToast('AI filled blank card fields without altering typed values.');
    }, 700);
  };

  // AI generates art
  const handleAiGenerateArt = () => {
    setIsAiGeneratingArt(true);
    const artPool = [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=600&q=80',
    ];
    setTimeout(() => {
      const nextArt = artPool[Math.floor(Math.random() * artPool.length)];
      setFormData((prev) => ({ ...prev, artUrl: nextArt }));
      setIsAiGeneratingArt(false);
      showToast('AI synthesized high-fidelity card illustration.');
    }, 900);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      showToast('Please provide a card name before saving.');
      return;
    }
    saveCard({
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setCreationMode('home');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCreationMode('home')}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Back to Workbench"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-xl text-zinc-100">
                {formData.name || 'New Tabletop Card'}
              </span>
              <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                Card Editor
              </span>
            </div>
            <p className="text-xs text-zinc-400">Crafting rules, rarity frames, and attributes</p>
          </div>
        </div>

        {/* AI Action Buttons and Save */}
        <div className="flex items-center space-x-2.5 flex-wrap">
          {/* AI Fills Empty Fields button */}
          <button
            onClick={handleAiFillEmptyFields}
            disabled={isAiFillingFields}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
            title="Generates thematic tabletop rules for any field left empty without overwriting your text"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiFillingFields ? 'animate-spin' : 'text-amber-400'}`} />
            <span>{isAiFillingFields ? 'Synthesizing...' : 'AI fills empty fields'}</span>
          </button>

          {/* AI Generates Art button */}
          <button
            onClick={handleAiGenerateArt}
            disabled={isAiGeneratingArt}
            className="px-3 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <ImageIcon className={`w-3.5 h-3.5 ${isAiGeneratingArt ? 'animate-pulse' : 'text-blue-400'}`} />
            <span>{isAiGeneratingArt ? 'Rendering...' : 'AI generates art'}</span>
          </button>

          {/* Save to Keep button */}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save to Keep</span>
          </button>
        </div>
      </div>

      {/* Editor Grid: Left Form Fields, Right Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 space-y-5 rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs font-mono-code font-semibold tracking-wider text-zinc-400 uppercase">
              CARD SPECIFICATION
            </span>
            <span className="text-[11px] text-zinc-500 font-mono-code">Live Synchronized</span>
          </div>

          {/* Name & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-300 font-medium block mb-1.5">
                Card Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="e.g. The Rune Axe"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-300 font-medium block mb-1.5">
                Subtitle / Type Line
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                placeholder="e.g. Relic of the First Forge"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Cost, Category, Rarity */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-zinc-300 font-medium block mb-1.5">
                Mana / Cost
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={formData.cost}
                onChange={(e) => handleFieldChange('cost', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-code text-amber-400 focus:outline-none focus:border-amber-400 text-center font-bold"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-300 font-medium block mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleFieldChange('category', e.target.value as CardCategory)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-300 font-medium block mb-1.5">
                Rarity Frame
              </label>
              <select
                value={formData.rarity}
                onChange={(e) => handleFieldChange('rarity', e.target.value as CardRarity)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
              >
                {rarities.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="text-xs text-zinc-300 font-medium block mb-1.5">
              Keywords <span className="text-[11px] text-zinc-500 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={rawKeywords}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              placeholder="e.g. Heavy, Runic Strike, Attunement"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Rules Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-zinc-300 font-medium">Rules & Ability Text</label>
              <span className="text-[10px] text-zinc-500 font-mono-code">Tabletop effect</span>
            </div>
            <textarea
              rows={3}
              value={formData.rulesText}
              onChange={(e) => handleFieldChange('rulesText', e.target.value)}
              placeholder="When equipped, whenever the bearer lands a critical hit..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          {/* Flavor Text */}
          <div>
            <label className="text-xs text-zinc-300 font-medium block mb-1.5">
              Flavor Text <span className="text-[11px] text-zinc-500 font-normal">(Lore & Quotes)</span>
            </label>
            <textarea
              rows={2}
              value={formData.flavorText}
              onChange={(e) => handleFieldChange('flavorText', e.target.value)}
              placeholder="Forged in the heart of Mount Kaldor..."
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs italic text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Attributes Label/Value Pairs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-zinc-300 font-medium">Card Attributes (Label / Value Pairs)</label>
              <button
                type="button"
                onClick={handleAddAttribute}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pair</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.attributes.map((attr) => (
                <div key={attr.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={attr.label}
                    onChange={(e) => handleUpdateAttribute(attr.id, 'label', e.target.value)}
                    placeholder="e.g. Damage"
                    className="w-1/3 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => handleUpdateAttribute(attr.id, 'value', e.target.value)}
                    placeholder="e.g. 2d8 + 3"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-code text-amber-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(attr.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview: 5 cols */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
          <div className="w-full rounded-2xl bg-[#141416] border border-zinc-800 p-6 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <span className="text-xs font-mono-code text-zinc-400 uppercase font-semibold">
                RENDERED FACE PREVIEW
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                100% Scale Tabletop
              </span>
            </div>

            <CardRender card={formData} scale="lg" />

            <p className="text-[11px] text-zinc-500 text-center mt-4">
              Real-time WYSIWYG card face. Standard 2.5" x 3.5" poker print format compatible with VTT modules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
