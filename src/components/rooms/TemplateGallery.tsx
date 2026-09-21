import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapEngine, MapItem } from '../../types';
import { MAP_TEMPLATES } from '../../data/mockData';
import { 
  ArrowLeft, 
  Compass, 
  DoorClosed, 
  Sparkles, 
  Flame, 
  Droplets, 
  Box, 
  Skull, 
  User, 
  Circle,
  Play
} from 'lucide-react';

export const TemplateGallery: React.FC = () => {
  const { setRealmRunnerView, saveMap, openMapEditor } = useApp();
  const [selectedEngine, setSelectedEngine] = useState<MapEngine>('Mipui');

  const handleSelectTemplate = (template: typeof MAP_TEMPLATES[0]) => {
    const newMapId = `map-${Date.now()}`;
    const newMap: MapItem = {
      id: newMapId,
      name: `${template.name} (${selectedEngine})`,
      width: template.width,
      height: template.height,
      engine: selectedEngine,
      templateId: template.id,
      description: template.description,
      updatedAt: new Date().toISOString().split('T')[0],
      tags: [selectedEngine, template.name, `${template.dimensions}`],
      terrainGrid: Array.from({ length: template.height }, () =>
        Array.from({ length: template.width }, () => template.floorType)
      ),
      pieces: [
        { id: 'init-1', x: 2, y: 2, kind: 'door', name: 'Chamber Entrance Door', size: 1, rotation: 0, zOrder: 2, icon: 'DoorClosed' }
      ]
    };

    saveMap(newMap);
    openMapEditor(newMapId);
  };

  const engines: Array<{ id: MapEngine; label: string; badge: string; desc: string }> = [
    { id: 'Mipui', label: 'Mipui Engine', badge: 'Fast VTT Grid', desc: 'Lightweight pixel-perfect 2D grid export with dynamic line-of-sight' },
    { id: 'Godot', label: 'Godot 4 Tilemap', badge: '2D/3D Node Ready', desc: 'Export directly to Godot TileMap layers with collision polygons' },
    { id: 'Unreal', label: 'Unreal Tabletop', badge: 'High Fidelity', desc: 'Physically based rendering, volumetric fog, and Lumen lighting hooks' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setRealmRunnerView('gallery')}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl text-zinc-100">New Tactical Map</h1>
            <p className="text-xs text-zinc-400">Choose engine architecture first, then select a layout template</p>
          </div>
        </div>

        <span className="text-xs font-mono-code text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
          Step 1: Choose Engine & Template
        </span>
      </div>

      {/* Engine Selector Chosen FIRST */}
      <div className="p-5 rounded-2xl bg-[#1a1a1c] border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-code font-semibold tracking-wider text-zinc-300 uppercase flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-blue-400" />
            <span>SELECT RUNTIME ENGINE (CHOSEN FIRST)</span>
          </span>
          <span className="text-xs font-mono-code text-zinc-500">Determines grid snapping & physics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {engines.map((eng) => (
            <div
              key={eng.id}
              onClick={() => setSelectedEngine(eng.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedEngine === eng.id
                  ? 'bg-blue-500/15 border-blue-400 text-zinc-100 shadow-md shadow-blue-500/10'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code uppercase font-bold text-blue-400">{eng.label}</span>
                <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {eng.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{eng.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Six Template Cards with THUMBNAILS that actually look like the maps! */}
      <div>
        <h2 className="font-display font-bold text-base text-zinc-200 mb-3">
          Select Room Blueprint Template
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MAP_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className="group cursor-pointer rounded-2xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800 hover:border-amber-500/50 p-4 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 shadow-lg"
            >
              <div>
                {/* Visual Blueprint Thumbnail */}
                <div className="w-full h-44 rounded-xl bg-[#111114] border-2 border-zinc-800 group-hover:border-amber-500/40 p-2.5 relative overflow-hidden flex items-center justify-center mb-3.5 transition-colors">
                  {/* Grid Lines Pattern */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #52525b 1px, transparent 1px), linear-gradient(to bottom, #52525b 1px, transparent 1px)',
                      backgroundSize: '16px 16px'
                    }}
                  />

                  {/* Render Template Specific Visual Map */}
                  {tpl.previewType === 'room' && (
                    <div className="relative w-28 h-28 border-4 border-amber-700/80 bg-zinc-900 rounded-sm flex items-center justify-center shadow-lg">
                      <div className="absolute -bottom-2 w-6 h-2 bg-amber-400 rounded-xs flex items-center justify-center text-[8px] font-bold text-black">
                        DOOR
                      </div>
                      <span className="text-[10px] font-mono-code text-zinc-400">12x12</span>
                    </div>
                  )}

                  {tpl.previewType === 'dungeon' && (
                    <div className="relative w-44 h-28 border-2 border-zinc-700 bg-zinc-950 p-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-12 h-8 border-2 border-zinc-600 bg-zinc-900 rounded-xs flex items-center justify-center text-[8px] text-zinc-400">
                          Cell
                        </div>
                        <div className="w-16 h-8 border-2 border-amber-500/50 bg-amber-950/20 rounded-xs flex items-center justify-center text-[8px] text-amber-300">
                          Vault [Chest]
                        </div>
                      </div>
                      <div className="h-4 bg-zinc-800/80 border-y border-zinc-700 mx-2 flex items-center justify-center text-[8px] text-zinc-500">
                        Corridor
                      </div>
                      <div className="flex justify-center">
                        <div className="w-24 h-10 border-2 border-rose-600/60 bg-rose-950/20 rounded-xs flex items-center justify-center text-[8px] text-rose-300">
                          Crypt [Boss]
                        </div>
                      </div>
                    </div>
                  )}

                  {tpl.previewType === 'clearing' && (
                    <div className="relative w-44 h-28 rounded-lg bg-emerald-950/30 border-2 border-emerald-800/60 p-2 flex items-center justify-between">
                      {/* Trees & River */}
                      <div className="space-y-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center text-[8px] text-emerald-200">
                          🌲
                        </div>
                        <div className="w-6 h-6 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center text-[8px] text-emerald-200">
                          🌲
                        </div>
                      </div>
                      {/* Campfire */}
                      <div className="w-8 h-8 rounded-full bg-orange-950 border border-orange-500/80 flex items-center justify-center text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                        <Flame className="w-4 h-4" />
                      </div>
                      {/* Winding river */}
                      <div className="w-3 h-24 bg-blue-500/60 rounded-full border border-blue-400/40" />
                    </div>
                  )}

                  {tpl.previewType === 'town' && (
                    <div className="relative w-44 h-28 rounded-lg bg-stone-900 border-2 border-stone-700 p-2 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="w-14 h-7 bg-amber-950/60 border border-amber-700 rounded-xs text-[7px] text-center text-amber-200 p-0.5">
                          General Store
                        </div>
                        <div className="w-14 h-7 bg-zinc-800 border border-zinc-600 rounded-xs text-[7px] text-center text-zinc-300 p-0.5">
                          Blacksmith
                        </div>
                      </div>
                      {/* Town Well */}
                      <div className="self-center w-6 h-6 rounded-full bg-blue-900 border-2 border-zinc-400 flex items-center justify-center text-[7px] text-blue-200 font-bold">
                        WELL
                      </div>
                      <div className="flex justify-between">
                        <div className="w-14 h-7 bg-zinc-800 border border-zinc-600 rounded-xs text-[7px] text-center text-zinc-300 p-0.5">
                          Guildhall
                        </div>
                        <div className="w-14 h-7 bg-amber-950/60 border border-amber-700 rounded-xs text-[7px] text-center text-amber-200 p-0.5">
                          Stables
                        </div>
                      </div>
                    </div>
                  )}

                  {tpl.previewType === 'tavern' && (
                    <div className="relative w-40 h-28 rounded-lg bg-[#2a1d13] border-2 border-amber-900/80 p-2 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        {/* Bar counter */}
                        <div className="w-20 h-4 bg-amber-800 border border-amber-600 rounded-xs text-[7px] text-center text-amber-100 font-bold">
                          BAR COUNTER
                        </div>
                        <div className="w-6 h-4 bg-orange-950 border border-orange-600 rounded-xs text-[6px] text-center text-orange-200">
                          HEARTH
                        </div>
                      </div>
                      {/* Round tables */}
                      <div className="flex justify-around items-center">
                        <div className="w-5 h-5 rounded-full bg-amber-900 border border-amber-700 flex items-center justify-center text-[6px] text-amber-200">
                          T1
                        </div>
                        <div className="w-5 h-5 rounded-full bg-amber-900 border border-amber-700 flex items-center justify-center text-[6px] text-amber-200">
                          T2
                        </div>
                      </div>
                      <div className="self-start w-5 h-2 bg-amber-500 rounded-xs text-[6px] font-bold text-black text-center">
                        DOOR
                      </div>
                    </div>
                  )}

                  {tpl.previewType === 'blank' && (
                    <div className="relative w-36 h-28 border-2 border-dashed border-zinc-700 bg-zinc-950/80 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                      <Sparkles className="w-6 h-6 text-zinc-500 mb-1" />
                      <span className="text-[10px] font-mono-code text-zinc-400">Empty Grid Canvas</span>
                      <span className="text-[9px] text-zinc-600">Zero default fixtures</span>
                    </div>
                  )}

                  {/* Dimensions badge */}
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 font-mono-code text-[9px] text-amber-300 border border-zinc-800">
                    {tpl.dimensions}
                  </div>
                </div>

                <h3 className="font-display text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="font-mono-code text-zinc-500">{tpl.piecesCount} Fixtures</span>
                <span className="text-amber-400 font-semibold group-hover:underline flex items-center space-x-1">
                  <span>Create Map</span>
                  <Play className="w-3 h-3 ml-0.5 fill-current" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
