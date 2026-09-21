import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampaignItem } from '../../types';
import { 
  Compass, 
  Shield, 
  Users, 
  Calendar, 
  Play, 
  Plus, 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  Dices, 
  MessageSquare, 
  ListOrdered, 
  Edit3, 
  UserCheck, 
  Skull, 
  Sword, 
  Heart, 
  ShieldAlert, 
  Flame, 
  Sparkles, 
  Check, 
  Send,
  EyeOff,
  Eye
} from 'lucide-react';

export const CampaignCommandRoom: React.FC = () => {
  const { 
    campaigns, 
    campaignView, 
    setCampaignView, 
    editingCampaignId, 
    openCampaignWorkbench, 
    openCampaignPlay, 
    maps, 
    cards, 
    pieces,
    saveCampaign, 
    showToast 
  } = useApp();

  const activeCampaign = campaigns.find((c) => c.id === editingCampaignId) || campaigns[0];

  // Inside Campaign State
  const [activeTab, setActiveTab] = useState<'notes' | 'npcs' | 'encounters'>('notes');
  const [sceneType, setSceneType] = useState<'map' | 'cards'>('map');
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Initiative Tracker State
  const [initiativeList, setInitiativeList] = useState([
    { id: '1', name: 'Valen (Paladin)', init: 19, hp: 42, maxHp: 48, ac: 19, type: 'player', status: 'Blessed' },
    { id: '2', name: 'Lyra (Rogue)', init: 17, hp: 28, maxHp: 28, ac: 15, type: 'player', status: 'Hidden' },
    { id: '3', name: 'Goblin Warchief', init: 14, hp: 32, maxHp: 32, ac: 16, type: 'monster', status: 'Raging' },
    { id: '4', name: 'Shadow Stalker', init: 8, hp: 18, maxHp: 22, ac: 13, type: 'monster', status: 'Normal' },
  ]);
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);

  // Dice Roller State
  const [recentRolls, setRecentRolls] = useState<Array<{ die: string; result: number; total: number; modifier: number }>>([
    { die: 'd20', result: 18, total: 23, modifier: 5 },
    { die: '2d6', result: 9, total: 11, modifier: 2 },
  ]);
  const [rollModifier, setRollModifier] = useState<number>(0);

  // Chat/Log State
  const [chatLog, setChatLog] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'GM', text: 'Encounter initiated! Roll initiative.', time: '20:14' },
    { sender: 'Valen', text: 'I raise the Sun Sovereign shield to guard the portal.', time: '20:15' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Editable Session Notes
  const [sessionNotes, setSessionNotes] = useState(activeCampaign.notes);

  // New Campaign Modal
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampName, setNewCampName] = useState('Wrath of the Lich King');
  const [newCampSystem, setNewCampSystem] = useState('D&D 5e');
  const [newCampPlayers, setNewCampPlayers] = useState(5);
  const [newCampDate, setNewCampDate] = useState('Tomorrow, 7:00 PM');

  // Roll Dice Function
  const rollDice = (sides: number, count: number = 1) => {
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += Math.floor(Math.random() * sides) + 1;
    }
    const total = sum + rollModifier;
    const dieLabel = count > 1 ? `${count}d${sides}` : `d${sides}`;
    const newRoll = { die: dieLabel, result: sum, total, modifier: rollModifier };
    setRecentRolls((prev) => [newRoll, ...prev.slice(0, 5)]);

    const rollMsg = `Rolled ${dieLabel}${rollModifier ? (rollModifier > 0 ? ` + ${rollModifier}` : ` - ${Math.abs(rollModifier)}`) : ''}: [${total}]`;
    setChatLog((prev) => [
      ...prev,
      { sender: 'Dice Engine', text: rollMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    showToast(`${dieLabel} Result: ${total}`);
  };

  const handleNextTurn = () => {
    setCurrentTurnIdx((prev) => (prev + 1) % initiativeList.length);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatLog((prev) => [
      ...prev,
      { sender: 'GM', text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatInput('');
  };

  const handleCreateCampaign = () => {
    const created: CampaignItem = {
      id: `camp-${Date.now()}`,
      name: newCampName,
      system: newCampSystem,
      playerCount: newCampPlayers,
      nextSession: newCampDate,
      status: 'Active',
      description: 'New tabletop adventure orchestrated with Demi Forge.',
      notes: 'Initial quest hook: The heroes assemble in the tavern...',
      npcs: ['Barkeep Durgan', 'Captain Mara'],
      encounters: ['Tavern Ambush', 'Crypt Gates'],
      updatedAt: new Date().toISOString().split('T')[0],
      tags: [newCampSystem, 'Active'],
    };
    saveCampaign(created);
    setShowNewCampaignModal(false);
    openCampaignWorkbench(created.id);
  };

  // ═══════════════════════════════════════════════════════════════
  // VIEW 1: HOME (Campaigns List)
  // ═══════════════════════════════════════════════════════════════
  if (campaignView === 'list') {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono-code text-amber-400">
              <Shield className="w-4 h-4" />
              <span>Room 05 • Orchestration & VTT</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-zinc-100 mt-1">
              Campaign Command
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Where games are run. Orchestrate maps, monster cards, and 3D tokens into live tactical sessions.
            </p>
          </div>

          <button
            onClick={() => setShowNewCampaignModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
        </div>

        {/* Active Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              onClick={() => openCampaignWorkbench(camp.id)}
              className="group cursor-pointer rounded-2xl bg-[#1a1a1c] hover:bg-[#202024] border border-zinc-800 hover:border-amber-500/50 p-5 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 shadow-xl"
            >
              <div>
                {/* Header with system badge & status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-mono-code font-semibold">
                    {camp.system}
                  </span>
                  <span className="flex items-center space-x-1 text-[11px] font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{camp.status}</span>
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  {camp.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {camp.description}
                </p>

                {/* Key stats: Players & Next session */}
                <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                      Party Size
                    </span>
                    <strong className="text-zinc-200 font-mono-code">{camp.playerCount} Players</strong>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                      Next Session
                    </span>
                    <span className="text-amber-300 font-semibold">{camp.nextSession}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-mono-code">{camp.encounters.length} Encounters Ready</span>
                <span className="text-xs text-amber-400 font-semibold group-hover:underline flex items-center space-x-1">
                  <span>Enter Command →</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* New Campaign Modal */}
        {showNewCampaignModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[#1c1c20] border-2 border-amber-400 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="font-display font-bold text-lg text-zinc-100">Establish New Campaign</h3>
                <button
                  onClick={() => setShowNewCampaignModal(false)}
                  className="text-zinc-400 hover:text-zinc-200 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Campaign Title</label>
                  <input
                    type="text"
                    value={newCampName}
                    onChange={(e) => setNewCampName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-medium">Rule System</label>
                    <select
                      value={newCampSystem}
                      onChange={(e) => setNewCampSystem(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200"
                    >
                      <option value="D&D 5e">D&D 5e</option>
                      <option value="Pathfinder 2e">Pathfinder 2e</option>
                      <option value="Call of Cthulhu">Call of Cthulhu</option>
                      <option value="Shadowdark">Shadowdark RPG</option>
                      <option value="Custom System">Custom Agnostic System</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 block mb-1 font-medium">Active Players</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={newCampPlayers}
                      onChange={(e) => setNewCampPlayers(parseInt(e.target.value) || 4)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono-code text-amber-400 text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-medium">Next Scheduled Session</label>
                  <input
                    type="text"
                    value={newCampDate}
                    onChange={(e) => setNewCampDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => setShowNewCampaignModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  Launch Campaign Command
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // VIEW 2: INSIDE A CAMPAIGN (Workbench & Live Presentation Mode)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${isPresentationMode ? 'p-3 bg-black' : 'p-6 md:p-8 max-w-7xl mx-auto'}`}>
      {/* Campaign Chrome Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#1a1a1c] border border-zinc-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCampaignView('list')}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-bold text-base text-zinc-100">{activeCampaign.name}</h2>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                {activeCampaign.system}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {activeCampaign.playerCount} Players Connected • Session: {activeCampaign.nextSession}
            </p>
          </div>
        </div>

        {/* Presentation Mode Toggle & Scene Switcher */}
        <div className="flex items-center space-x-2">
          {/* Scene selector */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            <button
              onClick={() => setSceneType('map')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                sceneType === 'map' ? 'bg-amber-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tactical Map
            </button>
            <button
              onClick={() => setSceneType('cards')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                sceneType === 'cards' ? 'bg-amber-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Card Table
            </button>
          </div>

          {/* Launch Session Presentation Mode button */}
          <button
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md ${
              isPresentationMode
                ? 'bg-rose-500 hover:bg-rose-400 text-zinc-950'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950'
            }`}
          >
            {isPresentationMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Presentation</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Launch Session Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* THREE COLUMN ORCHESTRATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT PANEL: Session notes, NPC roster, active encounters (3 cols) */}
        {!isPresentationMode && (
          <div className="lg:col-span-3 rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-4 space-y-4">
            {/* Tab selector */}
            <div className="flex items-center justify-between p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              {(['notes', 'npcs', 'encounters'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1 rounded-lg capitalize font-medium transition-all ${
                    activeTab === tab ? 'bg-zinc-800 text-amber-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 1: Session Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold text-zinc-300">GM Master Scratchpad</span>
                  <span className="text-[10px] font-mono-code text-zinc-500">Autosaved</span>
                </div>
                <textarea
                  rows={14}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-amber-400"
                  placeholder="Record party decisions, secret lore, and loot drops here..."
                />
              </div>
            )}

            {/* Tab 2: NPC Roster */}
            {activeTab === 'npcs' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">Campaign NPC Roster</span>
                  <span className="text-[10px] font-mono-code text-amber-400">{activeCampaign.npcs.length} Present</span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {activeCampaign.npcs.map((npc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold font-mono-code">
                          {npc.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-zinc-200 block">{npc}</strong>
                          <span className="text-[10px] text-zinc-500">Key Story Contact</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-amber-400 cursor-pointer hover:underline">Inspect</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Active Encounters */}
            {activeTab === 'encounters' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">Prepared Encounters</span>
                  <span className="text-[10px] font-mono-code text-amber-400">{activeCampaign.encounters.length} Staged</span>
                </div>

                <div className="space-y-2">
                  {activeCampaign.encounters.map((enc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div>
                        <strong className="text-zinc-200 block">{enc}</strong>
                        <span className="text-[10px] text-zinc-500 font-mono-code">CR 4 Skirmish</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        Stage
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CENTER: The current scene (map or card table) (6 cols or 9 if presentation) */}
        <div className={`${isPresentationMode ? 'lg:col-span-9' : 'lg:col-span-6'} rounded-2xl bg-[#0f0f12] border-2 border-zinc-800 p-4 flex flex-col justify-between min-h-[560px] shadow-2xl relative overflow-hidden`}>
          {/* Scene Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
            <div className="flex items-center space-x-2 font-mono-code">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-zinc-200 font-bold">
                {sceneType === 'map' ? 'Active Battlemap: Tavern of the Broken Wheel' : 'Active Card Table: Dragonfire Duel'}
              </span>
            </div>
            <span className="text-[10px] font-mono-code text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Live Session Presentation
            </span>
          </div>

          {/* Render Scene Surface */}
          {sceneType === 'map' ? (
            /* Tactical Map Grid with Active Miniatures */
            <div className="my-4 flex-1 flex items-center justify-center p-2 overflow-auto">
              <div 
                className="grid grid-cols-8 grid-rows-6 gap-1 p-3 rounded-xl bg-[#16161a] border-2 border-zinc-700 shadow-2xl relative"
                style={{
                  backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              >
                {Array.from({ length: 48 }).map((_, i) => {
                  const x = i % 8;
                  const y = Math.floor(i / 8);

                  // Place some tokens on cells
                  const isValen = x === 2 && y === 2;
                  const isLyra = x === 3 && y === 1;
                  const isWarchief = x === 6 && y === 4;
                  const isShadow = x === 5 && y === 5;
                  const isChest = x === 7 && y === 1;

                  return (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-lg bg-zinc-900/90 border border-zinc-800/80 hover:border-amber-400 flex items-center justify-center relative group cursor-pointer transition-all hover:scale-105"
                      onClick={() => showToast(`Selected Token at grid [${x}, ${y}]`)}
                    >
                      {isValen && (
                        <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-amber-400 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/30">
                          V
                        </div>
                      )}
                      {isLyra && (
                        <div className="w-9 h-9 rounded-full bg-purple-600 border-2 border-zinc-200 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          L
                        </div>
                      )}
                      {isWarchief && (
                        <div className="w-10 h-10 rounded-full bg-rose-700 border-2 border-amber-400 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-rose-500/30">
                          GW
                        </div>
                      )}
                      {isShadow && (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-rose-500 flex items-center justify-center text-xs font-bold text-rose-300">
                          S
                        </div>
                      )}
                      {isChest && (
                        <div className="text-amber-400 text-sm font-bold animate-bounce">
                          ★
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Card Table Playmat Surface */
            <div className="my-4 flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-xl p-6 rounded-3xl bg-gradient-to-br from-[#18181c] to-[#121214] border-2 border-amber-500/40 shadow-2xl space-y-6">
                <div className="flex justify-between items-center text-xs font-mono-code text-zinc-400">
                  <span>Opponent Vanguard (3/3 Creatures)</span>
                  <span className="text-rose-400 font-bold">24 HP</span>
                </div>

                <div className="flex justify-center space-x-3">
                  {cards.slice(0, 3).map((c, i) => (
                    <div key={i} className="w-24 h-36 rounded-xl bg-zinc-900 border border-zinc-700 p-2 flex flex-col justify-between text-center shadow-lg">
                      <div className="w-full h-16 rounded overflow-hidden bg-black">
                        <img src={c.artUrl} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-200 truncate">{c.name}</span>
                      <span className="text-[9px] font-mono-code text-amber-400">{c.cost} Mana</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-xs font-mono-code text-zinc-400">
                  <span>Player Battleground</span>
                  <span className="text-blue-400 font-bold">30 HP</span>
                </div>
              </div>
            </div>
          )}

          {/* Scene Footer Bar */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono-code">
            <div className="flex items-center space-x-3">
              <span>Grid: 5 ft / cell</span>
              <span>•</span>
              <span>Dynamic Fog: <strong className="text-emerald-400">Enabled</strong></span>
            </div>

            <button
              onClick={() => showToast('Pinged tactical coordinate on battlemap.')}
              className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 text-[11px]"
            >
              Ping Tabletop
            </button>
          </div>
        </div>

        {/* RIGHT: Initiative tracker, dice roller, chat/log (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl bg-[#1a1a1c] border border-zinc-800 p-4 space-y-5">
          {/* Initiative Tracker */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
              <span className="text-xs font-mono-code font-semibold tracking-wider text-amber-400 uppercase flex items-center">
                <ListOrdered className="w-3.5 h-3.5 mr-1" />
                INITIATIVE TRACKER
              </span>
              <button
                onClick={handleNextTurn}
                className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[10px]"
              >
                Next Turn →
              </button>
            </div>

            <div className="space-y-1.5">
              {initiativeList.map((combatant, idx) => {
                const isTurn = idx === currentTurnIdx;
                return (
                  <div
                    key={combatant.id}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      isTurn
                        ? 'bg-amber-500/20 border-amber-400 text-zinc-100 shadow-md ring-1 ring-amber-400'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className={`w-5 h-5 rounded flex items-center justify-center font-mono-code font-bold text-[10px] ${
                        isTurn ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {combatant.init}
                      </span>
                      <div className="truncate">
                        <span className={`font-semibold block truncate ${isTurn ? 'text-amber-300' : 'text-zinc-200'}`}>
                          {combatant.name}
                        </span>
                        <span className="text-[10px] text-zinc-500">{combatant.status} • AC {combatant.ac}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 font-mono-code text-[11px] shrink-0">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span className="font-bold text-zinc-200">{combatant.hp}</span>
                      <span className="text-zinc-500">/{combatant.maxHp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Dice Roller */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-code font-semibold tracking-wider text-zinc-400 uppercase flex items-center">
                <Dices className="w-3.5 h-3.5 mr-1 text-blue-400" />
                DICE ROLLER
              </span>
              {/* Modifier Input */}
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-zinc-500 text-[10px]">Mod:</span>
                <input
                  type="number"
                  value={rollModifier}
                  onChange={(e) => setRollModifier(parseInt(e.target.value) || 0)}
                  className="w-10 px-1 py-0.5 rounded bg-zinc-900 border border-zinc-700 font-mono-code text-center text-amber-400 text-[11px]"
                />
              </div>
            </div>

            {/* Dice Buttons: d4, d6, d8, d10, d12, d20, d100 */}
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
                <button
                  key={sides}
                  onClick={() => rollDice(sides)}
                  className="py-1.5 rounded-lg bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 border border-zinc-800 text-zinc-300 font-mono-code font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  d{sides}
                </button>
              ))}
              <button
                onClick={() => rollDice(6, 2)}
                className="py-1.5 rounded-lg bg-zinc-900 hover:bg-blue-500 hover:text-zinc-950 border border-zinc-800 text-zinc-300 font-mono-code font-bold text-xs transition-all hover:scale-105"
              >
                2d6
              </button>
            </div>

            {/* Last Rolls Pill History */}
            <div className="flex items-center space-x-1.5 overflow-x-auto text-[10px] font-mono-code text-zinc-400">
              <span className="text-zinc-500">History:</span>
              {recentRolls.map((r, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300">
                  {r.die}→<strong>{r.total}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Session Chat / Log */}
          <div className="pt-2 border-t border-zinc-800">
            <span className="text-xs font-mono-code font-semibold tracking-wider text-zinc-400 uppercase flex items-center mb-2">
              <MessageSquare className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              TABLETOP LOG & CHAT
            </span>

            <div className="h-28 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono-code mb-2">
              {chatLog.map((msg, i) => (
                <div key={i} className="text-[11px] leading-tight">
                  <span className="text-zinc-500 text-[9px] mr-1">[{msg.time}]</span>
                  <strong className="text-amber-400 mr-1">{msg.sender}:</strong>
                  <span className="text-zinc-300">{msg.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex space-x-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Broadcast as GM..."
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
