import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ProfileRoom } from './components/rooms/ProfileRoom';
import { KeepRoom } from './components/rooms/KeepRoom';
import { CreationStationRoom } from './components/rooms/CreationStationRoom';
import { RealmCrafterRoom } from './components/rooms/RealmCrafterRoom';
import { CampaignCommandRoom } from './components/rooms/CampaignCommandRoom';
import { EngineRoom } from './components/rooms/EngineRoom';
import { RoomId } from './types';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoom, setCurrentRoom, toastMessage } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Keyboard shortcut listener for room jumping (1-6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const roomMap: Record<string, RoomId> = {
        '1': 'profile',
        '2': 'keep',
        '3': 'creation',
        '4': 'realm',
        '5': 'campaign',
        '6': 'engine',
      };

      if (roomMap[e.key]) {
        setCurrentRoom(roomMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentRoom]);

  const renderActiveRoom = () => {
    switch (currentRoom) {
      case 'profile':
        return <ProfileRoom />;
      case 'keep':
        return <KeepRoom />;
      case 'creation':
        return <CreationStationRoom />;
      case 'realm':
        return <RealmCrafterRoom />;
      case 'campaign':
        return <CampaignCommandRoom />;
      case 'engine':
        return <EngineRoom />;
      default:
        return <ProfileRoom />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f0f10] text-zinc-100 antialiased select-none font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main App Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header Bar */}
        <TopBar />

        {/* Room Scrollable Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {renderActiveRoom()}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex items-center space-x-2.5 px-4 py-3 rounded-xl bg-[#1e1e22] text-zinc-100 border border-amber-500/40 shadow-2xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
