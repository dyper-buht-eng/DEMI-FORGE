import React from 'react';
import { CardItem, CardRarity, CardCategory } from '../types';
import { 
  Shield, 
  Sparkles, 
  Flame, 
  Skull, 
  Zap, 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  Crosshair 
} from 'lucide-react';

interface CardRenderProps {
  card: CardItem;
  scale?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  interactive?: boolean;
}

export const CardRender: React.FC<CardRenderProps> = ({
  card,
  scale = 'md',
  onClick,
  interactive = false,
}) => {
  const getRarityColors = (rarity: CardRarity) => {
    switch (rarity) {
      case 'Artifact':
        return {
          border: 'border-amber-400',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accent: 'text-amber-400',
          gradient: 'from-amber-950/40 via-zinc-900 to-black',
        };
      case 'Mythic':
        return {
          border: 'border-rose-500',
          glow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          accent: 'text-rose-400',
          gradient: 'from-rose-950/40 via-zinc-900 to-black',
        };
      case 'Rare':
        return {
          border: 'border-blue-400',
          glow: 'shadow-[0_0_16px_rgba(96,165,250,0.2)]',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          accent: 'text-blue-400',
          gradient: 'from-blue-950/40 via-zinc-900 to-black',
        };
      case 'Uncommon':
        return {
          border: 'border-emerald-400',
          glow: 'shadow-[0_0_12px_rgba(52,211,153,0.15)]',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          accent: 'text-emerald-400',
          gradient: 'from-emerald-950/30 via-zinc-900 to-black',
        };
      default: // Common
        return {
          border: 'border-zinc-700',
          glow: 'shadow-[0_0_10px_rgba(0,0,0,0.5)]',
          badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          accent: 'text-zinc-300',
          gradient: 'from-zinc-900 via-zinc-900 to-black',
        };
    }
  };

  const getCategoryIcon = (cat: CardCategory) => {
    switch (cat) {
      case 'Actor':
        return <User className="w-3 h-3" />;
      case 'Monster':
        return <Skull className="w-3 h-3" />;
      case 'Trap':
        return <Crosshair className="w-3 h-3" />;
      case 'Spell':
        return <Sparkles className="w-3 h-3" />;
      case 'Item':
        return <Package className="w-3 h-3" />;
      case 'Location':
        return <MapPin className="w-3 h-3" />;
      case 'Event':
        return <Calendar className="w-3 h-3" />;
      default:
        return <Zap className="w-3 h-3" />;
    }
  };

  const colors = getRarityColors(card.rarity);

  const sizeClasses = {
    sm: 'w-48 h-72 text-[10px]',
    md: 'w-64 h-96 text-xs',
    lg: 'w-80 h-[480px] text-sm',
  }[scale];

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-2.5 bg-gradient-to-b ${colors.gradient} border-2 ${colors.border} ${colors.glow} flex flex-col justify-between select-none overflow-hidden transition-all duration-200 ${sizeClasses} ${
        interactive ? 'hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer hover:border-amber-400/90' : ''
      }`}
    >
      {/* Subtle top glare */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-xl" />

      {/* Card Header */}
      <div className="relative z-10 flex items-start justify-between gap-1.5 pb-1.5 border-b border-zinc-800/80">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5">
            <h3 className="font-display font-bold text-zinc-100 truncate tracking-wide leading-tight">
              {card.name || 'Untitled Card'}
            </h3>
          </div>
          <p className="text-[10px] text-zinc-400 truncate italic">
            {card.subtitle || 'Card Subtitle'}
          </p>
        </div>

        {/* Cost Mana Orb */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 border border-amber-300 shadow-md flex items-center justify-center font-mono-code font-bold text-zinc-950 text-xs shrink-0">
          {card.cost}
        </div>
      </div>

      {/* Art Frame */}
      <div className="relative z-10 my-1.5 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 h-32 flex items-center justify-center shrink-0">
        {card.artUrl ? (
          <img
            src={card.artUrl}
            alt={card.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-600 text-center p-2">
            <Sparkles className="w-6 h-6 mb-1 text-amber-500/40" />
            <span className="text-[10px]">No illustration</span>
          </div>
        )}

        {/* Category Badge overlay */}
        <div className="absolute bottom-1.5 left-1.5 flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-sm border border-zinc-700/80 text-[10px] font-medium text-zinc-200">
          {getCategoryIcon(card.category)}
          <span>{card.category}</span>
        </div>

        {/* Rarity Pill overlay */}
        <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono-code uppercase font-semibold border ${colors.badge} backdrop-blur-sm bg-black/60`}>
          {card.rarity}
        </div>
      </div>

      {/* Keywords bar */}
      {card.keywords && card.keywords.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1 mb-1">
          {card.keywords.map((kw, i) => (
            <span
              key={i}
              className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-300"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Rules Box */}
      <div className="relative z-10 flex-1 min-h-[56px] rounded-lg bg-zinc-950/80 border border-zinc-800/90 p-2 overflow-y-auto">
        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
          {card.rulesText || 'No rules text defined.'}
        </p>

        {card.flavorText && (
          <p className="text-[10px] text-zinc-500 italic mt-1.5 pt-1.5 border-t border-zinc-900">
            "{card.flavorText}"
          </p>
        )}
      </div>

      {/* Footer Attributes (ATK / DEF / Durability / etc.) */}
      {card.attributes && card.attributes.length > 0 && (
        <div className="relative z-10 mt-1.5 pt-1 flex items-center justify-between gap-1 text-[10px] font-mono-code">
          {card.attributes.map((attr) => (
            <div
              key={attr.id}
              className="flex-1 text-center py-0.5 px-1 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-300 flex items-center justify-between"
            >
              <span className="text-zinc-500 text-[9px]">{attr.label}</span>
              <span className="font-bold text-amber-400">{attr.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
