import React, { createContext, useContext, useState } from 'react';
import { 
  RoomId, 
  CardItem, 
  DeckItem, 
  MapItem, 
  ThreePieceItem, 
  CampaignItem, 
  KeepCategory, 
  AIStatusDetail,
  AIProvider 
} from '../types';
import { 
  INITIAL_CARDS, 
  INITIAL_DECKS, 
  INITIAL_MAPS, 
  INITIAL_PIECES, 
  INITIAL_CAMPAIGNS 
} from '../data/mockData';

interface AppContextType {
  // Navigation
  currentRoom: RoomId;
  setRoom: (room: RoomId) => void;
  setCurrentRoom: (room: RoomId) => void;

  // Data Store
  cards: CardItem[];
  decks: DeckItem[];
  maps: MapItem[];
  pieces: ThreePieceItem[];
  campaigns: CampaignItem[];

  // Mutations
  saveCard: (card: CardItem) => void;
  deleteCard: (id: string) => void;
  saveDeck: (deck: DeckItem) => void;
  deleteDeck: (id: string) => void;
  saveMap: (map: MapItem) => void;
  deleteMap: (id: string) => void;
  savePiece: (piece: ThreePieceItem) => void;
  deletePiece: (id: string) => void;
  saveCampaign: (campaign: CampaignItem) => void;
  deleteCampaign: (id: string) => void;

  // The Keep Navigation
  keepView: 'list' | 'room';
  setKeepView: (view: 'list' | 'room') => void;
  keepCategory: KeepCategory;
  setKeepCategory: (cat: KeepCategory) => void;
  selectedDetailItem: { type: 'card' | 'deck' | 'map' | 'piece' | 'campaign'; item: any } | null;
  setSelectedDetailItem: (item: { type: 'card' | 'deck' | 'map' | 'piece' | 'campaign'; item: any } | null) => void;

  // Creation Station Navigation
  creationMode: 'home' | 'card-editor' | 'deck-editor';
  setCreationMode: (mode: 'home' | 'card-editor' | 'deck-editor') => void;
  editingCardId: string | null;
  setEditingCardId: (id: string | null) => void;
  editingDeckId: string | null;
  setEditingDeckId: (id: string | null) => void;
  openCardEditor: (id?: string) => void;
  openDeckEditor: (id?: string) => void;

  // Realm Crafter Navigation
  realmFunction: 'runner' | 'crafter';
  setRealmFunction: (fn: 'runner' | 'crafter') => void;
  realmMode: 'runner' | 'crafter';
  setRealmMode: (fn: 'runner' | 'crafter') => void;
  realmRunnerView: 'gallery' | 'new-flow' | 'templates' | 'editor';
  setRealmRunnerView: (v: 'gallery' | 'new-flow' | 'templates' | 'editor') => void;
  editingMapId: string | null;
  openMapEditor: (id?: string) => void;
  openNewMapFlow: () => void;

  // Master Crafter Navigation
  masterCrafterView: 'gallery' | 'new-flow' | 'viewer';
  setMasterCrafterView: (v: 'gallery' | 'new-flow' | 'viewer') => void;
  activePieceId: string | null;
  viewingPieceId: string | null;
  openPieceViewer: (id: string) => void;
  openNewPieceFlow: () => void;

  // Campaign Command Navigation
  campaignView: 'list' | 'gallery' | 'workbench' | 'detail' | 'play';
  setCampaignView: (v: 'list' | 'gallery' | 'workbench' | 'detail' | 'play') => void;
  activeCampaignId: string | null;
  editingCampaignId: string | null;
  openCampaignWorkbench: (id?: string) => void;
  openCampaignDetail: (id: string) => void;
  openCampaignPlay: (id: string) => void;

  // AI Configuration
  aiProvider: AIProvider;
  setAiProvider: (p: AIProvider) => void;
  aiStatus: AIStatusDetail;
  setAiStatus: (s: AIStatusDetail) => void;
  aiApiKey: string;
  setAiApiKey: (k: string) => void;

  // Toast Notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoom, setRoom] = useState<RoomId>('profile');

