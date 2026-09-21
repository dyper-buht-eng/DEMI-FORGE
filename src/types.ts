export type RoomId = 
  | 'profile' 
  | 'keep' 
  | 'creation' 
  | 'realm' 
  | 'campaign' 
  | 'engine';

export type CardCategory = 
  | 'Actor' 
  | 'Monster' 
  | 'Trap' 
  | 'Spell' 
  | 'Item' 
  | 'Location' 
  | 'Event';

export type CardRarity = 'Common' | 'Uncommon' | 'Rare' | 'Mythic' | 'Artifact';

export interface CardAttribute {
  id: string;
  label: string;
  value: string;
}

export interface CardItem {
  id: string;
  name: string;
  subtitle: string;
  cost: number;
  category: CardCategory;
  rarity: CardRarity;
  keywords: string[];
  rulesText: string;
  flavorText: string;
  attributes: CardAttribute[];
  artUrl: string;
  artStyle?: string;
  updatedAt: string;
  tags: string[];
}

export interface DeckItem {
  id: string;
  name: string;
  description: string;
  cardIds: string[];
  coverArt?: string;
  updatedAt: string;
  tags: string[];
  format: 'Standard' | 'Commander' | 'Dungeon Crawl';
}

export type MapEngine = 'Mipui' | 'Godot' | 'Unreal';

export type MapPieceKind = 
  | 'door' 
  | 'wall' 
  | 'terrain' 
  | 'chest' 
  | 'trap' 
  | 'npc' 
  | 'monster' 
  | 'decoration';

export interface PlacedMapPiece {
  id: string;
  x: number;
  y: number;
  kind: MapPieceKind;
  name: string;
  size: number; // in tiles, e.g. 1
  rotation: number; // 0, 90, 180, 270
  zOrder: number;
  color?: string;
  icon?: string;
}

export interface MapItem {
  id: string;
  name: string;
  width: number;
  height: number;
  engine: MapEngine;
  templateId?: string;
  description: string;
  pieces: PlacedMapPiece[];
  terrainGrid: string[][]; // 2D grid storing tile type: 'stone' | 'wood' | 'grass' | 'water' | 'dirt' | 'carpet'
  updatedAt: string;
  tags: string[];
  thumbnailUrl?: string;
}

export type PieceCategory = 'Avatars' | 'Items' | 'Effects' | 'Buildings';

export interface ThreePieceItem {
  id: string;
  name: string;
  category: PieceCategory;
  sourceImage: string;
  modelUrl?: string;
  generator: string; // e.g. "Forge3D NeRF / Voxel Engine v2.4"
  size: string; // e.g. "1x1", "32mm heroic"
  polyCount?: string;
  geometryType?: 'axe' | 'chest' | 'creature' | 'portal' | 'gargoyle' | 'knight' | 'crystal' | 'custom';
  colorHex?: string;
  wireframe?: boolean;
  updatedAt: string;
  tags: string[];
  description?: string;
}

export interface CampaignEntry {
  id: string;
  type: 'card' | 'map' | 'piece';
  referenceId: string;
  title: string;
  note: string;
}

export interface CampaignItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  status: 'Draft' | 'Ready' | 'Active';
  entries?: CampaignEntry[];
  updatedAt: string;
  levelTier?: string;
  system: string;
  coverImage?: string;
  playerCount: number;
  nextSession: string;
  notes: string;
  npcs: string[];
  encounters: string[];
}

export type KeepCategory = 
  | 'All'
  | 'Cards' 
  | 'Decks' 
  | 'Maps' 
  | 'Pieces' 
  | 'Campaigns' 
  | 'Avatars' 
  | 'Items' 
  | 'Effects' 
  | 'Buildings' 
  | 'Audio' 
  | 'Renders';

export interface AIStatusDetail {
  status: 'Live' | 'Offline' | 'Needs key' | 'Needs setup';
  model: string;
  latency: string;
  queueDepth: number;
  memoryUsed: string;
}

export type AIStatus = 'Live' | 'Offline' | 'Needs key' | 'Needs setup';
export type AIProvider = 'Local' | 'Free' | 'Paid';
