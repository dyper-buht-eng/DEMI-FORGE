import React, { useState } from 'react';
import { 
  Anvil, 
  ChevronRight, 
  Sparkles, 
  Bell, 
  Search, 
  LogOut, 
  ShieldCheck, 
  Cpu, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { USER_PROFILE } from '../data/mockData';

export const TopBar: React.FC = () => {
  const { currentRoom, setRoom, aiStatus, aiProvider, showToast } = useApp();
  const [showAiPopover, setShowAiPopover] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roomNames: Record<string, { title: string; subtitle: string }> = {
    profile: { title: 'User Profile & Hub', subtitle: 'Overview' },
    keep: { title: 'The Keep', subtitle: 'Asset Archives & Vault' },
    creation: { title: 'Creation Station', subtitle: 'Cards & Decks Foundry' },
    realm: { title: 'Realm Crafter', subtitle: 'Tactical Maps & 3D Minis' },
    campaign: { title: 'Campaign Command', subtitle: 'Encounter Orchestrator' },
    engine: { title: 'Engine Room', subtitle: 'AI Compute & Pipeline Config' },
  };

  const statusValue = typeof aiStatus === 'string' ? aiStatus : aiStatus.status;

  const getAiStatusColor = () => {
    switch (statusValue) {
      case 'Live':
        return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      case 'Offline':
        return 'bg-rose-500';
      case 'Needs key':
        return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'Needs setup':
        return 'bg-blue-500';
      default:
        return 'bg-zinc-500';
    }
  };

  return (
    <header className="h-14 border-b border-[#27272a] bg-[#141416]/95 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Brand & Room title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div 
          onClick={() => setRoom('profile')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 via-[#1f1f23] to-[#121214] border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors shadow-inner">
            <Anvil className="w-4 h-4 text-amber-400 transform group-hover:-rotate-6 transition-transform" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-bold text-sm tracking-wider text-zinc-100 group-hover:text-amber-300 transition-colors">
              DEMI FORGE
            </span>
            <span className="text-[10px] text-zinc-500 block -mt-1 font-mono-code uppercase tracking-wider">
              Tabletop Platform
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

        {/* Breadcrumb */}
        <div className="flex items-center text-xs space-x-1.5 text-zinc-400">
          <span className="hidden md:inline hover:text-zinc-300 cursor-pointer" onClick={() => setRoom('profile')}>
            Studio
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 hidden md:inline" />
          <span className="text-zinc-200 font-semibold px-2 py-0.5 rounded bg-zinc-800/60 border border-zinc-700/50">
            {roomNames[currentRoom]?.title || 'Studio'}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Global AI Status Indicator */}
        <div className="relative">
          <button
            onClick={() => setShowAiPopover(!showAiPopover)}
            className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-all hover:bg-zinc-800/80"
            title="Click for AI engine status"
          >
            <span className="relative flex h-2 w-2">
              {statusValue === 'Live' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${getAiStatusColor()}`} />
            </span>
            <span className="font-mono-code text-[11px] text-zinc-300">
              AI: {statusValue}
            </span>
            <Sparkles className="w-3 h-3 text-amber-400/80 ml-0.5" />
          </button>

          {/* AI Popover */}
          {showAiPopover && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#1a1a1c] border border-zinc-700 shadow-2xl p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-zinc-200">Demi Neural Core</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono-code">
                  {aiProvider}
                </span>
              </div>
              <p className="text-zinc-400 mb-3 leading-relaxed">
                State: <strong className="text-zinc-200">{statusValue}</strong>. Generates rules text, tactical maps, 3D meshes, and card art.
              </p>
              <div className="space-y-1.5 bg-zinc-900/80 rounded-lg p-2.5 border border-zinc-800 text-[11px] font-mono-code text-zinc-400">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="text-zinc-200">{aiProvider} (Gemini Pro / Local)</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-emerald-400">24ms (Synthesizer Ready)</span>
                </div>
                <div className="flex justify-between">
                  <span>VRAM Allocated:</span>
                  <span className="text-blue-400">14.8 GB</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    setShowAiPopover(false);
                    setRoom('engine');
                  }}
                  className="w-full text-center py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-medium text-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                  Configure in Engine Room
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Notification Bell */}
        <button
          onClick={() => showToast('All local asset caches up to date with The Keep')}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User avatar menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all group"
          >
            <span className="text-xs text-zinc-300 font-medium hidden lg:inline max-w-[120px] truncate">
              {USER_PROFILE.name}
            </span>
            <img
              src={USER_PROFILE.avatarUrl}
              alt={USER_PROFILE.name}
              className="w-7 h-7 rounded-full object-cover border border-amber-500/40 group-hover:border-amber-400"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1a1a1c] border border-zinc-700 shadow-2xl p-2 text-xs z-50">
              <div className="px-3 py-2 border-b border-zinc-800">
                <p className="font-semibold text-zinc-100">{USER_PROFILE.name}</p>
                <p className="text-[11px] text-amber-400/90 font-mono-code">{USER_PROFILE.handle}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{USER_PROFILE.title}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setRoom('profile');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 transition-colors flex items-center justify-between"
                >
                  <span>Profile Overview</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setRoom('engine');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 transition-colors flex items-center justify-between"
                >
                  <span>Machine & Engine</span>
                  <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>
              <div className="pt-1 border-t border-zinc-800">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    showToast('Signed out of Demi Forge session (mock)');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
