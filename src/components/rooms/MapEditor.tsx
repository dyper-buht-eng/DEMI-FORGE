import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapItem, 
  MapEngine, 
  MapPieceKind, 
  PlacedMapPiece 
} from '../../types';
import { 
  ArrowLeft, 
  Save, 
  MousePointer, 
  Stamp, 
  Mountain, 
  ShieldAlert, 
  Eraser, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Layers, 
  Compass, 
  Undo, 
  Redo, 
  Grid, 
  DoorClosed, 
  Flame, 
  Droplets, 
  Box, 
  Skull, 
  User, 
  Sparkles,
  Columns,
  Trash2,
  Check
} from 'lucide-react';

export const MapEditor: React.FC = () => {
  const { 
    editingMapId, 
    setRealmRunnerView, 
    maps, 
    saveMap, 
    showToast 
  } = useApp();

  const existingMap = maps.find((m) => m.id === editingMapId);

  const [mapData, setMapData] = useState<MapItem>(() => {
    if (existingMap) return JSON.parse(JSON.stringify(existingMap));
    return {
      id: `map-${Date.now()}`,
      name: 'Custom Tactical Battlemap',
      width: 16,
      height: 12,
      engine: 'Mipui',
      description: 'Tactical dungeon chamber.',
      updatedAt: new Date().toISOString().split('T')[0],
      tags: ['Mipui', 'Encounter'],
      terrainGrid: Array.from({ length: 12 }, () => Array.from({ length: 16 }, () => 'stone')),
      pieces: [
        { id: 'p-1', x: 2, y: 2, kind: 'door', name: 'Reinforced Oak Door', size: 1, rotation: 0, zOrder: 2, icon: 'DoorClosed' },
        { id: 'p-2', x: 8, y: 6, kind: 'chest', name: 'Gilded Treasure Chest', size: 1, rotation: 0, zOrder: 1, icon: 'Box' },
        { id: 'p-3', x: 12, y: 4, kind: 'monster', name: 'Goblin Sentry', size: 1, rotation: 0, zOrder: 2, icon: 'Skull' }
      ]
    };
  });

  // Tools: select | place | terrain | walls | erase
  const [activeTool, setActiveTool] = useState<'select' | 'place' | 'terrain' | 'walls' | 'erase'>('select');
  const [selectedPieceKind, setSelectedPieceKind] = useState<MapPieceKind>('chest');
  const [selectedTerrainType, setSelectedTerrainType] = useState<string>('stone');
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(mapData.pieces[0]?.id || null);

  // View state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);

  // Undo/Redo history
  const [history, setHistory] = useState<PlacedMapPiece[][]>([mapData.pieces]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const selectedPiece = mapData.pieces.find((p) => p.id === selectedPieceId);

  const pushHistory = (newPieces: PlacedMapPiece[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newPieces);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setMapData((m) => ({ ...m, pieces: prev }));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setMapData((m) => ({ ...m, pieces: next }));
    }
  };

  // Palette piece types
  const piecePalette: Array<{ kind: MapPieceKind; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { kind: 'door', label: 'Door', icon: DoorClosed },
    { kind: 'wall', label: 'Wall', icon: Columns },
    { kind: 'terrain', label: 'Water / Stream', icon: Droplets },
    { kind: 'chest', label: 'Chest', icon: Box },
    { kind: 'trap', label: 'Trap', icon: ShieldAlert },
    { kind: 'npc', label: 'NPC Ally', icon: User },
    { kind: 'monster', label: 'Monster', icon: Skull },
    { kind: 'decoration', label: 'Hearth / Decor', icon: Flame },
  ];

  // Grid Cell Click
  const handleCellClick = (x: number, y: number) => {
    if (activeTool === 'select') {
      const pieceOnCell = mapData.pieces.find((p) => p.x === x && p.y === y);
      if (pieceOnCell) {
        setSelectedPieceId(pieceOnCell.id);
      } else {
        setSelectedPieceId(null);
      }
    } else if (activeTool === 'place') {
      const newPiece: PlacedMapPiece = {
        id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        x,
        y,
        kind: selectedPieceKind,
        name: `${selectedPieceKind.toUpperCase()} (Cell ${x},${y})`,
        size: 1,
        rotation: 0,
        zOrder: selectedPieceKind === 'monster' || selectedPieceKind === 'npc' ? 2 : 1,
      };
      const updated = [...mapData.pieces, newPiece];
      setMapData((m) => ({ ...m, pieces: updated }));
      pushHistory(updated);
      setSelectedPieceId(newPiece.id);
      showToast(`Placed ${selectedPieceKind} at [${x}, ${y}]`);
    } else if (activeTool === 'terrain') {
      const updatedGrid = mapData.terrainGrid.map((row, rIdx) =>
        row.map((cell, cIdx) => (rIdx === y && cIdx === x ? selectedTerrainType : cell))
      );
      setMapData((m) => ({ ...m, terrainGrid: updatedGrid }));
    } else if (activeTool === 'walls') {
      const newWall: PlacedMapPiece = {
        id: `w-${Date.now()}`,
        x,
        y,
        kind: 'wall',
        name: `Stone Wall [${x},${y}]`,
        size: 1,
        rotation: 0,
        zOrder: 1,
      };
      const updated = [...mapData.pieces, newWall];
      setMapData((m) => ({ ...m, pieces: updated }));
      pushHistory(updated);
    } else if (activeTool === 'erase') {
      const updated = mapData.pieces.filter((p) => !(p.x === x && p.y === y));
      setMapData((m) => ({ ...m, pieces: updated }));
      pushHistory(updated);
      if (selectedPieceId && mapData.pieces.find((p) => p.id === selectedPieceId && p.x === x && p.y === y)) {
        setSelectedPieceId(null);
      }
    }
  };

  // Drag and Drop from Palette onto Canvas
  const handleDragStartPalette = (e: React.DragEvent, kind: MapPieceKind) => {
    e.dataTransfer.setData('text/plain', kind);
  };

  const handleDropCell = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData('text/plain') as MapPieceKind;
    if (kind) {
      const newPiece: PlacedMapPiece = {
        id: `p-${Date.now()}`,
        x,
        y,
        kind,
        name: `${kind} Token [${x},${y}]`,
        size: 1,
        rotation: 0,
        zOrder: kind === 'monster' || kind === 'npc' ? 2 : 1,
      };
      const updated = [...mapData.pieces, newPiece];
      setMapData((m) => ({ ...m, pieces: updated }));
      pushHistory(updated);
      setSelectedPieceId(newPiece.id);
      showToast(`Dropped ${kind} onto grid [${x}, ${y}]`);
    }
  };

  // Inspector Updates
  const updateSelectedPiece = (key: keyof PlacedMapPiece, val: any) => {
    if (!selectedPieceId) return;
    const updated = mapData.pieces.map((p) =>
      p.id === selectedPieceId ? { ...p, [key]: val } : p
    );
    setMapData((m) => ({ ...m, pieces: updated }));
  };

  const deleteSelectedPiece = () => {
    if (!selectedPieceId) return;
    const updated = mapData.pieces.filter((p) => p.id !== selectedPieceId);
    setMapData((m) => ({ ...m, pieces: updated }));
    pushHistory(updated);
    setSelectedPieceId(null);
    showToast('Piece removed from map');
  };

  const handleSaveMap = () => {
    saveMap(mapData);
    setRealmRunnerView('gallery');
  };

  const getPieceIcon = (kind: MapPieceKind) => {
    switch (kind) {
      case 'door': return <DoorClosed className="w-4 h-4 text-amber-400" />;
      case 'wall': return <Columns className="w-4 h-4 text-zinc-400" />;
      case 'chest': return <Box className="w-4 h-4 text-amber-300" />;
      case 'trap': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'npc': return <User className="w-4 h-4 text-blue-400" />;
      case 'monster': return <Skull className="w-4 h-4 text-rose-500" />;
      case 'decoration': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'terrain': return <Droplets className="w-4 h-4 text-cyan-400" />;
      default: return <Sparkles className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getTileBg = (type: string) => {
    switch (type) {
      case 'wood': return 'bg-[#2b1e15] border-amber-950/60';
      case 'grass': return 'bg-[#152818] border-emerald-950/60';
      case 'water': return 'bg-[#0f2438] border-blue-950/60';
      case 'dirt': return 'bg-[#2d2217] border-stone-900';
      case 'carpet': return 'bg-[#3b151e] border-rose-950/60';
      default: return 'bg-[#161619] border-zinc-800/80';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Bar: map name, engine selector, zoom/undo, Save button */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#1a1a1c] border border-zinc-800">
        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <button
            onClick={() => setRealmRunnerView('gallery')}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
            title="Back to Maps"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={mapData.name}
            onChange={(e) => setMapData((m) => ({ ...m, name: e.target.value }))}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm font-display font-bold text-zinc-100 focus:outline-none focus:border-amber-400 min-w-[200px]"
          />

          {/* Engine Selector */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono-code">
            {(['Mipui', 'Godot', 'Unreal'] as MapEngine[]).map((eng) => (
              <button
                key={eng}
                onClick={() => setMapData((m) => ({ ...m, engine: eng }))}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  mapData.engine === eng
                    ? 'bg-blue-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {eng}
              </button>
            ))}
          </div>
        </div>

        {/* Utilities & Save */}
        <div className="flex items-center space-x-2 w-full lg:w-auto justify-between lg:justify-end">
          {/* Undo / Redo */}
          <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
              title="Undo"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
              title="Redo"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Snap-to-grid toggle */}
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono-code border flex items-center space-x-1.5 transition-colors ${
              snapToGrid
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Snap Grid</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-mono-code">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-zinc-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.75, z + 0.25))}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleSaveMap}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save to Keep</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Tool Rail + Center Grid Canvas + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Tool Rail & Piece Palette (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tool Selector */}
          <div className="p-3 rounded-2xl bg-[#1a1a1c] border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono-code font-semibold tracking-wider text-zinc-500 uppercase px-2 block mb-1">
              TOOLS
            </span>
            {[
              { id: 'select', label: 'Select', icon: MousePointer },
              { id: 'place', label: 'Place Piece', icon: Stamp },
              { id: 'terrain', label: 'Paint Terrain', icon: Mountain },
              { id: 'walls', label: 'Draw Walls', icon: Columns },
              { id: 'erase', label: 'Erase', icon: Eraser },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as any)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTool === tool.id
                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>

          {/* Piece Palette: draggable types */}
          <div className="p-3 rounded-2xl bg-[#1a1a1c] border border-zinc-800 space-y-2">
            <span className="text-[10px] font-mono-code font-semibold tracking-wider text-zinc-500 uppercase px-1 block">
              PIECE PALETTE (DRAGGABLE)
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {piecePalette.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPieceKind === p.kind;
                return (
                  <div
                    key={p.kind}
                    draggable
                    onDragStart={(e) => handleDragStartPalette(e, p.kind)}
                    onClick={() => {
                      setSelectedPieceKind(p.kind);
                      setActiveTool('place');
                    }}
                    className={`p-2 rounded-xl border text-center cursor-grab active:cursor-grabbing transition-all flex flex-col items-center justify-center ${
                      isSelected && activeTool === 'place'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-mono-code truncate">{p.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terrain Texture Palette */}
          {activeTool === 'terrain' && (
            <div className="p-3 rounded-2xl bg-[#1a1a1c] border border-zinc-800 space-y-1.5 animate-in fade-in">
              <span className="text-[10px] font-mono-code font-semibold text-zinc-500 uppercase px-1 block">
                TERRAIN TILE
              </span>
              {['stone', 'wood', 'grass', 'water', 'dirt', 'carpet'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTerrainType(t)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono-code uppercase transition-all flex items-center justify-between ${
                    selectedTerrainType === t
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-zinc-400 hover:bg-zinc-800/60'
                  }`}
                >
                  <span>{t}</span>
                  {selectedTerrainType === t && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center Grid Canvas (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0f0f12] border-2 border-zinc-800 p-4 overflow-auto max-h-[680px] flex items-center justify-center shadow-inner relative">
          {/* Visual Canvas Grid */}
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="border-2 border-zinc-700 shadow-2xl rounded-lg overflow-hidden bg-black select-none"
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${mapData.width}, 36px)`,
                gridTemplateRows: `repeat(${mapData.height}, 36px)`,
              }}
            >
              {Array.from({ length: mapData.height }).map((_, y) =>
                Array.from({ length: mapData.width }).map((_, x) => {
                  const tileType = mapData.terrainGrid[y]?.[x] || 'stone';
                  const piecesOnCell = mapData.pieces.filter((p) => p.x === x && p.y === y);
                  const isCellSelected = selectedPiece && selectedPiece.x === x && selectedPiece.y === y;

                  return (
                    <div
                      key={`${x}-${y}`}
                      onClick={() => handleCellClick(x, y)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropCell(e, x, y)}
                      className={`w-9 h-9 border border-zinc-800/80 relative flex items-center justify-center cursor-pointer transition-colors ${getTileBg(
                        tileType
                      )} ${isCellSelected ? 'ring-2 ring-amber-400 z-10' : 'hover:bg-zinc-800/40'}`}
                      title={`Cell [${x}, ${y}] - ${tileType}`}
                    >
                      {/* Grid Coordinates watermark */}
                      <span className="absolute top-0.5 left-0.5 text-[7px] text-zinc-600 font-mono-code pointer-events-none opacity-40">
                        {x},{y}
                      </span>

                      {/* Render Piece on cell if exists */}
                      {piecesOnCell.map((piece) => (
                        <div
                          key={piece.id}
                          style={{
                            transform: `rotate(${piece.rotation}deg)`,
                          }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            selectedPieceId === piece.id
                              ? 'bg-amber-500/30 border-2 border-amber-400 shadow-md scale-110'
                              : 'bg-zinc-900/90 border border-zinc-700 hover:border-zinc-500'
                          }`}
                        >
                          {getPieceIcon(piece.kind)}
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Inspector: selected piece's properties (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs font-mono-code font-semibold tracking-wider text-zinc-400 uppercase">
              PIECE INSPECTOR
            </span>
            <span className="text-[10px] font-mono-code text-zinc-500">
              {mapData.pieces.length} Placed
            </span>
          </div>

          {selectedPiece ? (
            <div className="space-y-4">
              {/* Piece Name */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Piece Name</label>
                <input
                  type="text"
                  value={selectedPiece.name}
                  onChange={(e) => updateSelectedPiece('name', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Kind */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Kind</label>
                <select
                  value={selectedPiece.kind}
                  onChange={(e) => updateSelectedPiece('kind', e.target.value as MapPieceKind)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                >
                  {piecePalette.map((p) => (
                    <option key={p.kind} value={p.kind}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Size & Coordinates */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Size (Tiles)</label>
                  <select
                    value={selectedPiece.size}
                    onChange={(e) => updateSelectedPiece('size', parseInt(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-code text-zinc-200"
                  >
                    <option value={1}>1x1 Standard</option>
                    <option value={2}>2x2 Large</option>
                    <option value={3}>3x3 Huge</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Position</label>
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-code text-amber-400 font-semibold">
                    X: {selectedPiece.x} | Y: {selectedPiece.y}
                  </div>
                </div>
              </div>

              {/* Rotation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-zinc-400">Rotation</label>
                  <span className="text-xs font-mono-code text-amber-400 font-semibold">{selectedPiece.rotation}°</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[0, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => updateSelectedPiece('rotation', deg)}
                      className={`py-1 rounded-lg text-xs font-mono-code transition-all ${
                        selectedPiece.rotation === deg
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Z-Order Layer */}
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Z-Order (Layer)</label>
                <div className="grid grid-cols-3 gap-1 text-xs font-mono-code">
                  {[
                    { val: 0, label: '0: Floor' },
                    { val: 1, label: '1: Scenery' },
                    { val: 2, label: '2: Token' },
                  ].map((layer) => (
                    <button
                      key={layer.val}
                      onClick={() => updateSelectedPiece('zOrder', layer.val)}
                      className={`py-1 rounded-lg transition-all ${
                        selectedPiece.zOrder === layer.val
                          ? 'bg-blue-500 text-zinc-950 font-bold'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}
                    >
                      {layer.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Piece */}
              <div className="pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={deleteSelectedPiece}
                  className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected Piece</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-500 text-xs rounded-xl bg-zinc-900/60 border border-zinc-800">
              <MousePointer className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
              <p className="font-semibold text-zinc-400">No Piece Selected</p>
              <p className="text-[11px] mt-1">Click a placed piece on the canvas or stamp one from the palette.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