  const [cards, setCards] = useState<CardItem[]>(INITIAL_CARDS);
  const [decks, setDecks] = useState<DeckItem[]>(INITIAL_DECKS);
  const [maps, setMaps] = useState<MapItem[]>(INITIAL_MAPS);
  const [pieces, setPieces] = useState<ThreePieceItem[]>(INITIAL_PIECES);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);

  // Keep state
  const [keepView, setKeepView] = useState<'list' | 'room'>('list');
  const [keepCategory, setKeepCategory] = useState<KeepCategory>('All');
  const [selectedDetailItem, setSelectedDetailItem] = useState<{ type: 'card' | 'deck' | 'map' | 'piece' | 'campaign'; item: any } | null>(null);

  // Creation station state
  const [creationMode, setCreationMode] = useState<'home' | 'card-editor' | 'deck-editor'>('home');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);

  // Realm crafter state
  const [realmFunction, setRealmFunction] = useState<'runner' | 'crafter'>('runner');
  const [realmRunnerView, setRealmRunnerView] = useState<'gallery' | 'new-flow' | 'templates' | 'editor'>('gallery');
  const [editingMapId, setEditingMapId] = useState<string | null>(null);

  // Master crafter state
  const [masterCrafterView, setMasterCrafterView] = useState<'gallery' | 'new-flow' | 'viewer'>('gallery');
  const [activePieceId, setActivePieceId] = useState<string | null>(INITIAL_PIECES[0].id);

  // Campaign Command state
  const [campaignView, setCampaignView] = useState<'list' | 'gallery' | 'workbench' | 'detail' | 'play'>('list');
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(INITIAL_CAMPAIGNS[0].id);

  // AI engine state
  const [aiProvider, setAiProvider] = useState<AIProvider>('Paid');
  const [aiStatus, setAiStatus] = useState<AIStatusDetail>({
    status: 'Live',
    model: 'Gemini 2.5 Pro / Neural Splat v2.4',
    latency: '42ms',
    queueDepth: 1,
    memoryUsed: '2.4 GB',
  });
  const [aiApiKey, setAiApiKey] = useState<string>('df-live-49102-kaldor-alpha');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Mutators
  const saveCard = (card: CardItem) => {
    setCards((prev) => {
      const idx = prev.findIndex((c) => c.id === card.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = card;
        return next;
      }
      return [card, ...prev];
    });
    showToast(`Card "${card.name}" saved to Keep`);
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    if (selectedDetailItem?.item.id === id) setSelectedDetailItem(null);
    showToast('Card deleted from Keep');
  };

  const saveDeck = (deck: DeckItem) => {
    setDecks((prev) => {
      const idx = prev.findIndex((d) => d.id === deck.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = deck;
        return next;
      }
      return [deck, ...prev];
    });
    showToast(`Deck "${deck.name}" saved to Keep`);
  };

  const deleteDeck = (id: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== id));
    if (selectedDetailItem?.item.id === id) setSelectedDetailItem(null);
    showToast('Deck deleted from Keep');
  };

  const saveMap = (map: MapItem) => {
    setMaps((prev) => {
      const idx = prev.findIndex((m) => m.id === map.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = map;
        return next;
      }
      return [map, ...prev];
    });
    showToast(`Map "${map.name}" saved to Keep`);
  };

  const deleteMap = (id: string) => {
    setMaps((prev) => prev.filter((m) => m.id !== id));
    if (selectedDetailItem?.item.id === id) setSelectedDetailItem(null);
    showToast('Map deleted from Keep');
  };

  const savePiece = (piece: ThreePieceItem) => {
    setPieces((prev) => {
      const idx = prev.findIndex((p) => p.id === piece.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = piece;
        return next;
      }
      return [piece, ...prev];
    });
    showToast(`3D Piece "${piece.name}" saved to Keep`);
  };

  const deletePiece = (id: string) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
    if (selectedDetailItem?.item.id === id) setSelectedDetailItem(null);
    showToast('3D Piece deleted from Keep');
  };

  const saveCampaign = (campaign: CampaignItem) => {
    setCampaigns((prev) => {
      const idx = prev.findIndex((c) => c.id === campaign.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = campaign;
        return next;
      }
      return [campaign, ...prev];
    });
    showToast(`Campaign "${campaign.name}" saved to Keep`);
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    if (selectedDetailItem?.item.id === id) setSelectedDetailItem(null);
    showToast('Campaign deleted from Keep');
  };

  // High-level navigation helpers
  const openCardEditor = (id?: string) => {
    setEditingCardId(id || null);
    setCreationMode('card-editor');
    setRoom('creation');
  };

  const openDeckEditor = (id?: string) => {
    setEditingDeckId(id || null);
    setCreationMode('deck-editor');
    setRoom('creation');
  };

  const openMapEditor = (id?: string) => {
    setEditingMapId(id || null);
    setRealmFunction('runner');
    setRealmRunnerView('editor');
    setRoom('realm');
  };

  const openNewMapFlow = () => {
    setRealmFunction('runner');
    setRealmRunnerView('templates');
    setRoom('realm');
  };

  const openPieceViewer = (id: string) => {
    setActivePieceId(id);
    setRealmFunction('crafter');
    setMasterCrafterView('viewer');
    setRoom('realm');
  };

  const openNewPieceFlow = () => {
    setRealmFunction('crafter');
    setMasterCrafterView('new-flow');
    setRoom('realm');
  };

  const openCampaignWorkbench = (id?: string) => {
    setActiveCampaignId(id || null);
    setCampaignView('workbench');
    setRoom('campaign');
  };

  const openCampaignDetail = (id: string) => {
    setActiveCampaignId(id);
    setCampaignView('detail');
    setRoom('campaign');
  };

  const openCampaignPlay = (id: string) => {
    setActiveCampaignId(id);
    setCampaignView('play');
    setRoom('campaign');
  };

  return (
    <AppContext.Provider
      value={{
        currentRoom,
        setRoom,
        setCurrentRoom: setRoom,
        cards,
        decks,
        maps,
        pieces,
        campaigns,
        saveCard,
        deleteCard,
        saveDeck,
        deleteDeck,
        saveMap,
        deleteMap,
        savePiece,
        deletePiece,
        saveCampaign,
        deleteCampaign,

        keepView,
        setKeepView,
        keepCategory,
        setKeepCategory,
        selectedDetailItem,
        setSelectedDetailItem,

        creationMode,
        setCreationMode,
        editingCardId,
        setEditingCardId,
        editingDeckId,
        setEditingDeckId,
        openCardEditor,
        openDeckEditor,

        realmFunction,
        setRealmFunction,
        realmMode: realmFunction,
        setRealmMode: setRealmFunction,
        realmRunnerView,
        setRealmRunnerView,
        editingMapId,
        openMapEditor,
        openNewMapFlow,

        masterCrafterView,
        setMasterCrafterView,
        activePieceId,
        viewingPieceId: activePieceId,
        openPieceViewer,
        openNewPieceFlow,

        campaignView,
        setCampaignView,
        activeCampaignId,
        editingCampaignId: activeCampaignId,
        openCampaignWorkbench,
        openCampaignDetail,
        openCampaignPlay,

        aiProvider,
        setAiProvider,
        aiStatus,
        setAiStatus,
        aiApiKey,
        setAiApiKey,

        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
