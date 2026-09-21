import React from 'react';
import { useApp } from '../../context/AppContext';
import { CardRender } from '../CardRender';
import { 
  X, 
  Trash2, 
  Edit3, 
  Tag, 
  Calendar, 
  ExternalLink, 
  Shield, 
  Layers, 
  Compass, 
  Box, 
  Sparkles,
  MapPin
} from 'lucide-react';

export const ItemDetailModal: React.FC = () => {
  const { 
    selectedDetailItem, 
    setSelectedDetailItem,
    openCardEditor,
    openDeckEditor,
    openMapEditor,
    openPieceViewer,
    openCampaignDetail,
    deleteCard,
    deleteDeck,
    deleteMap,
    deletePiece,
    deleteCampaign
  } = useApp();

  if (!selectedDetailItem) return null;

  const { type, item } = selectedDetailItem;

  const handleEdit = () => {
    setSelectedDetailItem(null);
    if (type === 'card') openCardEditor(item.id);
    else if (type === 'deck') openDeckEditor(item.id);
    else if (type === 'map') openMapEditor(item.id);
    else if (type === 'piece') openPieceViewer(item.id);
    else if (type === 'campaign') openCampaignDetail(item.id);
  };

  const handleDelete = () => {
    if (type === 'card') deleteCard(item.id);
    else if (type === 'deck') deleteDeck(item.id);
    else if (type === 'map') deleteMap(item.id);
    else if (type === 'piece') deletePiece(item.id);
    else if (type === 'campaign') deleteCampaign(item.id);
    setSelectedDetailItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#1a1a1c] border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono-code uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
              The Keep Vault Asset • {type}
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-xs text-zinc-400 font-mono-code">{item.id}</span>
          </div>

          <button
            onClick={() => setSelectedDetailItem(null)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Visual Preview */}
            <div className="shrink-0 mx-auto md:mx-0">
              {type === 'card' && <CardRender card={item} scale="md" />}
              {type === 'map' && (
                <div className="w-64 h-48 rounded-xl bg-zinc-950 border border-zinc-700 relative overflow-hidden flex flex-col items-center justify-center p-3 text-center">
                  <div className="grid grid-cols-6 grid-rows-4 gap-1 w-full h-full opacity-40">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="border border-zinc-700 bg-zinc-900 rounded-xs" />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <Compass className="w-8 h-8 text-blue-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-200">{item.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono-code">{item.width}x{item.height} ({item.engine})</span>
                  </div>
                </div>
              )}
              {type === 'piece' && (
                <div className="w-64 h-56 rounded-xl bg-zinc-950 border border-zinc-700 relative overflow-hidden flex flex-col items-center justify-center p-3">
                  <img
                    src={item.sourceImage}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-3">
                    <span className="text-xs font-semibold text-zinc-100">{item.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono-code">{item.size} • {item.polyCount}</span>
                  </div>
                </div>
              )}
              {type === 'deck' && (
                <div className="w-64 h-56 rounded-xl bg-gradient-to-br from-amber-950/40 via-zinc-900 to-black border-2 border-amber-500/40 p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono-code text-amber-400 uppercase font-semibold">Deck</span>
                    <h3 className="font-display font-bold text-base text-zinc-100 mt-1">{item.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 text-xs font-mono-code text-zinc-400 flex justify-between">
                    <span>{item.cardIds?.length || 0} Cards</span>
                    <span className="text-amber-400">{item.format}</span>
                  </div>
                </div>
              )}
              {type === 'campaign' && (
                <div className="w-64 h-56 rounded-xl bg-zinc-950 border border-emerald-500/40 p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono-code text-emerald-400 uppercase font-semibold">Campaign</span>
                    <h3 className="font-display font-bold text-base text-zinc-100 mt-1">{item.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-3">{item.description}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 text-xs font-mono-code text-zinc-400 flex justify-between">
                    <span>{item.entries?.length || 0} Entries</span>
                    <span className="text-emerald-400">{item.status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="flex-1 space-y-4 min-w-0">
              <div>
                <h2 className="font-display text-xl font-bold text-zinc-100">{item.name}</h2>
                {item.subtitle && <p className="text-xs text-zinc-400 italic mt-0.5">{item.subtitle}</p>}
                {item.description && <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{item.description}</p>}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Created / Updated</span>
                  <span className="text-zinc-200">{item.updatedAt || 'Recent'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Category</span>
                  <span className="text-amber-400">{item.category || item.engine || item.format || type}</span>
                </div>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div>
                  <span className="text-[11px] font-mono-code text-zinc-500 uppercase block mb-1.5">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((t: string, idx: number) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional specs if piece or map */}
              {item.polyCount && (
                <div className="text-xs text-zinc-400 space-y-1 pt-2 border-t border-zinc-800">
                  <div><strong>Generator:</strong> {item.generator}</div>
                  <div><strong>Physical Scale:</strong> {item.size}</div>
                  <div><strong>Triangles:</strong> {item.polyCount}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions: Edit and Delete */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Item</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedDetailItem(null)}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-lg shadow-amber-500/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit in Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
