import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cpu, 
  HardDrive, 
  Keyboard, 
  User, 
  Sliders, 
  Sparkles, 
  Download, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Terminal, 
  Palette, 
  Compass, 
  Activity,
  Zap
} from 'lucide-react';
import { MapEngine } from '../../types';

export const EngineRoom: React.FC = () => {
  const { 
    aiStatus, 
    setAiStatus, 
    cards, 
    decks, 
    maps, 
    pieces, 
    campaigns, 
    showToast 
  } = useApp();

  const [activeTheme, setActiveTheme] = useState('Obsidian Ember');
  const [gridDefault, setGridDefault] = useState<'Square' | 'Hexagonal' | 'Isometric'>('Square');
  const [engineDefault, setEngineDefault] = useState<MapEngine>('Mipui');
  const [isExporting, setIsExporting] = useState(false);

  // Total items calculation
  const totalItemsCount = cards.length + decks.length + maps.length + pieces.length + campaigns.length;

  const handleExportLibrary = () => {
    setIsExporting(true);
    setTimeout(() => {
      const exportData = {
        meta: {
          app: 'Demi Forge Tabletop Creation Platform',
          exportDate: new Date().toISOString(),
          version: '2.4.0',
          tier: 'Forge Master'
        },
        cards,
        decks,
        maps,
        pieces,
        campaigns
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `demi-forge-library-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setIsExporting(false);
      showToast(`Exported all ${totalItemsCount} artifacts as JSON bundle!`);
    }, 600);
  };

  const keybindings = [
    { key: '1 – 6', action: 'Quick-jump between Demi Forge rooms' },
    { key: 'Ctrl + S', action: 'Quick save active card / map' },
    { key: 'Ctrl + Z', action: 'Undo last map placement / token edit' },
    { key: 'Ctrl + Y', action: 'Redo last action' },
    { key: 'Space + Drag', action: 'Pan tactical battlemap surface' },
    { key: 'D', action: 'Quick-roll standard d20 in Campaign Command' },
    { key: 'W', action: 'Toggle solid / wireframe in 3D Master Crafter' },
    { key: 'Esc', action: 'Close inspection modal or full-screen view' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Room Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#18161e] via-[#1a1a1c] to-[#12141a] border border-zinc-800 p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-zinc-400 text-xs font-mono-code uppercase font-semibold">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Room 06 • Infrastructure & Preferences</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-zinc-100 mt-1">
            Engine Room
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Configure neural generators, monitor real-time inference latency, customize grid coordinates, and manage whole-vault library exports.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-zinc-900/90 px-4 py-2.5 rounded-2xl border border-zinc-800 text-xs font-mono-code">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-zinc-300">Cluster Status:</span>
          <span className="text-emerald-400 font-bold">100% Operational</span>
        </div>
      </div>

      {/* Top 2 Big Cards: AI Engine Status & Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. AI Engine Status */}
        <div className="rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="font-display font-bold text-base text-zinc-100">AI Neural Engine</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono-code border border-emerald-500/30">
              Online
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400">Currently Loaded Model</span>
              <span className="font-mono-code text-amber-400 font-semibold">{aiStatus.model}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400">Inference Latency</span>
              <span className="font-mono-code text-zinc-200 font-bold">{aiStatus.latency}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
              <span className="text-zinc-400">Dispatch Queue Depth</span>
              <span className="font-mono-code text-zinc-200">{aiStatus.queueDepth} Tasks Waiting</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-400">Mesh Reconstruction Cache</span>
              <span className="font-mono-code text-emerald-400 font-semibold">{aiStatus.memoryUsed} VRAM</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setAiStatus({
                  ...aiStatus,
                  latency: `${(Math.random() * 20 + 35).toFixed(0)}ms`,
                  queueDepth: 0
                });
                showToast('Flushed neural inference cache and warmed tensors.');
              }}
              className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono-code text-xs border border-zinc-700 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Flush Engine Cache</span>
            </button>
          </div>
        </div>

        {/* 2. Storage Stats & Export Whole Library */}
        <div className="rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-6 space-y-4 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5 text-blue-400" />
                <h2 className="font-display font-bold text-base text-zinc-100">Storage & Backup</h2>
              </div>
              <span className="text-xs font-mono-code text-zinc-400">Cloud Sync Ready</span>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-zinc-400">Total Created Artifacts</span>
                <strong className="font-mono-code text-zinc-100">{totalItemsCount} Files</strong>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-zinc-400">Local Cache Estimated Disk</span>
                <strong className="font-mono-code text-amber-400">142.8 MB</strong>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-mono-code text-zinc-400">
                  <span>Vault Allocation</span>
                  <span className="text-blue-400 font-bold">48.2 GB / 100 GB</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                  <div className="w-[48%] h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <button
              onClick={handleExportLibrary}
              disabled={isExporting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-amber-500 hover:from-blue-400 hover:to-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-500/10"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Packaging Archive...' : 'Export Entire Library (JSON)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Info & Style Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info: Tier (Forge Master), member since, storage quota bar */}
        <div className="rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-amber-400" />
              <h2 className="font-display font-bold text-base text-zinc-100">Account Credentials</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono-code font-bold text-xs border border-amber-500/40">
              Forge Master Tier
            </span>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
              alt="Archmage Vaelin"
              className="w-14 h-14 rounded-xl object-cover border-2 border-amber-500/60"
            />
            <div>
              <h3 className="font-display font-bold text-sm text-zinc-100">Archmage Vaelin</h3>
              <p className="text-xs text-zinc-400">vaelin@demiforge.tabletop</p>
              <span className="text-[10px] font-mono-code text-zinc-500">Member since: March 2024 (Founder)</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-zinc-400">
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span>Unlimited Card Generation</span>
              <strong className="text-emerald-400">Active</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span>Concurrent 3D Mesh Slots</span>
              <strong className="text-zinc-200">12 Parallel</strong>
            </div>
            <div className="flex justify-between py-1">
              <span>Connected Campaigns Capacity</span>
              <strong className="text-zinc-200">Unlimited</strong>
            </div>
          </div>
        </div>

        {/* Style Preferences: theme overrides, grid defaults, default engine */}
        <div className="rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <h2 className="font-display font-bold text-base text-zinc-100">Design & Engine Defaults</h2>
            </div>
            <span className="text-xs font-mono-code text-zinc-400">Workspace Settings</span>
          </div>

          {/* Theme Overrides */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Visual Theme Palette</label>
            <div className="grid grid-cols-3 gap-2">
              {['Obsidian Ember', 'Dark Void', 'Deep Cobalt'].map((th) => (
                <button
                  key={th}
                  onClick={() => {
                    setActiveTheme(th);
                    showToast(`Active workspace palette: ${th}`);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-mono-code transition-all ${
                    activeTheme === th
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {th}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Defaults */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Default Battlemap Grid Geometry</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Square', 'Hexagonal', 'Isometric'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGridDefault(g);
                    showToast(`Default grid set to ${g}`);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-mono-code transition-all ${
                    gridDefault === g
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Default Engine */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Default Tactical Engine</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mipui', 'Godot', 'Unreal'] as MapEngine[]).map((eng) => (
                <button
                  key={eng}
                  onClick={() => {
                    setEngineDefault(eng);
                    showToast(`Default map engine set to ${eng}`);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-mono-code transition-all ${
                    engineDefault === eng
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {eng}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keybindings / Shortcuts List */}
      <div className="rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-6 space-y-4 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-base text-zinc-100">Keyboard Shortcuts & Hotkeys</h2>
          </div>
          <span className="text-xs font-mono-code text-zinc-500">Pro Power Tools</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {keybindings.map((kb, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between space-y-1.5"
            >
              <kbd className="self-start px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-amber-400 font-mono-code text-[11px] font-bold shadow-xs">
                {kb.key}
              </kbd>
              <p className="text-xs text-zinc-300 leading-tight">{kb.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
