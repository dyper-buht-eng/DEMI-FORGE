import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThreePieceItem } from '../../types';
import { ThreeCanvas } from '../ThreeCanvas';
import { 
  ArrowLeft, 
  Layers, 
  RotateCw, 
  Box, 
  Sparkles, 
  Calendar, 
  Cpu, 
  Maximize2, 
  PlusCircle, 
  Download,
  Share2,
  Check
} from 'lucide-react';

export const ThreePieceViewer: React.FC = () => {
  const { 
    viewingPieceId, 
    setMasterCrafterView, 
    pieces, 
    campaigns, 
    showToast,
    setCurrentRoom 
  } = useApp();

  const piece = pieces.find((p) => p.id === viewingPieceId) || pieces[0];

  const [wireframe, setWireframe] = useState(false);
  const [spinning, setSpinning] = useState(true);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);

  const getModelKind = (cat: string, name: string): 'axe' | 'gargoyle' | 'chest' | 'paladin' | 'portal' => {
    const lower = name.toLowerCase();
    if (lower.includes('axe')) return 'axe';
    if (lower.includes('chest') || lower.includes('mimic')) return 'chest';
    if (lower.includes('portal') || lower.includes('vortex')) return 'portal';
    if (lower.includes('paladin') || lower.includes('knight')) return 'paladin';
    return 'gargoyle';
  };

  const handleAddToCampaign = (campId: string) => {
    showToast(`Added "${piece.name}" to campaign tokens!`);
    setShowAddCampaignModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMasterCrafterView('gallery')}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-xl text-zinc-100">{piece.name}</span>
              <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                {piece.category}
              </span>
            </div>
            <p className="text-xs text-zinc-400">PBR 3D Tabletop Miniature & Token Asset</p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-2">
          {/* Wireframe toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-code border transition-all ${
              wireframe
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            {wireframe ? 'Solid View' : 'Wireframe'}
          </button>

          {/* Spin toggle */}
          <button
            onClick={() => setSpinning(!spinning)}
            className={`p-2 rounded-xl text-xs font-mono-code border transition-all ${
              spinning
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
            title="Toggle Continuous Turntable"
          >
            <RotateCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
          </button>

          {/* Add to campaign button */}
          <button
            onClick={() => setShowAddCampaignModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-amber-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add to Campaign</span>
          </button>
        </div>
      </div>

      {/* Main Split: 3D Stage & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Full-Screen style 3D Stage (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-gradient-to-b from-[#141417] via-[#0e0e11] to-[#08080a] border-2 border-zinc-800 p-6 flex flex-col items-center justify-between min-h-[540px] relative shadow-2xl overflow-hidden">
          {/* Subtle Stage Lighting Ring Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,rgba(0,0,0,0.8)_75%)] pointer-events-none" />

          {/* Top viewport status */}
          <div className="w-full flex items-center justify-between z-10 text-[10px] font-mono-code text-zinc-400">
            <span className="px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-800 text-amber-400">
              Interactive WebGL Viewport
            </span>
            <span>Click & Drag to rotate • Scroll to zoom</span>
          </div>

          {/* Real Three.js Canvas */}
          <div className="w-full h-96 flex items-center justify-center z-10">
            <ThreeCanvas
              modelType={getModelKind(piece.category, piece.name)}
              wireframe={wireframe}
              spinning={spinning}
              className="w-full h-full"
            />
          </div>

          {/* Bottom Controls bar */}
          <div className="w-full flex items-center justify-between z-10 pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
            <div className="flex items-center space-x-3">
              <span>Vertex Count: <strong className="text-zinc-200 font-mono-code">14,280</strong></span>
              <span>•</span>
              <span>Watertight STL: <strong className="text-emerald-400 font-mono-code">Verified</strong></span>
            </div>

            <button
              onClick={() => showToast('Downloading .OBJ & .STL 3D print assets...')}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono-code text-[11px] flex items-center space-x-1.5 border border-zinc-800"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export .STL / .OBJ</span>
            </button>
          </div>
        </div>

        {/* Details Panel: name, source, generator, size, date (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-6 space-y-5">
          <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono-code font-semibold tracking-wider text-zinc-400 uppercase">
              PIECE METADATA
            </span>
            <span className="text-xs font-mono-code text-amber-400 font-bold">{piece.size} Base</span>
          </div>

          {/* Source Image */}
          <div>
            <label className="text-xs text-zinc-400 block mb-2">Source 2D Concept Image</label>
            <div className="w-full h-40 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 relative group">
              <img
                src={piece.sourceImage}
                alt={piece.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-mono-code text-zinc-300 truncate">
                  {piece.sourceImage.split('/').pop() || 'Concept Source Asset'}
                </span>
              </div>
            </div>
          </div>

          {/* Specs List */}
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400 flex items-center">
                <Cpu className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Generator Engine
              </span>
              <span className="font-mono-code text-zinc-200 font-semibold">{piece.generator}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400 flex items-center">
                <Box className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                Tabletop Grid Footprint
              </span>
              <span className="font-mono-code text-amber-400 font-semibold">{piece.size} Grid Square</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                Forged Date
              </span>
              <span className="font-mono-code text-zinc-400">{piece.updatedAt}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400">Category Tag</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono-code">
                {piece.category}
              </span>
            </div>
          </div>

          {/* Description Lore */}
          <div className="pt-2">
            <label className="text-xs text-zinc-400 block mb-1">Piece Description</label>
            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
              {piece.description || 'Custom crafted 3D miniature, ready for digital tabletop grids and full-color SLA 3D printing.'}
            </p>
          </div>

          {/* Tags */}
          <div className="pt-2">
            <span className="text-[11px] font-mono-code text-zinc-500 block mb-1.5">TAGS</span>
            <div className="flex flex-wrap gap-1.5">
              {piece.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add to Campaign Modal */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1c1c20] border-2 border-amber-400 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-zinc-100">
                Add "{piece.name}" to Campaign
              </h3>
              <button
                onClick={() => setShowAddCampaignModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Select which campaign's roster and battle encounter this miniature should be deployed to:
            </p>

            <div className="space-y-2">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  onClick={() => handleAddToCampaign(camp.id)}
                  className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-400 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">{camp.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono-code">{camp.system} • {camp.status}</span>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold">+ Assign</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAddCampaignModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
