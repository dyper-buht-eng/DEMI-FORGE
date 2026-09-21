import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThreePieceItem } from '../../types';
import { ThreeCanvas } from '../ThreeCanvas';
import { ThreePieceViewer } from './ThreePieceViewer';
import { 
  Package, 
  Upload, 
  Sparkles, 
  ArrowLeft, 
  Plus, 
  Save, 
  Layers, 
  Compass, 
  Box, 
  CheckCircle2, 
  Image as ImageIcon,
  FolderPlus,
  Sliders
} from 'lucide-react';

export const MasterCrafter: React.FC = () => {
  const { 
    masterCrafterView, 
    setMasterCrafterView, 
    pieces, 
    savePiece, 
    openPieceViewer, 
    showToast 
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // New Piece Flow State
  const [newPieceDoor, setNewPieceDoor] = useState<'pick' | 'image' | 'pack'>('pick');
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80'
  );
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedModelReady, setGeneratedModelReady] = useState(false);
  const [modelName, setModelName] = useState('Forged Celestial Golem');
  const [modelCategory, setModelCategory] = useState<'Avatars' | 'Items' | 'Effects' | 'Buildings'>('Avatars');
  const [customColor, setCustomColor] = useState('#f59e0b');

  // Standard Packs for "From pack"
  const standardPacks = [
    {
      id: 'pack-core',
      name: 'Fantasy Core Roster',
      category: 'Avatars' as const,
      models: [
        { name: 'Ironclad Paladin', type: 'paladin' as const, preview: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80' },
        { name: 'Dwarven Runesmith', type: 'axe' as const, preview: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80' },
      ]
    },
    {
      id: 'pack-monsters',
      name: 'Eldritch Terrors & Mimics',
      category: 'Items' as const,
      models: [
        { name: 'Hungry Mimic Chest', type: 'chest' as const, preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
        { name: 'Obsidian Gargoyle Sentry', type: 'gargoyle' as const, preview: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=400&q=80' },
      ]
    },
    {
      id: 'pack-effects',
      name: 'Arcane Spells & Portals',
      category: 'Effects' as const,
      models: [
        { name: 'Dimensional Rift Portal', type: 'portal' as const, preview: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80' },
      ]
    },
  ];

  if (masterCrafterView === 'viewer') {
    return <ThreePieceViewer />;
  }

  // Handle Generate 3D Model from Image
  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(10);

    const interval = setInterval(() => {
      setGenerationProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGeneratedModelReady(true);
          showToast('3D Mesh generated successfully from image!');
          return 100;
        }
        return p + 20;
      });
    }, 400);
  };

  const handleSaveGeneratedPiece = () => {
    const newPiece: ThreePieceItem = {
      id: `piece-${Date.now()}`,
      name: modelName,
      category: modelCategory,
      sourceImage: selectedImage,
      modelUrl: '/models/custom.glb',
      generator: 'Forge3D NeRF / Voxel Engine v2.4',
      size: '1x1',
      updatedAt: new Date().toISOString().split('T')[0],
      tags: [modelCategory, 'AI-Generated', 'Watertight-Mesh'],
      description: `3D miniature synthesized from concept artwork for tabletop play and 3D printing.`,
    };

    savePiece(newPiece);
    setMasterCrafterView('gallery');
    setNewPieceDoor('pick');
    setGeneratedModelReady(false);
    setGenerationProgress(0);
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=400&q=80',
  ];

  const filteredPieces = pieces.filter((p) => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {masterCrafterView === 'new-flow' ? (
        /* NEW PIECE FLOW: Two Doors ("From image" and "From pack") */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setMasterCrafterView('gallery');
                  setNewPieceDoor('pick');
                }}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="font-display font-bold text-xl text-zinc-100">Forge New 3D Piece</h1>
                <p className="text-xs text-zinc-400">Synthesize 3D tabletop miniatures from 2D concepts or customize stock packs</p>
              </div>
            </div>

            <span className="text-xs font-mono-code text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              3D Neural Forge
            </span>
          </div>

          {newPieceDoor === 'pick' ? (
            /* The Two Doors Selection */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Door 1: From image */}
              <div
                onClick={() => setNewPieceDoor('image')}
                className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#1e1c18] via-[#1a1a1c] to-[#121214] border-2 border-amber-500/30 hover:border-amber-400 p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-mono-code text-amber-400 uppercase font-semibold">
                      Door 01 • Image to 3D
                    </span>
                    <h3 className="font-display text-2xl font-bold text-zinc-100 group-hover:text-amber-300 transition-colors mt-1">
                      From Image
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Upload or choose any 2D character portrait, weapon sketch, or monster illustration. Our neural mesher generates a full 3D watertight model.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>Enter Image Mesher →</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Door 2: From pack */}
              <div
                onClick={() => setNewPieceDoor('pack')}
                className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#161c22] via-[#1a1a1c] to-[#121214] border-2 border-blue-500/30 hover:border-blue-400 p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xl"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-mono-code text-blue-400 uppercase font-semibold">
                      Door 02 • Standard Packs
                    </span>
                    <h3 className="font-display text-2xl font-bold text-zinc-100 group-hover:text-blue-300 transition-colors mt-1">
                      From Pack
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Browse curated standard tabletop packs (Paladins, Mimics, Portals, Gargoyles). Pick a template, customize materials & colors, and save to Keep.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-blue-400 font-semibold">
                  <span>Browse Asset Packs →</span>
                  <FolderPlus className="w-4 h-4" />
                </div>
              </div>
            </div>
          ) : newPieceDoor === 'image' ? (
            /* FROM IMAGE FLOW: upload/pick → progress bar → 3D spinning preview appears */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Config: 6 cols */}
              <div className="lg:col-span-6 rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <span className="text-xs font-mono-code font-semibold tracking-wider text-zinc-400 uppercase">
                    INPUT 2D CONCEPT
                  </span>
                  <button
                    onClick={() => setNewPieceDoor('pick')}
                    className="text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Switch Door
                  </button>
                </div>

                {/* Upload drag drop zone & sample images */}
                <div>
                  <label className="text-xs text-zinc-300 font-medium block mb-2">
                    Upload Concept or Pick Sample
                  </label>

                  <div className="w-full h-36 rounded-xl border-2 border-dashed border-zinc-700 hover:border-amber-400 bg-zinc-900/60 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors mb-3">
                    <Upload className="w-6 h-6 text-amber-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-200">Drag & Drop Image File</span>
                    <span className="text-[10px] text-zinc-500 font-mono-code mt-0.5">PNG, JPG, WEBP up to 25MB</span>
                  </div>

                  {/* Sample thumbs */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono-code text-zinc-500">Presets:</span>
                    {sampleImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === img ? 'border-amber-400 scale-105 shadow-md' : 'border-zinc-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="sample" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Piece Info Fields */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Piece Name</label>
                    <input
                      type="text"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Category</label>
                      <select
                        value={modelCategory}
                        onChange={(e) => setModelCategory(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                      >
                        <option value="Avatars">Avatars</option>
                        <option value="Items">Items</option>
                        <option value="Effects">Effects</option>
                        <option value="Buildings">Buildings</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Grid Base</label>
                      <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-code text-amber-400">
                        1x1 Standard (25mm)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button & Progress Bar */}
                <div className="pt-2">
                  {!generatedModelReady ? (
                    <div>
                      <button
                        onClick={handleStartGeneration}
                        disabled={isGenerating}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-500/20"
                      >
                        <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span>{isGenerating ? 'Synthesizing 3D Geometry...' : 'Generate 3D Model'}</span>
                      </button>

                      {isGenerating && (
                        <div className="mt-3 space-y-1.5">
                          <div className="flex justify-between text-[11px] font-mono-code text-zinc-400">
                            <span>
                              {generationProgress < 35
                                ? 'Analyzing silhouette...'
                                : generationProgress < 75
                                ? 'Sculpting watertight voxel mesh...'
                                : 'Generating PBR normal textures...'}
                            </span>
                            <span className="text-amber-400">{generationProgress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              style={{ width: `${generationProgress}%` }}
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleSaveGeneratedPiece}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Piece to Keep</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right 3D Spinning Preview Stage: 6 cols */}
              <div className="lg:col-span-6 rounded-2xl bg-[#141416] border border-zinc-800 p-6 flex flex-col items-center justify-between min-h-[480px]">
                <div className="w-full flex items-center justify-between text-[10px] font-mono-code text-zinc-400">
                  <span className="uppercase text-amber-400 font-semibold">3D NEURAL PREVIEW</span>
                  <span>{generatedModelReady ? 'Ready for Tabletop' : 'Awaiting Synthesis'}</span>
                </div>

                <div className="w-full h-72 flex items-center justify-center my-4">
                  {generatedModelReady ? (
                    <ThreeCanvas modelType="gargoyle" spinning={true} className="w-full h-full" />
                  ) : (
                    <div className="text-center text-zinc-500 p-6">
                      <Box className="w-12 h-12 mx-auto mb-2 text-zinc-600 animate-pulse" />
                      <p className="text-xs font-semibold text-zinc-400">Click "Generate 3D Model" to begin</p>
                      <p className="text-[10px] mt-1 text-zinc-600">Extracting normal maps and watertight manifold geometry</p>
                    </div>
                  )}
                </div>

                <div className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Export formats: <strong>.STL, .OBJ, .GLTF</strong></span>
                  <span className="text-emerald-400 font-mono-code">VTT Snap Ready</span>
                </div>
              </div>
            </div>
          ) : (
            /* FROM PACK FLOW: Browse standard packs, customize, save */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-zinc-400">
                  Select a template from standard tabletop packs
                </span>
                <button
                  onClick={() => setNewPieceDoor('pick')}
                  className="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Switch Door
                </button>
              </div>

              <div className="space-y-6">
                {standardPacks.map((pack) => (
                  <div key={pack.id} className="rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <div>
                        <h3 className="font-display font-bold text-sm text-zinc-100">{pack.name}</h3>
                        <span className="text-[10px] font-mono-code text-blue-400">{pack.category} Pack</span>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono-code">{pack.models.length} Models</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {pack.models.map((mod, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            const newPiece: ThreePieceItem = {
                              id: `piece-${Date.now()}`,
                              name: mod.name,
                              category: pack.category,
                              sourceImage: mod.preview,
                              modelUrl: `/models/${mod.type}.glb`,
                              generator: 'Standard Demi Pack Assets',
                              size: '1x1',
                              updatedAt: new Date().toISOString().split('T')[0],
                              tags: [pack.category, 'Standard-Pack'],
                              description: `Pre-rigged tabletop piece from ${pack.name}.`,
                            };
                            savePiece(newPiece);
                            setMasterCrafterView('gallery');
                            setNewPieceDoor('pick');
                          }}
                          className="group cursor-pointer rounded-xl bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-blue-400 p-3 flex items-center justify-between transition-all"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                              <img src={mod.preview} alt={mod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-zinc-200 group-hover:text-blue-300 block">
                                {mod.name}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono-code">Standard Pack</span>
                            </div>
                          </div>

                          <span className="text-xs text-blue-400 group-hover:underline font-semibold shrink-0">
                            + Add
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* HOME VIEW: Gallery of 3D pieces, filter by type, "New piece" button */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="font-display font-bold text-xl text-zinc-100">3D Miniature Gallery</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Inspect 3D physical-style models, download watertight STLs, or assign tokens to campaigns.
              </p>
            </div>

            <button
              onClick={() => {
                setMasterCrafterView('new-flow');
                setNewPieceDoor('pick');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>New Piece</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="text-zinc-500 text-[11px] font-mono-code mr-1">Category:</span>
            {['All', 'Avatars', 'Items', 'Effects', 'Buildings'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-mono-code transition-colors ${
                  categoryFilter === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 3D Pieces Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPieces.map((piece) => (
              <div
                key={piece.id}
                onClick={() => openPieceViewer(piece.id)}
                className="group cursor-pointer rounded-2xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800 hover:border-amber-500/50 p-4 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 shadow-md"
              >
                <div>
                  {/* Miniature 3D Thumbnail Container */}
                  <div className="w-full h-44 rounded-xl bg-[#121214] border border-zinc-800 group-hover:border-amber-500/30 overflow-hidden relative mb-3 flex items-center justify-center">
                    <img
                      src={piece.sourceImage}
                      alt={piece.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 font-mono-code text-[10px] text-amber-400 border border-zinc-700">
                      {piece.category}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-zinc-900/90 text-[10px] font-mono-code text-zinc-300 border border-zinc-700 flex items-center space-x-1">
                      <span>3D Model</span>
                    </div>
                  </div>

                  <h3 className="font-display text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors truncate">
                    {piece.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono-code mt-0.5">
                    {piece.generator.split(' ')[0]} • Base {piece.size}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono-code text-[10px]">{piece.updatedAt}</span>
                  <span className="text-amber-400 font-semibold group-hover:underline">View 3D →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
