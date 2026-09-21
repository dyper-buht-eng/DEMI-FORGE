import React from 'react';
import { 
  UserCircle, 
  Layers, 
  Sparkles, 
  Compass, 
  Scroll, 
  Cpu, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Hammer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoomId } from '../types';

export const Sidebar: React.FC<{ collapsed: boolean; setCollapsed: (val: boolean) => void }> = ({
  collapsed,
  setCollapsed
}) => {
  const { currentRoom, setRoom, cards, decks, maps, pieces, campaigns } = useApp();

  const totalKeepCount = cards.length + decks.length + maps.length + pieces.length;

  const rooms: Array<{
    id: RoomId;
    label: string;
    sublabel: string;
    roomNumber: number;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    accentColor: string;
  }> = [
    {
      id: 'profile',
      label: 'Profile',
      sublabel: 'User Hub & Stats',
      roomNumber: 1,
      icon: UserCircle,
      accentColor: 'text-zinc-400 group-hover:text-zinc-200',
    },
    {
      id: 'keep',
      label: 'The Keep',
      sublabel: 'Vault & Archives',
      roomNumber: 2,
      icon: Layers,
      badge: totalKeepCount,
      accentColor: 'text-amber-400 group-hover:text-amber-300',
    },
    {
      id: 'creation',
      label: 'Creation Station',
      sublabel: 'Cards & Decks',
      roomNumber: 3,
      icon: Sparkles,
      badge: cards.length + decks.length,
      accentColor: 'text-orange-400 group-hover:text-orange-300',
    },
    {
      id: 'realm',
      label: 'Realm Crafter',
      sublabel: 'Maps & 3D Minis',
      roomNumber: 4,
      icon: Compass,
      badge: maps.length + pieces.length,
      accentColor: 'text-blue-400 group-hover:text-blue-300',
    },
    {
      id: 'campaign',
      label: 'Campaign Command',
      sublabel: 'Encounter Forge',
      roomNumber: 5,
      icon: Scroll,
      badge: campaigns.length,
      accentColor: 'text-emerald-400 group-hover:text-emerald-300',
    },
    {
      id: 'engine',
      label: 'Engine Room',
      sublabel: 'AI & Pipeline',
      roomNumber: 6,
      icon: Cpu,
      badge: 'LIVE',
      accentColor: 'text-cyan-400 group-hover:text-cyan-300',
    },
  ];

  return (
    <aside 
      className={`border-r border-[#27272a] bg-[#141416] flex flex-col justify-between transition-all duration-200 select-none z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-2 py-2 text-[11px] font-mono-code font-semibold tracking-wider text-zinc-500 uppercase flex items-center justify-between">
          {!collapsed && <span>ROOMS & STUDIOS</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 ml-auto transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {rooms.map((room) => {
          const Icon = room.icon;
          const isActive = currentRoom === room.id;

          return (
            <button
              key={room.id}
              onClick={() => setRoom(room.id)}
              className={`w-full group flex items-center rounded-xl p-2.5 text-left transition-all relative ${
                isActive
                  ? 'bg-[#1f1f23] text-zinc-100 shadow-md border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a1c] border border-transparent'
              }`}
              title={collapsed ? `${room.label} (Room ${room.roomNumber})` : undefined}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-amber-500 rounded-r-full" />
              )}

              <div className="flex items-center space-x-3 w-full">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-zinc-800/60 group-hover:bg-zinc-800 text-zinc-400 group-hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono-code text-zinc-500">
                          0{room.roomNumber}
                        </span>
                        <span className="text-xs font-semibold tracking-wide truncate">
                          {room.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500 block truncate">
                        {room.sublabel}
                      </span>
                    </div>

                    {room.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code font-medium ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : typeof room.badge === 'string'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-300'
                        }`}
                      >
                        {room.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom info banner */}
      <div className="p-3 border-t border-[#27272a]/80">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-gradient-to-b from-[#1c1c20] to-[#161618] border border-zinc-800/80 shadow-inner">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
              <Hammer className="w-3.5 h-3.5" />
              <span>Tabletop Engine</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              Tactile dark workshop ready for cards, battlemaps, and 3D printing miniatures.
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono-code text-zinc-500">
              <span>v2.8.4-alpha</span>
              <span className="text-emerald-400 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1"></span>
                WebGL 2.0
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-amber-500/60 py-1">
            <Flame className="w-4 h-4" />
          </div>
        )}
      </div>
    </aside>
  );
};
