import React from 'react';
import { useApp } from '../../context/AppContext';
import { TemplateGallery } from './TemplateGallery';
import { MapEditor } from './MapEditor';
import { MasterCrafter } from './MasterCrafter';
import { 
  Compass, 
  Box, 
  Plus, 
  Sparkles, 
  Map as MapIcon, 
  Layers, 
  Play, 
  Calendar,
  Layers2
} from 'lucide-react';

export const RealmCrafterRoom: React.FC = () => {
  const { 
    realmMode, 
    setRealmMode, 
    realmRunnerView, 
    setRealmRunnerView, 
    maps, 
    openMapEditor, 
    openNewMapFlow 
  } = useApp();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Prominent Top Toggle: [ REALM RUNNER ] [ MASTER CRAFTER ] */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-code text-zinc-400">
            <span>Room 04</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Dual Creative Engine</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-zinc-100 mt-0.5">
            Realm Crafter
          </h1>
        </div>

        {/* PROMINENT TOGGLE: [ REALM RUNNER ] [ MASTER CRAFTER ] */}
        <div className="p-1 rounded-2xl bg-zinc-900/90 border-2 border-zinc-800 flex items-center shadow-lg">
          <button
            onClick={() => setRealmMode('runner')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              realmMode === 'runner'
                ? 'bg-blue-500 text-zinc-950 shadow-md shadow-blue-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>REALM RUNNER (MAPS)</span>
          </button>

          <button
            onClick={() => setRealmMode('crafter')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
              realmMode === 'crafter'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>MASTER CRAFTER (3D PIECES)</span>
          </button>
        </div>
      </div>

      {/* Main Room Content based on Toggle */}
      {realmMode === 'runner' ? (
        /* ── REALM RUNNER (maps) ── */
        <div>
          {realmRunnerView === 'editor' ? (
            <MapEditor />
          ) : realmRunnerView === 'templates' ? (
            <TemplateGallery />
          ) : (
            /* HOME: Gallery of user's maps, grid layout with thumbnails, "New map" button */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-zinc-100">Tactical Battlemaps</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Multi-engine battle grids with token fixtures, dynamic walls, and lighting
                  </p>
                </div>

                <button
                  onClick={() => openNewMapFlow()}
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Map</span>
                </button>
              </div>

              {/* Map Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {maps.map((map) => (
                  <div
                    key={map.id}
                    onClick={() => openMapEditor(map.id)}
                    className="group cursor-pointer rounded-2xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800 hover:border-blue-500/50 p-4 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 shadow-md"
                  >
                    <div>
                      {/* Map Thumbnail Preview */}
                      <div className="w-full h-44 rounded-xl bg-[#111114] border-2 border-zinc-800 group-hover:border-blue-500/40 p-2.5 relative overflow-hidden flex items-center justify-center mb-3.5 transition-colors">
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: 'linear-gradient(to right, #52525b 1px, transparent 1px), linear-gradient(to bottom, #52525b 1px, transparent 1px)',
                            backgroundSize: '16px 16px'
                          }}
                        />

                        {/* Visual mini blueprint representation */}
                        <div className="relative w-36 h-24 border-2 border-zinc-700 bg-zinc-900/90 rounded-sm p-1 flex flex-col justify-between">
                          <div className="flex justify-between items-center text-[8px] font-mono-code text-blue-400">
                            <span>{map.width}x{map.height} Grid</span>
                            <span>{map.pieces.length} Pieces</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2 py-2">
                            <div className="w-4 h-4 rounded bg-amber-500/30 border border-amber-400/50" />
                            <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-400/50" />
                            <div className="w-4 h-4 rounded bg-rose-500/30 border border-rose-400/50" />
                          </div>
                          <span className="text-[7px] font-mono-code text-zinc-500 truncate text-center">
                            Engine: {map.engine}
                          </span>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono-code text-[9px] text-blue-300 border border-blue-500/30">
                          {map.engine}
                        </div>
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono-code text-[9px] text-zinc-300 border border-zinc-700">
                          {map.width} x {map.height}
                        </div>
                      </div>

                      <h3 className="font-display text-sm font-bold text-zinc-100 group-hover:text-blue-300 transition-colors truncate">
                        {map.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {map.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-mono-code text-[11px]">{map.updatedAt}</span>
                      <span className="text-blue-400 font-semibold group-hover:underline flex items-center space-x-1">
                        <span>Open Editor</span>
                        <Play className="w-3 h-3 ml-0.5 fill-current" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── MASTER CRAFTER (3D pieces) ── */
        <MasterCrafter />
      )}
    </div>
  );
};
